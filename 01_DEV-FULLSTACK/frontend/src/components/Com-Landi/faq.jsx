import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react"; // Ikon modern
import { FAQS } from './constants.jsx';

export default function Faq() {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <section
            id="faq"
            className="py-20 md:py-28 max-w-3xl mx-auto px-4 sm:px-6"
        >
            <div className="text-center mb-14">
                <motion.span 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-xs font-semibold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full"
                >
                    FAQ
                </motion.span>
                <motion.h2 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-4xl font-bold text-slate-900 mt-4"
                >
                    Pertanyaan Umum
                </motion.h2>
            </div>

            <div className="space-y-4">
                {FAQS.map((f, i) => {
                    const isOpen = openFaq === i;
                    
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className={`bg-white border transition-colors duration-300 rounded-2xl overflow-hidden ${
                                isOpen ? "border-blue-200 shadow-lg shadow-blue-50" : "border-slate-100"
                            }`}
                        >
                            <button
                                className="w-full flex items-center justify-between px-6 py-5 text-left"
                                onClick={() => setOpenFaq(isOpen ? null : i)}
                            >
                                <span className={`font-semibold text-sm pr-4 transition-colors ${
                                    isOpen ? "text-blue-600" : "text-slate-800"
                                }`}>
                                    {f.q}
                                </span>
                                <motion.div
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className={`${isOpen ? "text-blue-600" : "text-slate-400"}`}
                                >
                                    <ChevronDown size={18} />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
                                            {f.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}