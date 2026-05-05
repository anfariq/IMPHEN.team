<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Food extends Model
{
    use HasFactory;

    /**
     * Tentukan tabel jika namanya bukan 'foods' (opsional, tapi bagus untuk kejelasan)
     */
    protected $table = 'foods';

    /**
     * Kolom yang boleh diisi (Mass Assignment).
     * Sesuai dengan rencana fitur nomor 3: Nama, Kalori, dan Gizi.
     */
    protected $fillable = [
        'name',
        'calories',
        'protein',
        'fat',
        'carbs',
        'image_url'
    ];

    /**
     * Relasi: Satu jenis makanan bisa dicatat berkali-kali oleh banyak user.
     * Hubungan ke tabel UserFoodIntake.
     */
    public function intakes(): HasMany
    {
        return $this->hasMany(UserFoodIntake::class);
    }
}