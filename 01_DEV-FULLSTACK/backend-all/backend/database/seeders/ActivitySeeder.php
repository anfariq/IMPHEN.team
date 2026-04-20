<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Activity;
use Illuminate\Support\Facades\Schema; // <--- 1. TAMBAHKAN INI

class ActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        // Kosongkan tabel terlebih dahulu
        Activity::truncate();

        // 3. NYALAKAN KEMBALI PENGECEKAN FOREIGN KEY
        Schema::enableForeignKeyConstraints();

        Activity::insert([
            // ================= CARDIO =================
            ['name' => 'Running (slow, 8 km/h)', 'met_value' => 8.3, 'category' => 'Cardio'],
            ['name' => 'Running (moderate, 10 km/h)', 'met_value' => 9.8, 'category' => 'Cardio'],
            ['name' => 'Running (fast, 12+ km/h)', 'met_value' => 11.5, 'category' => 'Cardio'],
            ['name' => 'Jogging in place', 'met_value' => 8.0, 'category' => 'Cardio'],
            ['name' => 'Walking (slow, stroll)', 'met_value' => 2.0, 'category' => 'Cardio'],
            ['name' => 'Walking (normal, 5 km/h)', 'met_value' => 3.5, 'category' => 'Cardio'],
            ['name' => 'Walking (brisk/fast)', 'met_value' => 5.0, 'category' => 'Cardio'],
            ['name' => 'Cycling (leisure/light)', 'met_value' => 4.0, 'category' => 'Cardio'],
            ['name' => 'Cycling (moderate)', 'met_value' => 7.5, 'category' => 'Cardio'],
            ['name' => 'Cycling (vigorous/fast)', 'met_value' => 10.0, 'category' => 'Cardio'],
            ['name' => 'Stationary Bike (light)', 'met_value' => 3.0, 'category' => 'Cardio'],
            ['name' => 'Stationary Bike (moderate)', 'met_value' => 6.8, 'category' => 'Cardio'],
            ['name' => 'Stationary Bike (vigorous)', 'met_value' => 10.5, 'category' => 'Cardio'],
            ['name' => 'Jump Rope (slow)', 'met_value' => 8.8, 'category' => 'Cardio'],
            ['name' => 'Jump Rope (fast)', 'met_value' => 12.3, 'category' => 'Cardio'],
            ['name' => 'Elliptical Trainer', 'met_value' => 5.0, 'category' => 'Cardio'],
            ['name' => 'Rowing Machine (moderate)', 'met_value' => 7.0, 'category' => 'Cardio'],
            ['name' => 'Rowing Machine (vigorous)', 'met_value' => 8.5, 'category' => 'Cardio'],
            ['name' => 'Stair Climber Machine', 'met_value' => 9.0, 'category' => 'Cardio'],

            // ================= GYM & STRENGTH =================
            ['name' => 'Weight Lifting (light/machines)', 'met_value' => 3.0, 'category' => 'Gym'],
            ['name' => 'Weight Lifting (moderate/free weights)', 'met_value' => 5.0, 'category' => 'Gym'],
            ['name' => 'Weight Lifting (heavy/powerlifting)', 'met_value' => 6.0, 'category' => 'Gym'],
            ['name' => 'Bodyweight Workout (Pushups, Situps)', 'met_value' => 8.0, 'category' => 'Gym'],
            ['name' => 'Circuit Training (minimal rest)', 'met_value' => 8.0, 'category' => 'Gym'],
            ['name' => 'Crossfit / Bootcamp', 'met_value' => 10.0, 'category' => 'Gym'],
            ['name' => 'Kettlebell Workout', 'met_value' => 9.8, 'category' => 'Gym'],
            ['name' => 'Stretching / Mobility', 'met_value' => 2.3, 'category' => 'Gym'],
            ['name' => 'Calisthenics (vigorous)', 'met_value' => 8.0, 'category' => 'Gym'],

            // ================= FITNESS & CLASSES =================
            ['name' => 'Yoga (Hatha/Restorative)', 'met_value' => 2.5, 'category' => 'Fitness'],
            ['name' => 'Yoga (Vinyasa/Power)', 'met_value' => 4.0, 'category' => 'Fitness'],
            ['name' => 'Pilates', 'met_value' => 3.0, 'category' => 'Fitness'],
            ['name' => 'Zumba / Dance Fitness', 'met_value' => 6.5, 'category' => 'Fitness'],
            ['name' => 'Aerobics (low impact)', 'met_value' => 5.0, 'category' => 'Fitness'],
            ['name' => 'Aerobics (high impact)', 'met_value' => 7.3, 'category' => 'Fitness'],
            ['name' => 'HIIT (High Intensity)', 'met_value' => 9.0, 'category' => 'Fitness'],

            // ================= SPORTS =================
            ['name' => 'Football (Soccer, competitive)', 'met_value' => 10.0, 'category' => 'Sports'],
            ['name' => 'Football (Soccer, casual)', 'met_value' => 7.0, 'category' => 'Sports'],
            ['name' => 'Basketball (game)', 'met_value' => 8.0, 'category' => 'Sports'],
            ['name' => 'Basketball (shooting hoops)', 'met_value' => 4.5, 'category' => 'Sports'],
            ['name' => 'Badminton (social)', 'met_value' => 5.5, 'category' => 'Sports'],
            ['name' => 'Badminton (competitive)', 'met_value' => 7.0, 'category' => 'Sports'],
            ['name' => 'Tennis (singles)', 'met_value' => 8.0, 'category' => 'Sports'],
            ['name' => 'Tennis (doubles)', 'met_value' => 6.0, 'category' => 'Sports'],
            ['name' => 'Volleyball (gym/beach)', 'met_value' => 4.0, 'category' => 'Sports'],
            ['name' => 'Table Tennis (Ping Pong)', 'met_value' => 4.0, 'category' => 'Sports'],
            ['name' => 'Golf (walking, carrying clubs)', 'met_value' => 4.5, 'category' => 'Sports'],
            ['name' => 'Rugby', 'met_value' => 10.0, 'category' => 'Sports'],
            ['name' => 'Baseball / Softball', 'met_value' => 5.0, 'category' => 'Sports'],
            ['name' => 'Gymnastics', 'met_value' => 4.0, 'category' => 'Sports'],

            // ================= MARTIAL ARTS =================
            ['name' => 'Boxing (punching bag)', 'met_value' => 5.5, 'category' => 'Martial Arts'],
            ['name' => 'Boxing (sparring)', 'met_value' => 9.0, 'category' => 'Martial Arts'],
            ['name' => 'Karate / Taekwondo', 'met_value' => 10.0, 'category' => 'Martial Arts'],
            ['name' => 'Judo / BJJ / Wrestling', 'met_value' => 10.0, 'category' => 'Martial Arts'],
            ['name' => 'Muay Thai / Kickboxing', 'met_value' => 10.0, 'category' => 'Martial Arts'],
            ['name' => 'Tai Chi', 'met_value' => 1.5, 'category' => 'Martial Arts'],

            // ================= WATER =================
            ['name' => 'Swimming (leisure/light)', 'met_value' => 6.0, 'category' => 'Water'],
            ['name' => 'Swimming (freestyle, moderate)', 'met_value' => 8.0, 'category' => 'Water'],
            ['name' => 'Swimming (freestyle, fast/laps)', 'met_value' => 10.0, 'category' => 'Water'],
            ['name' => 'Water Aerobics', 'met_value' => 5.3, 'category' => 'Water'],
            ['name' => 'Surfing / Bodyboarding', 'met_value' => 3.0, 'category' => 'Water'],
            ['name' => 'Kayaking / Canoeing', 'met_value' => 5.0, 'category' => 'Water'],
            ['name' => 'Scuba Diving', 'met_value' => 7.0, 'category' => 'Water'],
            ['name' => 'Snorkeling', 'met_value' => 5.0, 'category' => 'Water'],

            // ================= OUTDOOR & RECREATION =================
            ['name' => 'Hiking (cross country)', 'met_value' => 6.0, 'category' => 'Outdoor'],
            ['name' => 'Hiking (with heavy backpack)', 'met_value' => 7.8, 'category' => 'Outdoor'],
            ['name' => 'Rock Climbing', 'met_value' => 8.0, 'category' => 'Outdoor'],
            ['name' => 'Skateboarding', 'met_value' => 5.0, 'category' => 'Outdoor'],
            ['name' => 'Rollerblading / Inline Skating', 'met_value' => 7.0, 'category' => 'Outdoor'],

            // ================= DAILY & LIFESTYLE =================
            ['name' => 'Cleaning House (light)', 'met_value' => 2.5, 'category' => 'Daily'],
            ['name' => 'Mopping / Vacuuming', 'met_value' => 3.5, 'category' => 'Daily'],
            ['name' => 'Cooking / Food Prep', 'met_value' => 2.5, 'category' => 'Daily'],
            ['name' => 'Gardening / Yard Work', 'met_value' => 4.0, 'category' => 'Daily'],
            ['name' => 'Washing Car', 'met_value' => 3.0, 'category' => 'Daily'],
            ['name' => 'Moving Furniture', 'met_value' => 6.0, 'category' => 'Daily'],
            ['name' => 'Climbing Stairs', 'met_value' => 8.8, 'category' => 'Daily'],
            ['name' => 'Grocery Shopping', 'met_value' => 2.3, 'category' => 'Daily'],
            ['name' => 'Playing with Kids (active)', 'met_value' => 5.0, 'category' => 'Daily'],
            ['name' => 'Office Work / Desk Job', 'met_value' => 1.5, 'category' => 'Daily'],
            ['name' => 'Driving (Car)', 'met_value' => 1.5, 'category' => 'Daily'],
        ]);
    }
}