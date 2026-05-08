const supabase = require('../config/supabase');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendPasswordResetEmail } = require('../utils/mailer');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_untuk_development_harus_diganti';

// 1. Kirim Email Link Reset (Lupa Password)
exports.sendResetLinkEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email wajib diisi.' });

        // Cek apakah user ada
        const { data: user, error } = await supabase.from('users').select('id, email').eq('email', email).single();
        if (error || !user) return res.status(400).json({ message: 'Email tidak ditemukan di sistem kami.' });

        // Generate Token JWT khusus reset password (berlaku 60 menit)
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // Ambil FRONTEND_URL dari .env (Fallback ke Vercel URL yang ada di kodemu sebelumnya)
        const frontendUrl = process.env.FRONTEND_URL || 'https://frontend-kohl-beta-61.vercel.app';
        const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${user.email}`;

        // Kirim via Resend
        await sendPasswordResetEmail(user.email, resetLink);

        return res.status(200).json({ message: 'Link reset password telah dikirim ke email Anda.' });
    } catch (error) {
        return res.status(500).json({ message: 'Gagal mengirim link reset password.', error: error.message });
    }
};

// 2. Proses Reset Password Baru
exports.reset = async (req, res) => {
    try {
        const { token, email, password, password_confirmation } = req.body;

        if (!token || !email || !password || !password_confirmation) {
            return res.status(400).json({ message: 'Semua kolom wajib diisi.' });
        }
        if (password !== password_confirmation) {
            return res.status(400).json({ message: 'Konfirmasi password tidak cocok.' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password minimal 8 karakter.' });
        }

        // Verifikasi apakah token valid dan belum kedaluwarsa
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa (lebih dari 60 menit).' });
        }

        // Pastikan email di dalam token sama dengan email yang mau direset
        if (decoded.email !== email) {
            return res.status(400).json({ message: 'Token ini bukan untuk email Anda.' });
        }

        // Hash password baru
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update password di database
        const { error } = await supabase.from('users').update({ password: hashedPassword }).eq('email', email);
        if (error) throw error;

        return res.status(200).json({ message: 'Password berhasil diubah.' });
    } catch (error) {
        return res.status(500).json({ message: 'Terjadi kesalahan sistem.', error: error.message });
    }
};