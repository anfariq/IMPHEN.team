import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ButterflyWelcome = () => {
  const [stage, setStage] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const navigate = useNavigate();
  const countdownRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const landTimer = setTimeout(() => setStage(1), 3000);
    const textTimer = setTimeout(() => setStage(2), 3500);
    // Mulai countdown 5 detik setelah teks muncul (3.5s + 5s = 8.5s)
    const countdownStartTimer = setTimeout(() => setCountdown(5), 8500);

    return () => {
      clearTimeout(landTimer);
      clearTimeout(textTimer);
      clearTimeout(countdownStartTimer);
    };
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) { triggerExit(); return; }
    countdownRef.current = setTimeout(() => setCountdown((p) => p - 1), 1000);
    return () => clearTimeout(countdownRef.current);
  }, [countdown]);

  const triggerExit = () => {
    setIsExiting(true);
    setTimeout(() => navigate('/landing'), 900);
  };

  const handleSkip = (e) => {
    e.preventDefault();
    clearTimeout(countdownRef.current);
    triggerExit();
  };

  const circumference = 2 * Math.PI * 20;
  const progress = countdown !== null ? ((5 - countdown) / 5) * circumference : 0;

  return (
    <div className="relative flex flex-col items-center min-h-svh h-svh overflow-hidden bg-blue-50 px-6">

      {/* ── Background Blobs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div
          className={`absolute -top-[8%] -right-[8%] w-[70%] h-[65%] rounded-full bg-blue-300 blur-[100px] transition-opacity duration-[3000ms] ${
            stage >= 1 ? 'opacity-50' : 'opacity-35'
          }`}
        />
        <div className="absolute -bottom-[10%] -left-[10%] w-[65%] h-[55%] rounded-full bg-blue-200 blur-[90px] opacity-45" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(59,130,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,1) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* ── Pill Badge ── */}
      <div
        className={`relative z-20 inline-flex items-center gap-2 mt-10 px-4 py-1.5 rounded-full bg-white/75 backdrop-blur-md border border-blue-200/50 transition-all duration-700 ${
          isExiting
            ? 'opacity-0 -translate-y-3'
            : stage === 2
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2'
        }`}
      >
        <span className="w-[7px] h-[7px] rounded-full bg-blue-400 animate-[pulse-dot_2s_ease_infinite]" />
        <span className="text-[9px] tracking-[0.35em] uppercase font-bold text-blue-600 whitespace-nowrap">
          Healthy Lives &amp; Well-being
        </span>
      </div>

      {/* ── Butterfly Hero ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full pointer-events-none">
        <div
          className={`relative flex items-center justify-center ${
            isExiting
              ? 'animate-[fly-exit_1s_cubic-bezier(0.4,0,0.2,1)_forwards]'
              : stage === 0
              ? 'animate-[fly-cloud_3s_cubic-bezier(0.23,1,0.32,1)_forwards]'
              : 'scale-100 translate-y-0'
          }`}
        >
          {/* Radial glow */}
          <div
            className={`absolute -inset-[50%] rounded-full transition-all duration-[1200ms] ${
              stage >= 1 && !isExiting ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{
              background: 'radial-gradient(circle, rgba(147,197,253,0.35) 0%, transparent 70%)',
            }}
          />

          {/* Lottie */}
          <div
            className="relative z-10"
            style={{ width: 'clamp(200px,40vw,300px)', height: 'clamp(200px,40vw,300px)' }}
          >
            <DotLottieReact
              src="butterfly.lottie"
              loop
              autoplay
              renderConfig={{ devicePixelRatio: window.devicePixelRatio }}
              speed={0.7}
            />
          </div>

          {/* Ground shadow */}
          <div
            className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-blue-900/[0.08] rounded-full blur-xl transition-opacity duration-500 ${
              stage >= 1 && !isExiting ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>
      </div>

      {/* ── Text + Countdown ── */}
      <div
        className={`relative z-20 w-full max-w-lg text-center transition-all duration-700 ${
          isExiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
        style={{ paddingBottom: 'clamp(2rem,6vh,4rem)' }}
      >
        <div
          className={`transition-all duration-[900ms] ${
            stage === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Headline */}
          <h1
            className="font-light text-blue-950 tracking-[-0.03em] leading-[1.2] mb-4"
            style={{ fontSize: 'clamp(1.75rem,5vw,2.75rem)' }}
          >
            Selamat datang,
            <br />
            <em
              className="font-normal text-blue-600 whitespace-nowrap"
              style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}
            >
              sehat dimulai di sini
            </em>
          </h1>

          {/* Divider */}
          <div className="w-9 h-px bg-blue-300 opacity-60 mx-auto mb-4" />

          {/* Subtext */}
          <p className="text-[13px] text-slate-500 leading-relaxed tracking-[0.01em] max-w-[300px] mx-auto mb-8">
            Platform kesehatan yang menemani perjalanan hidupmu setiap hari.
          </p>

          {/* ── Countdown Pill ── */}
          <div
            className={`inline-flex items-center gap-4 px-7 py-4 rounded-full bg-white/80 backdrop-blur-xl border border-blue-200/40 mx-auto transition-all duration-500 shadow-[0_8px_32px_rgba(59,130,246,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] ${
              countdown !== null
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-90 translate-y-2'
            }`}
          >
            {/* SVG ring */}
            <div className="flex-shrink-0 w-12 h-12">
              <svg viewBox="0 0 48 48" className="w-full h-full overflow-visible">
                <circle cx="24" cy="24" r="20" fill="none" stroke="#DBEAFE" strokeWidth="3" />
                <circle
                  cx="24" cy="24" r="20"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - progress}
                  transform="rotate(-90 24 24)"
                  style={{ transition: 'stroke-dashoffset 0.9s linear' }}
                />
                <text
                  x="24" y="28"
                  textAnchor="middle"
                  fontSize="13"
                  fontWeight="600"
                  fill="#1D4ED8"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                >
                  {countdown}
                </text>
              </svg>
            </div>

            {/* Label + Skip */}
            <div className="flex flex-col items-start gap-1">
              <span className="text-[11px] text-slate-400 font-medium tracking-[0.02em] whitespace-nowrap">
                Menuju beranda dalam
              </span>
              <button
                onClick={handleSkip}
                className="text-[12px] font-bold tracking-[0.04em] uppercase text-blue-600 hover:text-blue-800 active:scale-95 transition-all duration-150 whitespace-nowrap bg-transparent border-none p-0 cursor-pointer"
              >
                Masuk sekarang →
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ── Custom Keyframes (animasi tidak tersedia di Tailwind default) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap');

        body { margin: 0; overflow: hidden; background: #EFF6FF; }

        @keyframes fly-cloud {
          0%   { transform: translate(110vw, 20vh) rotate(-10deg) scale(0.4); opacity: 0; }
          15%  { opacity: 1; }
          60%  { transform: translate(-10vw, -10vh) rotate(5deg) scale(0.8); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 1; }
        }
        @keyframes fly-exit {
          0%   { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
          100% { transform: translate(120vw, -40vh) scale(0.4) rotate(25deg); opacity: 0; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
      `}</style>
    </div>
  );
};

export default ButterflyWelcome;