import React from "react";

export default function Footer() {
  return (
      <footer className="border-t border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>
                <span className="font-bold text-slate-900 text-lg">
                  HealthyAI
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                Tracker kalori pertama yang benar-benar fokus pada makanan
                Indonesia. Untuk diet yang realistis dan berkelanjutan.
              </p>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Produk
              </div>
              <div className="space-y-2.5">
                {["Fitur", "Database Makanan", "Harga", "Blog"].map((l) => (
                  <a
                    key={l}
                    href="#"
                    className="block text-sm text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    {l}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Perusahaan
              </div>
              <div className="space-y-2.5">
                {["Tentang Kami", "Karir", "Privasi", "Syarat & Ketentuan"].map(
                  (l) => (
                    <a
                      key={l}
                      href="#"
                      className="block text-sm text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      {l}
                    </a>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
              © 2025 HealthyAI. Dibuat dengan ❤️ untuk Indonesia.
            </p>
            <div className="flex items-center gap-4">
              {["Twitter", "Instagram", "TikTok"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-xs text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
  );
}