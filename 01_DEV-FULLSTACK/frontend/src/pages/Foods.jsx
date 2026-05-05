import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodPredictor = ({ onSuccess }) => {
    // State untuk Tab Navigasi
    const [activeTab, setActiveTab] = useState('food'); // 'food' | 'water'

    // State untuk Makanan
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [gram, setGram] = useState(100);
    const [result, setResult] = useState(null);
    const [foodLoading, setFoodLoading] = useState(false);

    // State untuk Air Minum
    const [waterMl, setWaterMl] = useState('');
    const [waterLoading, setWaterLoading] = useState(false);

    // Perhitungan otomatis Gelas
    const calculatedGlasses = waterMl ? Math.round(Number(waterMl) / 250) : 0;

    // --- EFFECT & LOGIC MAKANAN ---
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search.length > 2 && activeTab === 'food') {
                fetchFoods();
            } else {
                setSuggestions([]);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search, activeTab]);

    const fetchFoods = async () => {
        try {
            const res = await axios.get(`https://gateforlaravl.vercel.app/api/foods/search?q=${search}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
                }
            });
            setSuggestions(res.data);
        } catch (err) {
            console.error("Gagal nyari makanan", err);
        }
    };

    const handleSelectFood = (food) => {
        setSelectedFood(food);
        setSearch(food.name);
        setSuggestions([]);
    };

    const handlePredictFood = async (e) => {
        e.preventDefault();
        if (!selectedFood) return alert("Pilih makanan dulu!");

        setFoodLoading(true);
        try {
            const token = localStorage.getItem('token');
            const p = parseFloat(selectedFood.protein) || 0;
            const l = parseFloat(selectedFood.fat) || 0;
            const k = parseFloat(selectedFood.carbs) || 0;
            const g = parseFloat(gram) || 100;

            const payload = {
                protein: p, lemak: l, karbohidrat: k,
                total_nutrisi: p + l + k, gram: g
            };

            const res = await axios.post('https://gateforlaravl.vercel.app/api/ml/predict-calories', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
                }
            });

            const hasilCalori = res.data.total_calories || res.data.data?.total_calories;
            setResult(res.data);

            if (hasilCalori) {
                await saveToIntake(selectedFood.id, g, hasilCalori);
            }

        } catch (err) {
            console.error("Error Detail:", err.response?.data);
            alert("Gagal proses data.");
        } finally {
            setFoodLoading(false);
        }
    };

    const saveToIntake = async (foodId, qty, calories) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://gateforlaravl.vercel.app/api/food-intake', {
                food_id: foodId,
                qty_grams: qty,
                total_calories: calories,
                consumed_at: new Date().toISOString()
            }, {
                headers: { 
                    Authorization: `Bearer ${token}` ,
                    'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
                }
            });
            console.log("History makan tersimpan!");
            if (onSuccess) onSuccess(); 
        } catch (err) {
            console.error("Gagal simpan history makan", err);
        }
    };

    // --- LOGIC AIR MINUM ---
    const handleSaveWater = async (e) => {
        e.preventDefault();
        
        // Validasi input
        if (!waterMl || calculatedGlasses <= 0) {
            return alert("Masukkan jumlah ml air yang valid (minimal 125ml untuk dihitung 1 gelas).");
        }

        setWaterLoading(true);
        try {
            const token = localStorage.getItem('token');
            
            // CATATAN: Pastikan endpoint API '/api/water' ini sudah sesuai dengan route Laravel Anda.
            // Payload mengirimkan 'water' sebagai integer (jumlah gelas).
            await axios.post('https://gateforlaravl.vercel.app/api/water', {
                water: calculatedGlasses
            }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
                }
            });
            
            console.log("Air minum tersimpan!");
            // Panggil onSuccess untuk me-refresh dashboard
            if (onSuccess) onSuccess(); 
        } catch (err) {
            console.error("Gagal simpan air", err);
            alert("Gagal mencatat air minum.");
        } finally {
            setWaterLoading(false);
        }
    };

    return (
        <div className="w-full p-6 bg-white rounded-3xl shadow-2xl border border-gray-100">
            
            {/* TABS KONTROL */}
            <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
                <button
                    onClick={() => setActiveTab('food')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'food' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    🍲 Makanan
                </button>
                <button
                    onClick={() => setActiveTab('water')}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${activeTab === 'water' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    💧 Air Minum
                </button>
            </div>

            {/* TAB: MAKANAN */}
            {activeTab === 'food' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h2 className="text-xl font-black text-gray-800 mb-1">Cari Makanan</h2>
                    <p className="text-sm text-gray-500 mb-5">Pilih dari database untuk hitung kalori.</p>

                    <form onSubmit={handlePredictFood} className="space-y-5">
                        <div className="relative">
                            <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-1">Nama Makanan</label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-400 outline-none"
                                placeholder="Ketik nama makanan..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            {suggestions.length > 0 && (
                                <ul className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                                    {suggestions.map((food) => (
                                        <li
                                            key={food.id}
                                            onClick={() => handleSelectFood(food)}
                                            className="p-3 hover:bg-green-50 cursor-pointer text-sm border-b border-gray-50 last:border-none"
                                        >
                                            <span className="font-bold text-gray-700">{food.name}</span>
                                            <p className="text-xs text-gray-400">P: {food.protein} | L: {food.fat} | K: {food.carbs}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-1">Porsi (Gram)</label>
                            <input
                                type="number"
                                className="w-full p-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-400 outline-none"
                                value={gram}
                                onChange={(e) => setGram(e.target.value)}
                            />
                        </div>

                        {selectedFood && (
                            <div className="p-3 bg-blue-50 rounded-2xl text-xs text-blue-600 flex justify-between items-center">
                                <span>✨ Terpilih: <b>{selectedFood.name}</b></span>
                                <button type="button" onClick={() => setSelectedFood(null)} className="font-bold underline">Hapus</button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={foodLoading || !selectedFood}
                            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${foodLoading || !selectedFood ? 'bg-gray-300' : 'bg-green-500 hover:bg-green-600 shadow-green-200'}`}
                        >
                            {foodLoading ? 'Menghitung...' : 'Hitung Kalori Sekarang'}
                        </button>
                    </form>

                    {result && (
                        <div className="mt-6 p-5 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl text-center shadow-lg">
                            <p className="text-white text-opacity-80 text-sm font-medium">Hasil Prediksi AI</p>
                            <h3 className="text-4xl font-black text-white mt-1">
                                {result.total_calories || result.data?.total_calories || "0"}
                                <span className="text-sm font-normal ml-2">kcal</span>
                            </h3>
                        </div>
                    )}
                </div>
            )}

            {/* TAB: AIR MINUM */}
            {activeTab === 'water' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-2">
                            💧
                        </div>
                        <h2 className="text-xl font-black text-gray-800">Catat Minum</h2>
                        <p className="text-sm text-gray-500">Target harian kamu: 8 Gelas (2000 ml)</p>
                    </div>

                    <form onSubmit={handleSaveWater} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-1 text-center">Jumlah Air (ml)</label>
                            <div className="relative max-w-[200px] mx-auto">
                                <input
                                    type="number"
                                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-400 outline-none text-center text-3xl font-black text-blue-600 font-mono"
                                    placeholder="250"
                                    value={waterMl}
                                    onChange={(e) => setWaterMl(e.target.value)}
                                    min="0"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">ml</span>
                            </div>
                        </div>

                        {/* Live Conversion Text */}
                        <div className="bg-blue-50 p-4 rounded-2xl text-center">
                            <p className="text-sm text-blue-600 font-medium">
                                Setara dengan
                            </p>
                            <div className="text-2xl font-black text-blue-700 my-1">
                                {calculatedGlasses} <span className="text-base font-bold">Gelas</span>
                            </div>
                            <p className="text-xs text-blue-400">
                                (1 Gelas = 250 ml)
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={waterLoading || calculatedGlasses <= 0}
                            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${waterLoading || calculatedGlasses <= 0 ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-200'}`}
                        >
                            {waterLoading ? 'Menyimpan...' : 'Catat Air Minum'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default FoodPredictor;