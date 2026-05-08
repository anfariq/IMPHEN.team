const supabase = require('../config/supabase');
const moment = require('moment'); // Opsional: bantu parsing tanggal seperti Carbon di Laravel (npm install moment)

exports.index = async (req, res) => {
    try {
        const { data: activities, error } = await supabase
            .from('activities')
            .select('*')
            .order('category', { ascending: true });

        if (error) throw error;
        return res.status(200).json(activities);
    } catch (error) {
        return res.status(500).json({ message: 'Gagal mengambil data aktivitas.' });
    }
};

exports.store = async (req, res) => {
    try {
        const { activity_id, duration_minutes } = req.body;
        const user = req.user;

        // Ambil data olahraga untuk nilai MET
        const { data: activity } = await supabase.from('activities').select('*').eq('id', activity_id).single();
        if (!activity) return res.status(404).json({ message: 'Aktivitas tidak ditemukan' });

        // Ambil berat badan dari profil (default 60kg jika tidak ada)
        const weight = user.profiles?.[0]?.weight || 60;

        // Hitung kalori: (MET * Berat Badan * Durasi dalam jam)
        const burned = Math.round(activity.met_value * weight * (duration_minutes / 60));

        const { data: burnRecord, error } = await supabase
            .from('user_activity_burns')
            .insert([{
                user_id: user.id,
                activity_id: activity_id,
                duration_minutes: duration_minutes,
                calories_burned: burned,
                created_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) throw error;

        // TODO: Update Ringkasan Harian (Bisa dipanggil dari fungsi service terpisah nanti)

        return res.status(201).json(burnRecord);
    } catch (error) {
        return res.status(500).json({ message: 'Gagal mencatat aktivitas.', error: error.message });
    }
};

exports.history = async (req, res) => {
    try {
        // Mirip dengan `with('activity')` di Eloquent Laravel
        const { data: records, error } = await supabase
            .from('user_activity_burns')
            .select('*, activity:activities(*)') 
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return res.status(200).json(records);
    } catch (error) {
        return res.status(500).json({ message: 'Gagal mengambil riwayat.' });
    }
};

// Logika Weekly digabung menggunakan manipulasi array di JavaScript
exports.getWeeklyActivity = async (req, res) => {
    try {
        const user = req.user;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 6); // 7 hari terakhir

        const startIso = startDate.toISOString();
        const endIso = endDate.toISOString();

        // Tarik semua data yang dibutuhkan dalam 7 hari terakhir secara paralel
        const [summariesReq, activitiesReq, foodsReq] = await Promise.all([
            supabase.from('daily_summaries').select('*').eq('user_id', user.id).gte('date', startIso).lte('date', endIso),
            supabase.from('user_activity_burns').select('*, activity:activities(*)').eq('user_id', user.id).gte('created_at', startIso).lte('created_at', endIso).order('created_at', { ascending: false }),
            supabase.from('user_food_intakes').select('*, food:foods(*)').eq('user_id', user.id).gte('consumed_at', startIso).lte('consumed_at', endIso).order('consumed_at', { ascending: false })
        ]);

        // Helper untuk translasi hari dan bulan ke Bahasa Indonesia (Mirip Carbon Laravel)
        const daysId = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const monthsId = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

        const weeklyData = [];
        
        // Looping dari hari ini mundur ke 6 hari lalu
        for (let i = 0; i <= 6; i++) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - i);
            
            // Format YYYY-MM-DD menggunakan Local Time (Bukan UTC agar tidak geser hari)
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            // Format meniru Carbon: "Senin, 01 Mei 2026"
            const dayName = daysId[currentDate.getDay()];
            const monthName = monthsId[currentDate.getMonth()];
            const dateFormatted = `${dayName}, ${day} ${monthName} ${year}`;

            weeklyData.push({
                date: dateString,
                date_formatted: dateFormatted, // <-- INI KUNCI FIX-NYA
                summary: summariesReq.data?.find(s => s.date === dateString) || null,
                activities: activitiesReq.data?.filter(a => a.created_at.startsWith(dateString)) || [],
                foods: foodsReq.data?.filter(f => f.consumed_at.startsWith(dateString)) || []
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Data aktivitas mingguan berhasil diambil.',
            data: {
                start_date: startIso.split('T')[0],
                end_date: endIso.split('T')[0],
                weekly_logs: weeklyData // Sudah terurut dari terbaru ke terlama
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Gagal merender grafik mingguan.' });
    }
};