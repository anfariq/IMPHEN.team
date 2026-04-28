import {React, useState} from "react";
import {
    NAV_LINKS,
    MEALS,
    BLOGS,
    FAQS,
    HOW_IT_WORKS,  // <--- Pastikan ini ada
    FEATURES,     // <--- Dan ini
    TESTIMONIALS  // <--- Dan ini juga
} from './constants.jsx';

export default function Faq() {

    const [openFaq, setOpenFaq] = useState(null);

    return (
        <section
            id="faq"
            className="py-20 md:py-28 max-w-3xl mx-auto px-4 sm:px-6"
        >
            <div className="text-center mb-14">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                    FAQ
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
                    Pertanyaan Umum
                </h2>
            </div>
            <div className="space-y-3">
                {FAQS.map((f, i) => (
                    <div
                        key={i}
                        className="bg-white border border-slate-100 rounded-2xl overflow-hidden"
                    >
                        <button
                            className="w-full flex items-center justify-between px-6 py-5 text-left"
                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                        >
                            <span className="font-semibold text-slate-800 text-sm pr-4">
                                {f.q}
                            </span>
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className={`w-4 h-4 flex-shrink-0 text-blue-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                        <div
                            className={`faq-transition ${openFaq === i ? "faq-open" : ""} px-6`}
                        >
                            <p className="text-slate-500 text-sm leading-relaxed pb-5">
                                {f.a}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}