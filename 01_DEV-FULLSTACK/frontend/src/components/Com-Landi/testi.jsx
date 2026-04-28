import { motion } from 'framer-motion';
import { Star } from 'lucide-react'; // Pakai ikon Lucide biar lebih konsisten
import { TESTIMONIALS } from './constants.jsx';

export default function Testimonials() {
    // Kita duplikasi data testimoninya agar loop tidak terlihat putus
    const duplicatedTestimonials = [...TESTIMONIALS, ...TESTIMONIALS];

    return (
        <section className="py-20 md:py-28 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-14 text-center">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                    Testimoni
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-4">
                    50.000+ pengguna percaya HealthyAI
                </h2>
            </div>

            {/* Container untuk Slider */}
            <div className="relative flex">
                <motion.div 
                    className="flex gap-6 pr-6"
                    animate={{ 
                        x: [0, -1920] // Sesuaikan angka ini dengan total lebar kartu kamu
                    }}
                    transition={{ 
                        x: {
                            repeat: Infinity, 
                            repeatType: "loop", 
                            duration: 40, // Makin besar angka, makin lambat jalannya
                            ease: "linear" 
                        }
                    }}
                    style={{ width: "max-content" }}
                >
                    {duplicatedTestimonials.map((t, idx) => (
                        <div
                            key={`${t.name}-${idx}`}
                            className="bg-white rounded-2xl p-7 border border-slate-100 shadow-sm w-[350px] flex-shrink-0 hover:border-blue-200 transition-colors"
                        >
                            <div className="flex items-center gap-1 mb-5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className="fill-blue-500 text-blue-500" />
                                ))}
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6 italic">
                                "{t.text}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">
                                    {t.avatar}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800">
                                        {t.name}
                                    </div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                                        {t.city}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Overlay Gradient: Biar efek muncul dan hilangnya smooth di pinggir */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
            </div>
        </section>
    );
}