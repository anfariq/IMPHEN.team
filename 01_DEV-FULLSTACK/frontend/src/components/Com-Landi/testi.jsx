import { useState } from 'react';
import {
    TESTIMONIALS 
} from './constants.jsx';
export default function Testimonials() {
    return (
        <section className="py-20 md:py-28 max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                    Testimoni
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
                    50.000+ pengguna percaya HealthyAI
                </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((t) => (
                    <div
                        key={t.name}
                        className="bg-white rounded-2xl p-7 border border-slate-100 card-hover"
                    >
                        <div className="flex items-center gap-1 mb-5">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-blue-500 text-sm">
                                    ★
                                </span>
                            ))}
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed mb-6">
                            "{t.text}"
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {t.avatar}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-800">
                                    {t.name}
                                </div>
                                <div className="text-xs text-slate-400">{t.city}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}