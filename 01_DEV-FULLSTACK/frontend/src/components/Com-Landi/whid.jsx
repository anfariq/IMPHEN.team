import { motion } from 'framer-motion';
import { Database, Search, CheckCircle, Globe2, Zap } from 'lucide-react';

export default function WHID() {
    // Varian untuk container teks (kiri)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
    };

    // Varian untuk list makanan (kanan)
    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.5 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <section className="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Bagian Kiri: Penjelasan */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                >
                    <motion.span variants={itemVariants} className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                        <Globe2 size={14} /> Why Focus on Indonesia
                    </motion.span>
                    
                    <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-slate-900 mt-4 mb-5">
                        Makanan Indonesia itu unik.
                        <br />
                        <span className="text-blue-600">Butuh pendekatan lokal.</span>
                    </motion.h2>

                    <motion.p variants={itemVariants} className="text-slate-500 leading-relaxed mb-6">
                        App kalori global sering gagal mengenali nasi padang, soto betawi,
                        atau jajanan pasar. Porsi dan bahan berbeda-beda — app barat tidak
                        akurat untuk kita.
                    </motion.p>

                    <motion.p variants={itemVariants} className="text-slate-500 leading-relaxed mb-8">
                        HealthyAI dibangun dari awal untuk masakan Indonesia: dari nasi
                        kucing hingga warung Tegal.
                    </motion.p>

                    <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                        {[
                            ["10K+", "Menu lokal terverifikasi", <Database size={18} key="1"/>],
                            ["3 Sumber", "BPOM, Univ & Restoran", <Search size={18} key="2"/>],
                            ["98%", "Akurasi pengenalan AI", <Zap size={18} key="3"/>],
                            ["Real-time", "Update database rutin", <CheckCircle size={18} key="4"/>],
                        ].map(([val, label, icon]) => (
                            <motion.div
                                key={label}
                                whileHover={{ y: -5, backgroundColor: "#eff6ff" }}
                                className="bg-slate-50 rounded-2xl p-4 border border-slate-100 transition-colors"
                            >
                                <div className="text-blue-600 mb-2">{icon}</div>
                                <div className="text-xl font-bold text-slate-900">{val}</div>
                                <div className="text-[10px] uppercase font-bold text-slate-400 mt-1 tracking-wider leading-tight">
                                    {label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Bagian Kanan: Visual Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200"
                >
                    {/* Efek Cahaya di Belakang Card */}
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/10 blur-3xl rounded-full"></div>
                    
                    <div className="relative">
                        <div className="flex items-center justify-between mb-8">
                            <div className="text-sm font-bold opacity-80 uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                                Real Dataset
                            </div>
                            <Database size={20} className="opacity-50" />
                        </div>

                        <motion.div 
                            variants={listVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="space-y-3"
                        >
                            {[
                                { food: "Nasi Padang (Lengkap)", cal: "650–900 kkal", badge: "Populer" },
                                { food: "Gado-gado", cal: "280–420 kkal", badge: "Sehat" },
                                { food: "Mie Ayam", cal: "400–550 kkal", badge: "Populer" },
                                { food: "Tempe Goreng (1 ptg)", cal: "75–90 kkal", badge: "Ringan" },
                                { food: "Soto Ayam", cal: "200–350 kkal", badge: "Segar" },
                                { food: "Gorengan (1 pcs)", cal: "80–150 kkal", badge: "Camilan" },
                            ].map((item) => (
                                <motion.div
                                    key={item.food}
                                    variants={cardVariants}
                                    whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.15)" }}
                                    className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 backdrop-blur-md border border-white/5 cursor-default transition-colors"
                                >
                                    <div>
                                        <div className="font-bold text-sm">{item.food}</div>
                                        <div className="text-[11px] text-blue-200 font-medium mt-0.5">
                                            🔥 {item.cal}
                                        </div>
                                    </div>
                                    <span className="text-[10px] bg-white text-blue-600 rounded-full px-2.5 py-1 font-bold uppercase">
                                        {item.badge}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}