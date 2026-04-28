import { useState } from 'react';
import { 
  HOW_IT_WORKS
} from './constants.jsx';

export default function HITW() {
    return (
        <section id="cara-kerja" className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
              Cara Kerja
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
              Mulai dalam 3 langkah mudah
            </h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto">
              Tidak perlu hitung manual. Cukup cari, log, dan pantau.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl p-7 border border-slate-100 card-hover"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-slate-300 tracking-widest">
                    STEP {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}    