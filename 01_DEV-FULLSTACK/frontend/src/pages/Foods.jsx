import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle, Sparkles, ChevronRight } from "lucide-react";

const FoodPredictor = ({ onSuccess }) => {
    // State untuk Tab Navigasi ('food' | 'scan' | 'water')
    const [activeTab, setActiveTab] = useState('food'); 

    // ==========================================
    // 1. STATE & LOGIC: CARI MAKANAN (MANUAL)
    // ==========================================
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);
    const [gram, setGram] = useState(100);
    const [result, setResult] = useState(null);
    const [foodLoading, setFoodLoading] = useState(false);

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
            const res = await axios.get(`https://imphenteam-production.up.railway.app/api/foods/search?q=${search}`, {
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

            const payload = { protein: p, lemak: l, karbohidrat: k, total_nutrisi: p + l + k, gram: g };

            const res = await axios.post('https://imphenteam-production.up.railway.app/api/ml/predict-calories', payload, {
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
            await axios.post('https://imphenteam-production.up.railway.app/api/food-intake', {
                food_id: foodId, qty_grams: qty, total_calories: calories, consumed_at: new Date().toISOString()
            }, {
                headers: { 
                    Authorization: `Bearer ${token}` ,
                    'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
                }
            });
            if (onSuccess) onSuccess(); 
        } catch (err) {
            console.error("Gagal simpan history makan", err);
        }
    };

    // ==========================================
    // 2. STATE & LOGIC: SCAN GAMBAR AI (YOLOv8)
    // ==========================================
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [scanLoading, setScanLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setScanResult(null);
            setScanError(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && droppedFile.type.startsWith("image/")) {
            setFile(droppedFile);
            setPreview(URL.createObjectURL(droppedFile));
            setScanResult(null);
            setScanError(null);
        }
    };

    const analyzeImage = async () => {
        if (!file) return;
        setScanLoading(true);
        setScanError(null);

        const formData = new FormData();
        formData.append("image", file);

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post("https://imphenteam-production.up.railway.app/api/ml/predict-image", formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "x-api-key": "WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ==",
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.status === "success") {
                setScanResult(response.data.data.foods || []); 
            }
        } catch (err) {
            setScanError(err.response?.data?.message || "Gagal menghubungi server AI YOLOv8. Coba lagi.");
        } finally {
            setScanLoading(false);
        }
    };

    // Fungsi pintar: Bawa hasil deteksi AI ke form pencarian database
    const handleUseDetection = (foodName) => {
        setActiveTab('food');
        setSearch(foodName);
        setSelectedFood(null); // Reset pilihan lama agar user memilih dari database
    };

    // ==========================================
    // 3. STATE & LOGIC: AIR MINUM
    // ==========================================
    const [waterMl, setWaterMl] = useState('');
    const [waterLoading, setWaterLoading] = useState(false);
    const calculatedGlasses = waterMl ? Math.round(Number(waterMl) / 250) : 0;

    const handleSaveWater = async (e) => {
        e.preventDefault();
        if (!waterMl || calculatedGlasses <= 0) return alert("Masukkan jumlah ml air yang valid.");

        setWaterLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('https://imphenteam-production.up.railway.app/api/water', { water: calculatedGlasses }, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'x-api-key': 'WVRKV2JXRlhNV2hqTWxab1kyMVdjbGxZU214aGVsRXhZVEpXZVZwWE5HcGpNMVo1V1ZkS2FHVlhSbkphV0Vwc1ltMUtjR0pIUm1oYVIwWnlXbGRhY0E9PQ=='
                }
            });
            if (onSuccess) onSuccess(); 
        } catch (err) {
            alert("Gagal mencatat air minum.");
        } finally {
            setWaterLoading(false);
        }
    };

    return (
        <div className="w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* TABS KONTROL (SEKARANG ADA 3) */}
            <div className="p-5 pb-0 shrink-0">
                <div className="flex gap-2 p-1 bg-gray-100 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('food')}
                        className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all ${activeTab === 'food' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        🍲 Cari
                    </button>
                    <button
                        onClick={() => setActiveTab('scan')}
                        className={`flex-1 flex justify-center items-center gap-1 py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all ${activeTab === 'scan' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Sparkles size={14} /> Scan AI
                    </button>
                    <button
                        onClick={() => setActiveTab('water')}
                        className={`flex-1 py-2.5 text-xs md:text-sm font-bold rounded-xl transition-all ${activeTab === 'water' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        💧 Air
                    </button>
                </div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
                
                {/* ====================================
                    TAB 1: MAKANAN (CARI MANUAL)
                ==================================== */}
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
                                                <p className="text-xs text-gray-400">P: {food.protein}g | L: {food.fat}g | K: {food.carbs}g</p>
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
                                {foodLoading ? 'Menyimpan...' : 'Catat ke Jurnal'}
                            </button>
                        </form>
                    </div>
                )}

                {/* ====================================
                    TAB 2: SCAN AI (DETEKSI GAMBAR)
                ==================================== */}
                {activeTab === 'scan' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-black text-gray-800">AI Detector</h2>
                            <span className="bg-blue-100 text-blue-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">YOLOv8</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-5">Upload foto makananmu, biar AI yang tebak.</p>

                        <AnimatePresence>
                            {scanError && (
                                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl flex gap-3 items-start text-sm border border-red-100">
                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                    <p className="leading-snug">{scanError}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!scanResult && (
                            <div className="flex flex-col gap-4">
                                <div 
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}
                                    className={`relative border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-200 ${
                                        preview ? "border-blue-400 bg-blue-50/30" : "border-slate-300 bg-slate-50 hover:bg-slate-100"
                                    }`}
                                >
                                    {preview ? (
                                        <div className="relative group aspect-video w-full flex items-center justify-center bg-black/5">
                                            <img src={preview} alt="Preview" className="max-w-full max-h-[250px] object-contain rounded-xl" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                                <button onClick={() => fileInputRef.current?.click()} className="bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-transform">
                                                    Ganti Foto
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center py-10 px-6 text-center cursor-pointer aspect-video">
                                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                                <UploadCloud size={30} />
                                            </div>
                                            <h4 className="font-bold text-slate-800 text-[15px] mb-1">Upload Foto Makanan</h4>
                                            <p className="text-xs text-slate-500 max-w-[200px]">Tap atau drag foto ke area ini</p>
                                        </div>
                                    )}
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                </div>

                                {preview && (
                                    <button
                                        onClick={analyzeImage}
                                        disabled={scanLoading}
                                        className={`w-full py-4 rounded-2xl text-[15px] font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                                            scanLoading ? "bg-slate-100 text-slate-400 shadow-none" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
                                        }`}
                                    >
                                        {scanLoading ? <><Loader2 size={18} className="animate-spin" /> Menganalisis...</> : <><Sparkles size={18} /> Deteksi Sekarang</>}
                                    </button>
                                )}
                            </div>
                        )}

                        {scanResult && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-4">
                                <div className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <img src={preview} alt="Thumb" className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                                    <div className="flex flex-col justify-center">
                                        <p className="text-[11px] text-slate-500 font-semibold tracking-wide uppercase mb-0.5">Hasil Analisis</p>
                                        <p className="text-sm font-bold text-slate-800">Ditemukan {scanResult.length} item</p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {scanResult.length > 0 ? (
                                        scanResult.map((food, idx) => {
                                            const confidencePct = (food.confidence * 100).toFixed(1);
                                            return (
                                                <div key={idx} className="bg-white border border-blue-100 p-4 rounded-2xl shadow-sm relative overflow-hidden flex justify-between items-center">
                                                    <div>
                                                        <h4 className="font-extrabold text-slate-900 text-base capitalize">{food.name}</h4>
                                                        <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 mt-0.5">
                                                            <CheckCircle2 size={12} /> Akurasi: {confidencePct}%
                                                        </p>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleUseDetection(food.name)}
                                                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                                                    >
                                                        Gunakan <ChevronRight size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-center py-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <ImageIcon size={32} className="mx-auto text-slate-300 mb-2" />
                                            <p className="text-sm font-medium text-slate-500">Tidak ada makanan terdeteksi.</p>
                                        </div>
                                    )}
                                </div>

                                <button onClick={() => { setScanResult(null); setFile(null); setPreview(null); }} className="w-full mt-2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors">
                                    Foto Ulang
                                </button>
                            </motion.div>
                        )}
                    </div>
                )}

                {/* ====================================
                    TAB 3: AIR MINUM
                ==================================== */}
                {activeTab === 'water' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-2">💧</div>
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

                            <div className="bg-blue-50 p-4 rounded-2xl text-center">
                                <p className="text-sm text-blue-600 font-medium">Setara dengan</p>
                                <div className="text-2xl font-black text-blue-700 my-1">{calculatedGlasses} <span className="text-base font-bold">Gelas</span></div>
                                <p className="text-xs text-blue-400">(1 Gelas = 250 ml)</p>
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
        </div>
    );
};

export default FoodPredictor;