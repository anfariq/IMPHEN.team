const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../utils/mailer');
const crypto = require('crypto');
const { sendResendOtpEmail } = require('../utils/mailer');

const calculateAge = (dob) => {
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
};

const JWT_SECRET = process.env.JWT_SECRET || 'secret_untuk_development_harus_diganti'; 

exports.register = async (req, res) => {
    try {
        const { name, full_name, email, gender, date_of_birth, password } = req.body;

        const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
        if (existingUser) {
            return res.status(400).json({ message: 'Email sudah terdaftar.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        const { data: user, error: userError } = await supabase.from('users').insert([{
            name, full_name, email, gender, date_of_birth,
            password: hashedPassword,
            status: 'verifikasi uncomplete',
            otp_code: otpCode
        }]).select().single();

        if (userError) throw userError;

        const { error: profileError } = await supabase.from('profiles').insert([{
            user_id: user.id,
            weight: 0, height: 0, age: calculateAge(date_of_birth),
            gender, activity_level: 'sedentary'
        }]);

        if (profileError) {
            await supabase.from('users').delete().eq('id', user.id);
            throw profileError;
        }

        await sendOtpEmail(email, name, otpCode);

        return res.status(201).json({
            status: 'pending_verification',
            message: 'Registrasi berhasil! Link verifikasi telah dikirim ke email Anda.',
            email: user.email
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan data.', error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp_code } = req.body;

        const { data: user, error } = await supabase.from('users').select('*, profiles(*)').eq('email', email).single();

        if (!user || error) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        if (user.status === 'verifikasi complete') return res.status(400).json({ message: 'Akun ini sudah diverifikasi sebelumnya.' });
        if (user.otp_code !== otp_code) return res.status(400).json({ message: 'Kode verifikasi salah.' });

        await supabase.from('users').update({ status: 'verifikasi complete', otp_code: null }).eq('id', user.id);

        const token = jwt.sign({ user_id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            status: 'success',
            message: 'Email berhasil diverifikasi! Anda telah login.',
            access_token: token,
            token_type: 'Bearer',
            user: user
        });

    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan sistem.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data: user, error } = await supabase.from('users').select('*, profiles(*)').eq('email', email).single();

        if (!user || error) return res.status(401).json({ message: 'Email atau password salah.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Email atau password salah.' });

        if (user.status === 'verifikasi uncomplete') {
            return res.status(403).json({
                status: 'unverified',
                message: 'Akun Anda belum diverifikasi. Silakan masukkan kode OTP.',
                email: user.email
            });
        }

        const token = jwt.sign({ user_id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
        const sessionId = crypto.randomBytes(20).toString('hex'); 

        await supabase.from('sessions').insert([{
            id: sessionId,
            user_id: user.id,
            ip_address: req.ip,
            user_agent: req.headers['user-agent'],
            payload: Buffer.from(JSON.stringify({ user_id: user.id })).toString('base64'),
            last_activity: Math.floor(Date.now() / 1000)
        }]);

        return res.status(200).json({
            access_token: token,
            session_id: sessionId,
            token_type: 'Bearer',
            user: user
        });

    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan sistem.', error: error.message });
    }
};

exports.showProfile = async (req, res) => {
    try {
        const user = req.user;
        
        const diff_ms = Date.now() - new Date(user.date_of_birth).getTime();
        const age_dt = new Date(diff_ms);
        const currentAge = Math.abs(age_dt.getUTCFullYear() - 1970);

        return res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                age: currentAge,
            },
            profile: user.profiles[0] || null 
        });
    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan sistem.' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const { weight, height, gender, activity_level, target_calories } = req.body;

        const diff_ms = Date.now() - new Date(user.date_of_birth).getTime();
        const currentAge = Math.abs(new Date(diff_ms).getUTCFullYear() - 1970);

        let updateData = { age: currentAge }; 
        if (weight !== undefined) updateData.weight = weight;
        if (height !== undefined) updateData.height = height;
        if (gender !== undefined) updateData.gender = gender;
        if (activity_level !== undefined) updateData.activity_level = activity_level;
        if (target_calories !== undefined) updateData.target_calories = target_calories;

        const { data: updatedProfile, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;

        return res.status(200).json({
            status: 'success',
            message: 'Profil berhasil diperbarui!',
            profile: updatedProfile
        });

    } catch (error) {
        return res.status(500).json({ message: 'Gagal memperbarui profil.', error: error.message });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const user = req.user;

        await supabase.from('profiles').delete().eq('user_id', user.id);

        await supabase.from('sessions').delete().eq('user_id', user.id);

        const { error } = await supabase.from('users').delete().eq('id', user.id);

        if (error) throw error;

        return res.status(200).json({
            status: 'success',
            message: 'Akun Anda beserta seluruh datanya telah berhasil dihapus permanen.'
        });

    } catch (error) {
        return res.status(500).json({ message: 'Gagal menghapus akun.', error: error.message });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email wajib diisi.' });

        const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();

        if (error || !user) return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        if (user.status === 'verifikasi complete') return res.status(400).json({ message: 'Akun ini sudah diverifikasi. Anda bisa langsung login.' });

        const newOtpCode = Math.floor(100000 + Math.random() * 900000).toString();

        const { error: updateError } = await supabase.from('users').update({ otp_code: newOtpCode }).eq('id', user.id);
        if (updateError) throw updateError;

        await sendResendOtpEmail(user.email, user.name, newOtpCode);

        return res.status(200).json({ status: 'success', message: 'Kode OTP baru berhasil dikirim ke email Anda.' });
    } catch (err) {
        return res.status(500).json({ message: 'Gagal mengirim ulang OTP', error: err.message });
    }
};