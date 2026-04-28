import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, BookOpen, ChevronRight } from 'lucide-react';
import { BLOGS } from './constants.jsx';

export default function Blog() {
    const [selectedBlog, setSelectedBlog] = useState(null);

    return (
        <section id="blog" className="bg-slate-50 py-20 md:py-28 overflow-hidden">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="mb-12">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100/50 px-3 py-1 rounded-full"
                    >
                        Blog & Jurnal
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-slate-900 mt-4"
                    >
                        Edukasi gizi makanan Indonesia
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {BLOGS.slice(0, 3).map((b, idx) => (
                        <motion.article
                            key={b.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -8 }}
                            onClick={() => setSelectedBlog(b)}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer transition-all duration-300 group"
                        >
                            <div className="h-48 overflow-hidden relative">
                                {b.image ? (
                                    <img
                                        src={b.image}
                                        alt={b.title}
                                        className="object-cover h-full w-full group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="bg-blue-50 h-full w-full flex items-center justify-center text-blue-300">
                                        <BookOpen size={40} />
                                    </div>
                                )}
                                <div className="absolute top-4 left-4">
                                    <span className="text-[10px] font-bold text-white bg-blue-600/80 backdrop-blur-md rounded-lg px-2.5 py-1.5 uppercase tracking-wider">
                                        {b.tag}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-3 text-slate-400 text-xs mb-3">
                                    <span className="flex items-center gap-1">
                                        <Clock size={14} /> {b.mins} baca
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                                    {b.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                                    {b.desc}
                                </p>
                                <div className="flex items-center text-blue-600 text-xs font-bold gap-1 group-hover:gap-2 transition-all">
                                    Baca Selengkapnya <ChevronRight size={14} />
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>

            {/* Modal Pop-up dengan Framer Motion */}
            <AnimatePresence>
                {selectedBlog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedBlog(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[2.5rem] max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl relative"
                        >
                            <button
                                onClick={() => setSelectedBlog(null)}
                                className="absolute top-5 right-5 z-10 bg-black/20 hover:bg-black/40 backdrop-blur-xl text-white p-2 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>

                            <div className="h-64 sm:h-80 overflow-hidden">
                                <img
                                    src={selectedBlog.image}
                                    alt={selectedBlog.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="p-8 sm:p-10 overflow-y-auto max-h-[calc(85vh-320px)]">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
                                        {selectedBlog.tag}
                                    </span>
                                    <span className="text-slate-400 text-xs flex items-center gap-1">
                                        <Clock size={14} /> {selectedBlog.mins} menit membaca
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 leading-tight">
                                    {selectedBlog.title}
                                </h2>
                                <div className="prose prose-blue max-w-none text-slate-600 leading-relaxed space-y-4">
                                    <p className="text-lg font-medium text-slate-700 italic border-l-4 border-blue-500 pl-4">
                                        {selectedBlog.desc}
                                    </p>
                                    <div className="space-y-4 text-base leading-loose border-t border-slate-100 pt-6">
                                        {selectedBlog.content.split('\n').map((paragraph, i) => (
                                            <p key={i}>{paragraph}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}