const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);
const fromFormat = `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`;

const sendOtpEmail = async (email, name, otpCode) => {
    const htmlContent = `
        <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;'>
            <h2 style='color: #0f172a; text-align: center;'>Selamat datang di Healthy AI! 🌱</h2>
            <p style='color: #475569; font-size: 16px;'>Halo <b>${name}</b>,</p>
            <p style='color: #475569; font-size: 16px;'>Terima kasih telah mendaftar. Untuk menyelesaikan registrasi dan mengaktifkan akun Anda, silakan masukkan kode verifikasi berikut:</p>
            <div style='text-align: center; margin: 30px 0;'>
                <span style='font-size: 36px; font-weight: bold; color: #10B981; letter-spacing: 10px; background: #ecfdf5; padding: 15px 30px; border-radius: 8px; display: inline-block;'>${otpCode}</span>
            </div>
            <p style='color: #64748b; font-size: 14px;'>Kode ini berlaku untuk sesi ini dan bersifat rahasia. Jangan berikan kode ini kepada siapa pun.</p>
        </div>
    `;

    return await resend.emails.send({
        from: fromFormat,
        to: [email],
        subject: 'Kode Verifikasi Akun Healthy AI',
        html: htmlContent
    });
};

const sendResendOtpEmail = async (email, name, otpCode) => {
    const htmlContent = `
        <div style='font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;'>
            <h2 style='color: #0f172a; text-align: center;'>Kode OTP Baru Anda 🔄</h2>
            <p style='color: #475569; font-size: 16px;'>Halo <b>${name}</b>,</p>
            <p style='color: #475569; font-size: 16px;'>Kami menerima permintaan untuk mengirimkan ulang kode verifikasi Anda. Berikut adalah kode OTP baru Anda:</p>
            <div style='text-align: center; margin: 30px 0;'>
                <span style='font-size: 36px; font-weight: bold; color: #3b82f6; letter-spacing: 10px; background: #eff6ff; padding: 15px 30px; border-radius: 8px; display: inline-block;'>${otpCode}</span>
            </div>
            <p style='color: #64748b; font-size: 14px;'>Kode ini akan menggantikan kode sebelumnya. Jangan berikan kode ini kepada siapa pun.</p>
        </div>
    `;
    return await resend.emails.send({ from: fromFormat, to: [email], subject: 'Kirim Ulang: Kode Verifikasi Healthy AI', html: htmlContent });
};

// 3. Email Reset Password
const sendPasswordResetEmail = async (email, resetLink) => {
    const currentYear = new Date().getFullYear();
    const htmlContent = `
    <div style="background-color: #edf2f7; margin: 0; padding: 50px 0; width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td align="center">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 570px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.04);">
                        <tr>
                            <td style="padding: 25px 35px; text-align: center;">
                                <span style="font-size: 19px; font-weight: bold; color: #3d4852;">Healthy App</span>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 35px; border-top: 1px solid #edeff2; border-bottom: 1px solid #edeff2; background-color: #ffffff;">
                                <p style="font-size: 16px; color: #718096; margin-bottom: 25px;">Hello!</p>
                                <p style="font-size: 16px; color: #718096; margin-bottom: 25px;">You are receiving this email because we received a password reset request for your account.</p>
                                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                    <tr>
                                        <td align="center">
                                            <a href="${resetLink}" style="display: inline-block; padding: 10px 25px; background-color: #2d3748; color: #ffffff; border-radius: 4px; text-decoration: none; font-weight: bold;">Reset Password</a>
                                        </td>
                                    </tr>
                                </table>
                                <p style="font-size: 14px; color: #e53e3e; margin-top: 25px; text-align: center; font-weight: 500;">This password reset link will expire in 60 minutes.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 35px; text-align: center;">
                                <p style="font-size: 12px; color: #b0adc5;">&copy; ${currentYear} Healthy App. All rights reserved.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>`;

    return await resend.emails.send({ from: fromFormat, to: [email], subject: 'Reset Password', html: htmlContent });
};

async function sendEmailRecommendation(user, data) {
    const { user_context, recommendations, last_consumed_food } = data;

    // Generate list makanan dalam bentuk HTML
    const foodListHtml = recommendations.map(food => `
        <div style="border: 1px solid #eee; border-radius: 8px; padding: 10px; margin-bottom: 10px; display: flex; align-items: center;">
            <img src="${food.image}" alt="${food.name}" style="width: 60px; height: 60px; border-radius: 5px; object-fit: cover; margin-right: 15px;">
            <div>
                <strong style="color: #2e7d32;">${food.name}</strong><br>
                <small style="color: #666;">${food.calories} kkal | Protein: ${food.protein}g</small>
            </div>
        </div>
    `).join('');

    // --- LOGIKA STATUS KALORI BARU ---
    let statusKalori = '';
    // Kita kasih toleransi misal kurang/lebih 100 kkal dianggap "Sesuai" biar realistis
    const selisih = user_context.net_calories - user_context.target_calories;
    
    if (selisih > 100) {
        statusKalori = '<span style="color: #e53e3e;">Melebihi Target ⚠️</span>'; // Merah
    } else if (selisih < -100) {
        statusKalori = '<span style="color: #d97706;">Belum Memenuhi Target 📉</span>'; // Orange
    } else {
        statusKalori = '<span style="color: #10b981;">Sesuai Target ✅</span>'; // Hijau
    }
    // ---------------------------------

    try {
        const response = await resend.emails.send({
            from: fromFormat, 
            to: user.email,
            subject: `Rekomendasi Menu Hari Ini untuk ${user.full_name} 🥗`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                    <h2 style="color: #4caf50;">Halo, ${user.full_name}!</h2>
                    <p>Berdasarkan catatanmu kemarin, kamu mengonsumsi <strong>${last_consumed_food}</strong>.</p>
                    
                    <div style="background: #f1f8e9; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Ringkasan Nutrisi Kemarin:</h3>
                        <ul style="list-style: none; padding: 0;">
                            <li>🔥 Kalori Masuk: <strong>${user_context.consumed_calories} kkal</strong></li>
                            <li>🎯 Target Harian: <strong>${user_context.target_calories} kkal</strong></li>
                            <li>📊 Status: <strong>${statusKalori}</strong></li>
                        </ul>
                    </div>

                    <h3>Rekomendasi Makanan Sehat untukmu:</h3>
                    <p style="color: #666;">Berikut adalah beberapa alternatif makanan yang mirip nutrisinya dengan ${last_consumed_food} namun tetap sehat:</p>
                    
                    ${foodListHtml}

                    <p style="margin-top: 30px; font-size: 12px; color: #999;">
                        Tetap semangat menjalani gaya hidup sehat bersama Healthy Lives & Well-being dari Devitra.id!
                    </p>
                </div>
            `
        });

        if (response.error) {
            console.error(`❌ [RESEND DITOLAK] Gagal mengirim ke ${user.email}. Alasan:`, response.error.message);
        } else {
            console.log(`✅ [SUKSES] Email terkirim ke ${user.email}. ID Resend:`, response.data.id);
        }

    } catch (err) {
        console.error(`🚨 [SISTEM ERROR] Terjadi kesalahan saat mencoba mengirim email ke ${user.email}:`, err.message);
    }
}

// Pastikan semua diekspor
module.exports = { sendOtpEmail, sendResendOtpEmail, sendPasswordResetEmail, sendEmailRecommendation };