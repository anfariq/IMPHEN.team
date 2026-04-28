import {
    MEALS
} from './constants.jsx';
import { CircleProgress, BlogModal } from './components.jsx';

export default function Hero() {

    const totalCal = 1840;
    const consumed = 1100;
    const remaining = totalCal - consumed;
    return (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 md:pt-24 md:pb-28">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-full px-3 py-1.5 mb-6">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                        Khusus Makanan Indonesia 🇮🇩
                    </span>
                    <h1 className="text-4xl sm:text-5xl md:text-[3.25rem] font-bold leading-tight text-slate-900 mb-5">
                        Track kalori
                        <br />
                        <span className="grad-text">makanan Indonesia</span>
                        <br />
                        dengan mudah
                    </h1>
                    <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-md">
                        AI kami paham nasi padang, gorengan, soto, dan makanan rumahan
                        sehari-hari. Diet realistis, tanpa skip makanan favorit.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a href="/login" className="bg-blue-600 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100 text-sm">
                            Start Tracking Now – Free →
                        </a>
                        <button className="text-sm font-medium text-slate-600 px-6 py-3.5 rounded-xl border border-slate-200 hover:border-blue-200 hover:text-blue-600 transition-colors">
                            Lihat Demo
                        </button>
                    </div>
                    <div className="flex items-center gap-6 mt-10 pt-8 border-t border-slate-100">
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
                    </div>
                </div>

                {/* Dashboard Preview Card */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl"></div>
                    <div className="relative p-5 space-y-3">
                        {/* Summary card */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm font-semibold text-slate-700">
                                    Ringkasan Hari Ini
                                </span>
                                <span className="text-xs text-blue-500 font-medium">
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
                                <div className="flex-1 space-y-2">
                                    {[
                                        ["Karbohidrat", 68, "#2563eb"],
                                        ["Protein", 42, "#3b82f6"],
                                        ["Lemak", 35, "#93c5fd"],
                                    ].map(([label, pct, color]) => (
                                        <div key={label}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="text-slate-500">{label}</span>
                                                <span className="font-medium text-slate-700">
                                                    {pct}%
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{ width: `${pct}%`, background: color }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Meals */}
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-slate-700">
                                    Catatan Makan
                                </span>
                                <button className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                    +
                                </button>
                            </div>
                            <div className="space-y-2.5">
                                {MEALS.map((m) => (
                                    <div
                                        key={m.name}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-sm text-slate-600">{m.name}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-400 rounded-full"
                                                    style={{ width: `${(m.cal / m.max) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-500 w-20 text-right">
                                                {m.cal} / {m.max} kkal
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick add */}
                        <div className="bg-blue-600 rounded-2xl p-4 flex items-center justify-between">
                            <div>
                                <div className="text-white font-semibold text-sm">
                                    Makan Malam
                                </div>
                                <div className="text-blue-200 text-xs mt-0.5">
                                    Belum diisi — yuk log sekarang
                                </div>
                            </div>
                            <button className="bg-white text-blue-600 text-xs font-bold px-3 py-1.5 rounded-lg">
                                + Tambah
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}