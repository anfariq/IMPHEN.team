<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('foods', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->double('calories'); // Menggunakan double agar support koma/desimal
            $table->double('protein')->default(0);
            $table->double('fat')->default(0);
            $table->double('carbs')->default(0); // Singkatan dari Karbohidrat
            $table->text('image_url')->nullable(); // Untuk link gambar JSON atau path lokal
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('food');
    }
};
