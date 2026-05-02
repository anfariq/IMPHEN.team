import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodPredictor = () => {
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [gram, setGram] = useState(100);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (search.length > 2) {
                fetchFoods();
            } else {
                setSuggestions([]);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const fetchFoods = async () => {
        try {
            // Gunakan port 8000 langsung jika 3000 masih 401 Unauthorized
            const res = await axios.get(`https://gateforlaravl.vercel.app/api/foods/search?q=${search}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ==' // Sesuai dengan di Node.js Gateway
                }
            });
            setSuggestions(res.data);
        } catch (err) {
            console.error("Gagal nyari makanan", err);
        }
    };

    const handleSelectFood = (food) => {
        setSelectedFood(food);
        setSearch(food.name); // Sesuaikan dengan kolom 'name' di DB
        setSuggestions([]);
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        if (!selectedFood) return alert("Pilih makanan dulu!");

        setLoading(true);
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

            // 1. Ambil Prediksi AI
            const res = await axios.post('https://gateforlaravl.vercel.app/api/ml/predict-calories', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
                }
            });

            const hasilCalori = res.data.total_calories || res.data.data?.total_calories;
            setResult(res.data);

            // 2. SIMPAN KE DATABASE (user_food_intakes)
            if (hasilCalori) {
                await saveToIntake(selectedFood.id, g, hasilCalori);
            }

        } catch (err) {
            console.error("Error Detail:", err.response?.data);
            alert("Gagal proses data.");
        } finally {
            setLoading(false);
        }
    };

    // Fungsi tambahan untuk simpan ke DB
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
        } catch (err) {
            console.error("Gagal simpan history makan", err);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-3xl shadow-2xl border border-gray-100">
            <h2 className="text-2xl font-black text-gray-800 mb-1">Cari Makanan 🍲</h2>
            <p className="text-sm text-gray-500 mb-6">Pilih dari database untuk hitung kalori.</p>

            <form onSubmit={handlePredict} className="space-y-5">
                <div className="relative">
                    <label className="block text-xs font-bold text-gray-400 uppercase ml-1 mb-1">Nama Makanan</label>
                    <input
                        type="text"
                        className="w-full p-3 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-green-400 outline-none"
                        placeholder="Ketik nama makanan..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* SUGGESTION LIST DIBERIKAN CONTAINER AGAR RAPI */}
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
                        className="w-full p-3 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-green-400 outline-none"
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
                    disabled={loading || !selectedFood}
                    className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${loading || !selectedFood ? 'bg-gray-300' : 'bg-green-500 hover:bg-green-600 shadow-green-200'
                        }`}
                >
                    {loading ? 'Menghitung...' : 'Hitung Kalori Sekarang'}
                </button>
            </form>

            {/* Hasil Prediksi */}
            {result && (
                <div className="mt-8 p-6 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl text-center shadow-lg">
                    <p className="text-white text-opacity-80 text-sm font-medium">Hasil Prediksi AI</p>
                    <h3 className="text-5xl font-black text-white mt-1">
                        {/* Coba panggil dengan opsional chaining untuk semua kemungkinan struktur */}
                        {result.total_calories || result.data?.total_calories || "0"}
                        <span className="text-lg font-normal ml-2">kcal</span>
                    </h3>
                </div>
            )}
        </div>
    );
};

export default FoodPredictor;