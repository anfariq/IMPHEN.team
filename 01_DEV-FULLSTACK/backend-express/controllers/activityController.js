const supabase = require('../config/supabase');
const moment = require('moment');
const { updateDailySummary } = require('./summaryController'); 

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

        const { data: activity } = await supabase.from('activities').select('*').eq('id', activity_id).single();
        if (!activity) return res.status(404).json({ message: 'Aktivitas tidak ditemukan' });

        const weight = user.profiles?.[0]?.weight || 60;

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

        if (typeof updateDailySummary === 'function') {
            updateDailySummary(user.id);
        }

        return res.status(201).json(burnRecord);
    } catch (error) {
        return res.status(500).json({ message: 'Gagal mencatat aktivitas.', error: error.message });
    }
};

exports.history = async (req, res) => {
    try {
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

const getWibDateOnly = (isoString) => {
    if (!isoString) return null;
    return new Date(isoString).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
};

exports.getWeeklyActivity = async (req, res) => {
    try {
        const user = req.user;
        const daysId = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const monthsId = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];

        const weeklyData = [];
        const dateStringsWib = [];

        const nowMs = Date.now();
        for (let i = 0; i <= 6; i++) {
            const d = new Date(nowMs - (i * 24 * 60 * 60 * 1000));
            
            const dateString = d.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' });
            dateStringsWib.push(dateString);

            const localD = new Date(`${dateString}T00:00:00`); 
            const dayName = daysId[localD.getDay()];
            const monthName = monthsId[localD.getMonth()];
            const dateFormatted = `${dayName}, ${String(localD.getDate()).padStart(2, '0')} ${monthName} ${localD.getFullYear()}`;

            weeklyData.push({
                date: dateString,
                date_formatted: dateFormatted,
                summary: null,
                activities: [],
                foods: []
            });
        }

        const endDateWib = dateStringsWib[0];
        const startDateWib = dateStringsWib[6];

        const startQuery = `${startDateWib}T00:00:00.000+07:00`;
        const endQuery = `${endDateWib}T23:59:59.999+07:00`;

        const [summariesReq, activitiesReq, foodsReq] = await Promise.all([
            supabase.from('daily_summaries').select('*').eq('user_id', user.id).gte('date', startDateWib).lte('date', endDateWib),
            supabase.from('user_activity_burns').select('*, activity:activities(*)').eq('user_id', user.id).gte('created_at', startQuery).lte('created_at', endQuery).order('created_at', { ascending: false }),
            supabase.from('user_food_intakes').select('*, food:foods(*)').eq('user_id', user.id).gte('consumed_at', startQuery).lte('consumed_at', endQuery).order('consumed_at', { ascending: false })
        ]);

        const summaries = summariesReq.data || [];
        const activities = activitiesReq.data || [];
        const foods = foodsReq.data || [];

        weeklyData.forEach(dayBucket => {
            dayBucket.summary = summaries.find(s => s.date === dayBucket.date) || null;
            
            dayBucket.activities = activities.filter(a => getWibDateOnly(a.created_at) === dayBucket.date);
            dayBucket.foods = foods.filter(f => getWibDateOnly(f.consumed_at) === dayBucket.date);
        });

        return res.status(200).json({
            status: 'success',
            message: 'Data aktivitas mingguan berhasil diambil.',
            data: {
                start_date: startDateWib,
                end_date: endDateWib,
                weekly_logs: weeklyData 
            }
        });
    } catch (error) {
        console.error("Weekly Error:", error);
        return res.status(500).json({ message: 'Gagal merender grafik mingguan.' });
    }
};