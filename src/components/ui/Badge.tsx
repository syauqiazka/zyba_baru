import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "warm" | "vitality" | "neutral" | "outline";
  pill?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = "neutral", pill = false, className = "", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center text-xs font-semibold px-2.5 py-1 tracking-wide transition-colors";
    const roundedStyles = pill ? "rounded-full" : "rounded-lg";

    const variantStyles: Record<string, string> = {
      // Warm: orange-100 dengan teks brown-900 (lulus WCAG AAA)
      warm: "bg-orange-100 text-brown-900",
      // Vitality: green-100 dengan teks brown-900
      vitality: "bg-green-100 text-brown-900",
      // Neutral: cream/brown-700
      neutral: "bg-brown-900/5 text-brown-900",
      // Outline: border kontak kertas
      outline: "border border-brown-900/15 text-brown-700 bg-white/50",
    };

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${roundedStyles} ${variantStyles[variant]} ${className}`.trim()}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

