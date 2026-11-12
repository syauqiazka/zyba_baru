import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "warm" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      fullWidth = false,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles: rounded-full pill, touch target >= 44px, transiton 200ms
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-full cursor-pointer transition-colors duration-200 select-none active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:transform-none disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

    const variantStyles: Record<string, string> = {
      // Primary: brown-900 background dengan teks cream
      primary:
        "bg-brown-900 text-cream hover:bg-brown-900/90 shadow-sm",
      // Warm CTA: orange-500 background WAJIB teks brown-900 (WCAG AA 5.5:1)
      warm:
        "bg-orange-500 text-brown-900 font-semibold hover:bg-orange-500/90 shadow-sm",
      // Secondary: green-100 background dengan teks brown-900
      secondary:
        "bg-green-100 text-brown-900 hover:bg-green-100/80",
      // Outline: border kontak kertas 1px dengan hover halus
      outline:
        "border border-brown-900/15 text-brown-900 bg-transparent hover:bg-white/80",
      // Ghost: teks brown-700 dengan latar transparan
      ghost:
        "text-brown-700 hover:text-brown-900 hover:bg-brown-900/5",
      // Danger: hanya untuk aksi destruktif (delete)
      danger:
        "bg-danger text-cream hover:bg-danger/90",
    };

    const sizeStyles: Record<string, string> = {
      sm: "min-h-[36px] px-3.5 py-1.5 text-xs gap-1.5",
      md: "min-h-[44px] px-5 py-2.5 text-sm gap-2",
      lg: "min-h-[48px] px-6 py-3 text-base gap-2.5",
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

