export default function AnimatedUnderline({ children, className = "" }) {
  return (
    <span className={`relative inline-block group font-playfair ${className}`}>
      {children}
      <span className="text-primary absolute bottom-0 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full" />
    </span>
  );
}
