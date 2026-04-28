import { useState } from "react";
import {
    FEATURES,
} from './constants.jsx';

export default function Features() {
    return (
        <section id="fitur" className="bg-slate-50 py-20 md:py-28">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-14">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                        Fitur
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
                        Semua yang kamu butuhkan
                    </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {FEATURES.map((f) => (
                        <div
                            key={f.title}
                            className="bg-white rounded-2xl p-7 border border-slate-100 card-hover"
                        >
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5">
                                {f.icon}
                            </div>
                            <span className="text-xs font-semibold text-blue-500 bg-blue-50 rounded-full px-2.5 py-1">
                                {f.badge}
                            </span>
                            <h3 className="text-lg font-bold text-slate-900 mt-3 mb-2">
                                {f.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}