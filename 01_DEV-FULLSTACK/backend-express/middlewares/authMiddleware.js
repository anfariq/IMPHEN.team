const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_untuk_development_harus_diganti';

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, JWT_SECRET);

            const { data: user, error } = await supabase
                .from('users')
                .select('*, profiles(*)')
                .eq('id', decoded.user_id)
                .single();

            if (error || !user) {
                return res.status(401).json({ message: 'Tidak diizinkan, user tidak ditemukan' });
            }

            req.user = user;
            
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