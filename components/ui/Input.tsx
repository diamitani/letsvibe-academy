import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

export function Input({ className = "", ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={`h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/30 focus:outline-none ${className}`}
      {...props}
    />
  );
}
