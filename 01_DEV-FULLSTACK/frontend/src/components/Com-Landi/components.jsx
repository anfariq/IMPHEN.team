// Komponen Progress Lingkaran
export function CircleProgress({ value, max, size = 120 }) {
  const pct = Math.min(value / max, 1);
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="8" />
      <circle
        cx="50" cy="50" r={r} fill="none" stroke="#2563eb" strokeWidth="8"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </svg>
  );
}

// Komponen Modal Blog
export function BlogModal({ blog, onClose }) {
  if (!blog) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition-all">✕</button>
        <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover" />
        <div className="p-8">
          <span className="text-blue-600 font-bold text-xs uppercase">{blog.tag}</span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2 mb-4">{blog.title}</h2>
          <p className="text-slate-600 leading-relaxed">{blog.desc} ... (Konten edukasi lebih detail di sini untuk SEO)</p>
        </div>
      </div>
    </div>
  );
}