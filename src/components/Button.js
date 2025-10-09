import Link from "next/link";

export default function Button({
  href,
  children,
  className = "",
  onClick,
  type = "button",
  arrowDirection = "right",
  showArrow = true,
  variant = "primary",
}) {
  const baseClasses =
    "group px-8 py-3 text-lg transition-colors duration-300 shadow-lg inline-flex items-center gap-2 border-2";

  const variantClasses = {
    primary: "bg-black text-white border-black hover:bg-white hover:text-black",
    secondary:
      "bg-white text-black border-white hover:bg-black hover:text-white",
    outline:
      "bg-transparent text-white border-white hover:bg-white hover:text-black",
    gold: "bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300 hover:text-black",
    pink: "bg-pink-500 text-white border-pink-500 hover:bg-pink-400 hover:text-white",
    purple:
      "bg-purple-600 text-white border-purple-600 hover:bg-purple-500 hover:text-white",
  };

  const buttonClasses = `${baseClasses} ${
    variantClasses[variant] || variantClasses.primary
  } ${className}`;

  const arrow = showArrow ? (
    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
      {arrowDirection === "right" ? "→" : "←"}
    </span>
  ) : null;

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {arrowDirection === "left" && arrow}
        {children}
        {arrowDirection === "right" && arrow}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={buttonClasses}>
      {arrowDirection === "left" && arrow}
      {children}
      {arrowDirection === "right" && arrow}
    </button>
  );
}
