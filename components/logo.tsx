import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export default function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      fill="currentColor"
    >
      <path d="M50 10 L30 30 L30 70 L70 70 L70 30 L50 10 Z" fillOpacity="0.8" />
      <circle cx="40" cy="50" r="8" fill="#888" />
      <circle cx="60" cy="50" r="8" fill="#888" />
      <path d="M20 40 L10 30 L10 20" strokeWidth="6" stroke="currentColor" fill="none" />
      <path d="M50 10 L50 0" strokeWidth="6" stroke="currentColor" fill="none" />
      <path d="M80 40 L90 30 L90 20" strokeWidth="6" stroke="currentColor" fill="none" />
      <path d="M30 80 L30 90 L40 90" strokeWidth="6" stroke="currentColor" fill="none" />
      <path d="M70 80 L70 90 L60 90" strokeWidth="6" stroke="currentColor" fill="none" />
    </svg>
  )
}
