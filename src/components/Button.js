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
    "group px-8 py-3 text-lg rounded-full transition-colors duration-300 shadow-lg inline-flex items-center gap-2";

  const variantClasses =
    variant === "secondary"
      ? "bg-gray-500 text-white hover:bg-gray-600"
      : "bg-primary text-white hover:bg-primary/80";

  const buttonClasses = `${baseClasses} ${variantClasses} ${className}`;

  const arrow = showArrow ? (
    <span className="text-white inline-block transition-transform duration-300 group-hover:translate-x-1">
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
