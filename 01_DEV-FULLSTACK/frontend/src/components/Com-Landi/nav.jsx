import { useState, useEffect } from 'react';
import { 
  NAV_LINKS
} from './constants.jsx';

export default function Nav() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Cek apakah token ada di storage untuk menentukan status login
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 text-lg tracking-tight">
              HealthyAI
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(" ", "-")}`}
                className="text-sm text-slate-500 hover:text-blue-600 transition-colors font-medium"
              >
                {l}
              </a>
            ))}
          </div>

          {/* Desktop Button */}
          <div className="hidden md:flex items-center">
            <a
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="text-sm font-semibold bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors inline-block"
            >
              {isLoggedIn ? "Dashboard" : "Masuk"}
            </a>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="w-5 h-0.5 bg-slate-700 mb-1"></div>
            <div className="w-5 h-0.5 bg-slate-700 mb-1"></div>
            <div className="w-5 h-0.5 bg-slate-700"></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={`#${l}`}
                className="text-sm font-medium text-slate-600"
              >
                {l}
              </a>
            ))}
            <a 
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="text-sm font-semibold bg-blue-600 text-white px-4 py-2.5 rounded-lg w-full text-center"
            >
              {isLoggedIn ? "My Dashboard" : "Masuk"}
            </a>
          </div>
        )}
      </nav>
    );
}