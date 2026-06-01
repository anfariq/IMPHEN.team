import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, X, Maximize2 } from 'lucide-react';

export default function Demo() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const DRIVE_EMBED =
    'https://drive.google.com/file/d/1GpW5ttGZsoL2WAFuc1D6jYFL_jubOm4w/preview';

  return (
    <section
      id="demo"
      className="max-w-6xl mx-auto px-4 sm:px-6 py-20"
    >
      {/* Section Header */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-semibold text-xs px-4 py-2 rounded-full mb-4">
          <Play size={12} fill="currentColor" />
          LIHAT DEMO LANGSUNG
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Cara kerja{' '}
          <span className="grad-text">HealthyAI</span> dalam 7 menit
        </h2>
        <p className="text-slate-500 max-w-xl mx-auto text-base">
          Tonton bagaimana kami bantu kamu track kalori makanan Indonesia dengan
          mudah — tanpa ribet, tanpa skip nasi.
        </p>
      </div>

      {/* Video Container */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-900"
        style={{ aspectRatio: '16/9' }}
      >
        {/* Fullscreen toggle button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm text-white rounded-lg p-2 hover:bg-white/30 transition-colors"
          title="Fullscreen"
        >
          <Maximize2 size={16} />
        </button>

        {/* Google Drive iframe embed */}
        <iframe
          src={DRIVE_EMBED}
          title="Demo Aplikasi CaloriID"
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          className="w-full h-full border-0"
          style={{ display: 'block' }}
        />
      </motion.div>

      {/* CTA below video */}
      <div className="text-center mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
        <a
          href="/register"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-7 py-3.5 rounded-xl text-sm hover:bg-blue-700 transition-colors shadow-md"
        >
          Coba Gratis Sekarang
        </a>
        <a
          href={`https://drive.google.com/file/d/1GpW5ttGZsoL2WAFuc1D6jYFL_jubOm4w/view`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:underline"
        >
          <Play size={14} fill="currentColor" />
          Buka video di tab baru
        </a>
      </div>

      {/* Fullscreen Overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors"
          >
            <X size={20} />
          </button>
          <div
            className="w-full max-w-5xl rounded-2xl overflow-hidden"
            style={{ aspectRatio: '16/9' }}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={DRIVE_EMBED + '&autoplay=1'}
              title="Demo Fullscreen"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </section>
  );
}