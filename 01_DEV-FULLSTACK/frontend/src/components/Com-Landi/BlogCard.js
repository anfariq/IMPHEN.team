// components/BlogCard.js
export const BlogCard = ({ blog, onClick }) => (
  <article
    onClick={() => onClick(blog)}
    className="bg-white rounded-2xl overflow-hidden border border-slate-100 card-hover cursor-pointer group"
  >
    <div className="h-48 overflow-hidden bg-slate-100">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </div>
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 rounded-full px-2.5 py-1">
          {blog.tag}
        </span>
        <span className="text-xs text-slate-400">{blog.mins} baca</span>
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
        {blog.title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
        {blog.desc}
      </p>
    </div>
  </article>
);