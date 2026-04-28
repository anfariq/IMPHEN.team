import { useState } from 'react';

import { 
  BLOGS, 
} from './constants.jsx';

import { BlogModal } from './components.jsx';

export default function Blog() {
      const [selectedBlog, setSelectedBlog] = useState(null);  

    return (
        <section id="blog" className="bg-slate-50 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                Blog & Jurnal
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
                Edukasi gizi makanan Indonesia
              </h2>
            </div>
            <a
              href="#"
              className="hidden md:block text-sm text-blue-600 font-medium hover:underline"
            >
              Lihat semua →
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {BLOGS.map((b) => (
              <article
                key={b.title}
                className="bg-white rounded-2xl overflow-hidden border border-slate-100 card-hover cursor-pointer"
              >
                <div className="h-40 bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center">
                  {b.image ? (
                    <img
                      src={b.image}
                      alt={b.title}
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <div className="text-blue-500 text-sm font-medium">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 rounded-full px-2.5 py-1">
                      {b.tag}
                    </span>
                    <span className="text-xs text-slate-400">
                      {b.mins} baca
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
        {/* Modal Pop-up */}
        {selectedBlog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="relative h-64">
                <img src={selectedBlog.image} alt={selectedBlog.title} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setSelectedBlog(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="p-8">
                <span className="text-blue-600 font-bold text-xs uppercase">{selectedBlog.tag}</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2 mb-4">{selectedBlog.title}</h2>
                <div className="prose prose-slate text-slate-600">
                  <p>{selectedBlog.content || selectedBlog.desc}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    );
}