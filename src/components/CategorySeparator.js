export default function CategorySeparator({ title, className = "" }) {
  return (
    <div className={`relative mb-8 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
        <h2 className="text-3xl md:text-4xl font-bold text-black uppercase tracking-wider px-6">
          {title}
        </h2>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-24 h-1 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400 rounded-full"></div>
    </div>
  );
}
