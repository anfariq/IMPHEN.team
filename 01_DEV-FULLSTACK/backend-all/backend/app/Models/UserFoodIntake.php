<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserFoodIntake extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh diisi.
     * Sesuai fitur nomor 4: Catatan makan harian.
     */
    protected $fillable = [
        'user_id',
        'food_id',
        'qty_grams',      // Jumlah gram yang dimakan
        'total_calories', // Hasil hitung (qty * calories_per_100g / 100)
        'consumed_at',    // Tanggal dan waktu makan
    ];

    /**
     * Pastikan kolom 'consumed_at' dibaca sebagai objek tanggal (Carbon)
     */
    protected $casts = [
        'consumed_at' => 'datetime',
    ];

    /**
     * Relasi: Satu catatan makan dimiliki oleh satu User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi: Satu catatan makan merujuk ke satu jenis Makanan.
     * Digunakan untuk mengambil nama makanan: $intake->food->name
     */
    public function food(): BelongsTo
    {
        return $this->belongsTo(Food::class);
    }
}