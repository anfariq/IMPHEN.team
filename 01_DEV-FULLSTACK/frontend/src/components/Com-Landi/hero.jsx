import { motion } from 'framer-motion';
import { 
    Plus, 
    ArrowRight, 
    CheckCircle2, 
    Zap, 
    UtensilsCrossed, 
    TrendingUp 
} from 'lucide-react';
import { MEALS } from './constants.jsx';
import { CircleProgress } from './components.jsx';

export default function Hero() {
    const totalCal = 1840;
    const consumed = 1100;
    const remaining = totalCal - consumed;

    // Varian animasi untuk elemen yang muncul berurutan (Stagger)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
            <motion.div 
                className="grid md:grid-cols-2 gap-12 items-center"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Text Content */}
                <div>
                    <motion.span 
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1.5 mb-6"
                    >
                        <Zap size={14} className="fill-blue-500 text-blue-500 animate-pulse" />
                        Khusus Makanan Indonesia 🇮🇩
                    </motion.span>
                    
                    <motion.h1 
                        variants={itemVariants}
                        className="text-4xl sm:text-5xl md:text-[3.25rem] font-bold leading-tight text-slate-900 mb-5"
                    >
                        Track kalori
                        <br />
                        <span className="grad-text">makanan Indonesia</span>
                        <br />
                        dengan mudah
                    </motion.h1>

                    <motion.p 
                        variants={itemVariants}
                        className="text-slate-500 text-lg leading-relaxed mb-8 max-w-md"
                    >
                        AI kami paham nasi padang, gorengan, soto, dan makanan rumahan
                        sehari-hari. Diet realistis, tanpa skip makanan favorit.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
                        <motion.a 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            href="/login" 
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 text-sm"
                        >
                            Start Tracking Now <ArrowRight size={18} />
                        </motion.a>
                        <button className="text-sm font-medium text-slate-600 px-6 py-3.5 rounded-xl border border-slate-200 hover:border-blue-200 hover:text-blue-600 transition-colors">
                            Lihat Demo
                        </button>
                    </motion.div>

                    <motion.div 
                        variants={itemVariants}
                        className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-100"
                    >
                        {[
                            ["50K+", "Pengguna aktif"],
                            ["10K+", "Menu Indonesia"],
                            ["4.9★", "Rating pengguna"],
                        ].map(([val, label]) => (
                            <div key={label}>
                                <div className="text-xl font-bold text-slate-900">{val}</div>
                                <div className="text-xs text-slate-400 mt-0.5">{label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Dashboard Preview Card */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="relative"
                >
                    {/* Floating Background Glow */}
                    <div className="absolute -inset-4 bg-gradient-to-br from-blue-100/50 to-transparent rounded-[3rem] blur-2xl -z-10"></div>
                    
                    <div className="relative p-2 sm:p-5 space-y-3">
                        {/* Summary card */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl p-5 shadow-xl shadow-slate-200/50 border border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <TrendingUp size={16} className="text-blue-500" /> Ringkasan Hari Ini
                                </span>
                                <span className="text-xs text-blue-500 font-medium cursor-pointer">
                                    Lihat Semua →
                                </span>
                            </div>
                            <div className="flex items-center gap-5">
                                <div className="relative">
                                    <CircleProgress value={consumed} max={totalCal} size={96} />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-lg font-bold text-slate-900 leading-none">
                                            {remaining}
                                        </span>
                                        <span className="text-xs text-slate-400">sisa</span>
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2.5">
                                    {[
                                        ["Karbohidrat", 68, "#2563eb"],
                                        ["Protein", 42, "#3b82f6"],
                                        ["Lemak", 35, "#93c5fd"],
                                    ].map(([label, pct, color]) => (
                                        <div key={label}>
                                            <div className="flex justify-between text-[10px] mb-1">
                                                <span className="text-slate-500 uppercase tracking-wider">{label}</span>
                                                <span className="font-bold text-slate-700">{pct}%</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 1, delay: 1 }}
                                                    className="h-full rounded-full"
                                                    style={{ background: color }}
                                                ></motion.div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Meals Card */}
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-2xl p-5 shadow-lg shadow-slate-200/40 border border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    <UtensilsCrossed size={16} className="text-blue-500" /> Catatan Makan
                                </span>
                                <motion.button 
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-200"
                                >
                                    <Plus size={16} />
                                </motion.button>
                            </div>
                            <div className="space-y-3.5">
                                {MEALS.map((m, idx) => (
                                    <div key={m.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                            <span className="text-sm text-slate-600">{m.name}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 sm:w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(m.cal / m.max) * 100}%` }}
                                                    transition={{ duration: 1, delay: 1.2 + (idx * 0.1) }}
                                                    className="h-full bg-blue-400 rounded-full"
                                                ></motion.div>
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-500 w-16 text-right">
                                                {m.cal} kkal
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Quick add Banner */}
                        <motion.div 
                            whileHover={{ scale: 1.01 }}
                            className="bg-blue-600 rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-blue-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500 rounded-lg text-white">
                                    <Plus size={20} />
                                </div>
                                <div>
                                    <div className="text-white font-semibold text-sm">Makan Malam</div>
                                    <div className="text-blue-200 text-[11px]">Belum diisi — yuk log sekarang</div>
                                </div>
                            </div>
                            <motion.button 
                                whileHover={{ x: 3 }}
                                className="bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-xl shadow-sm"
                            >
                                Tambah
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}