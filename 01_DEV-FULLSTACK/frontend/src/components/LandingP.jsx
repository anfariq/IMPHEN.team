import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Rocket, ShieldCheck } from 'lucide-react';

import Footer from './Com-Landi/footer.jsx';
import Faq from './Com-Landi/faq.jsx';
import Nav from './Com-Landi/nav.jsx';
import Hero from './Com-Landi/hero.jsx';
import HITW from './Com-Landi/hitw.jsx'; 
import WhyID from './Com-Landi/whid.jsx';
import Features from './Com-Landi/feu.jsx';
import Testimonials from './Com-Landi/testi.jsx';
import Blog from './Com-Landi/blog.jsx';

export default function App() {

  return (
    <div
      className="min-h-screen bg-white text-slate-800"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        .grad-text { background: linear-gradient(135deg, #1d4ed8, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(37,99,235,0.10); }
        .faq-transition { max-height: 0; overflow: hidden; transition: max-height 0.3s ease, padding 0.3s ease; }
        .faq-open { max-height: 200px; }
      `}</style>

      {/* NAV */}
      <Nav />  

      {/* HERO */}
      <Hero />

      {/* HOW IT WORKS */}
      <HITW />
      
      {/* WHY INDONESIA */}
      <WhyID />

      {/* FEATURES */}
      <Features />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* BLOG */}
      <Blog />

      {/* FAQ */}
      <Faq />

      {/* CTA BANNER */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-blue-600 rounded-3xl p-10 md:p-14 text-center text-white relative overflow-hidden">
          
          {/* Ikon Melayang di Background biar estetik */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 left-10 opacity-20"
          >
            <Sparkles size={80} />
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 right-10 opacity-20"
          >
            <Rocket size={80} />
          </motion.div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
              Mulai diet realistis hari ini <Sparkles className="text-yellow-400" />
            </h2>
            <p className="text-blue-200 mb-8 max-w-md mx-auto">
              Tidak perlu skip nasi. Tidak perlu diet ekstrem. Cukup track
              makanan Indonesia favoritmu.
            </p>
            
            <motion.a 
              href="/login" 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-8 py-4 rounded-xl text-sm hover:bg-blue-50 transition-colors shadow-lg"
            >
              Start Tracking Now – Free <ArrowRight size={18} />
            </motion.a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
