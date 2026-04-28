export default function WHID() {
    return (
        <section className="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                        Why Focus on Indonesia
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-5">
                        Makanan Indonesia itu unik.
                        <br />
                        Butuh pendekatan lokal.
                    </h2>
                    <p className="text-slate-500 leading-relaxed mb-6">
                        App kalori global sering gagal mengenali nasi padang, soto betawi,
                        atau jajanan pasar. Porsi dan bahan berbeda-beda — app barat tidak
                        akurat untuk kita.
                    </p>
                    <p className="text-slate-500 leading-relaxed mb-8">
                        HealthyAI dibangun dari awal untuk masakan Indonesia: dari nasi
                        kucing hingga rijsttafel, dari warung Tegal hingga restoran fine
                        dining.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            ["10K+", "Menu lokal terverifikasi"],
                            ["3 Sumber", "BPOM, Univ & Restoran"],
                            ["98%", "Akurasi pengenalan AI"],
                            ["Real-time", "Update database rutin"],
                        ].map(([val, label]) => (
                            <div
                                key={label}
                                className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                            >
                                <div className="text-xl font-bold text-blue-600">{val}</div>
                                <div className="text-xs text-slate-500 mt-1 leading-tight">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white">
                    <div className="text-sm font-semibold opacity-70 mb-6 uppercase tracking-wider">
                        Real Dataset
                    </div>
                    <div className="space-y-4">
                        {[
                            {
                                food: "Nasi Padang (Lengkap)",
                                cal: "650–900 kkal",
                                badge: "Populer",
                            },
                            { food: "Gado-gado", cal: "280–420 kkal", badge: "Sehat" },
                            { food: "Mie Ayam", cal: "400–550 kkal", badge: "Populer" },
                            {
                                food: "Tempe Goreng (1 ptg)",
                                cal: "75–90 kkal",
                                badge: "Ringan",
                            },
                            { food: "Soto Ayam", cal: "200–350 kkal", badge: "Segar" },
                            {
                                food: "Gorengan (1 pcs)",
                                cal: "80–150 kkal",
                                badge: "Camilan",
                            },
                        ].map((item) => (
                            <div
                                key={item.food}
                                className="flex items-center justify-between bg-white/10 rounded-xl px-4 py-3 backdrop-blur"
                            >
                                <div>
                                    <div className="font-medium text-sm">{item.food}</div>
                                    <div className="text-xs text-blue-200 mt-0.5">
                                        {item.cal}
                                    </div>
                                </div>
                                <span className="text-xs bg-white/20 rounded-full px-2.5 py-1 font-medium">
                                    {item.badge}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}