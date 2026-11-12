import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "anchor" | "content" | "subcard";
  elevation?: 1 | 2 | 3;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "content",
      elevation = 1,
      className = "",
      ...props
    },
    ref
  ) => {
    const variantStyles: Record<string, string> = {
      anchor: "rounded-[24px] p-6 sm:p-7",
      content: "rounded-[20px] p-5 sm:p-6",
      subcard: "rounded-2xl p-4 sm:p-5",
    };

    const elevationStyles: Record<number, string> = {
      1: "bg-white/90 border border-brown-900/10 shadow-[0_2px_12px_-2px_rgba(59,42,32,0.04)]",
      2: "bg-white/95 backdrop-blur-md border border-brown-900/10 shadow-[0_4px_24px_-4px_rgba(59,42,32,0.06)]",
      3: "bg-white border border-brown-900/15 shadow-[0_12px_40px_-8px_rgba(59,42,32,0.12)]",
    };

    return (
      <div
        ref={ref}
        className={`${elevationStyles[elevation]} ${variantStyles[variant]} ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

