const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_untuk_development_harus_diganti';

const protect = async (req, res, next) => {
    let token;

    // Cek apakah ada header Authorization dan formatnya Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Ambil token dari header (Bearer <token>)
            token = req.headers.authorization.split(' ')[1];

            // Verifikasi token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Ambil data user dari database beserta profilnya (Mirip $request->user() di Laravel)
            const { data: user, error } = await supabase
                .from('users')
                .select('*, profiles(*)')
                .eq('id', decoded.user_id)
                .single();

            if (error || !user) {
                return res.status(401).json({ message: 'Tidak diizinkan, user tidak ditemukan' });
            }

            // Masukkan data user ke dalam request agar bisa diakses oleh controller
            req.user = user;
            
            // Lanjut ke controller berikutnya
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Tidak diizinkan, token gagal divalidasi' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Tidak diizinkan, tidak ada token' });
    }
};

module.exports = { protect };