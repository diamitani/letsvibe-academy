import * as React from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-navy-900 text-white shadow-sm hover:bg-navy-800 focus-visible:ring-navy-900/40",
  secondary:
    "bg-navy-50 text-navy-900 hover:bg-navy-100 focus-visible:ring-navy-600/40",
  outline:
    "border border-slate-300 bg-white text-navy-900 hover:border-navy-400 hover:bg-navy-50 focus-visible:ring-navy-600/40",
  ghost: "text-navy-900 hover:bg-navy-50 focus-visible:ring-navy-600/40",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** When provided, renders a Next.js Link instead of a <button>. */
  href?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
