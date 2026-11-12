import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-bold uppercase tracking-wider text-brown-700/80"
          >
            {label}
          </label>
        )}
        <input
          id={id}
          ref={ref}
          className={`h-11 w-full px-4 rounded-xl bg-white/90 border border-brown-900/15 text-brown-900 placeholder:text-brown-700/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/70 motion-reduce:transition-none disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? "border-danger focus:ring-danger/30" : ""
          } ${className}`.trim()}
          {...props}
        />
        {error && <p className="text-xs text-danger font-medium mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error, label, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-xs font-bold uppercase tracking-wider text-brown-700/80"
          >
            {label}
          </label>
        )}
        <textarea
          id={id}
          ref={ref}
          className={`w-full min-h-[100px] max-h-[180px] p-3.5 rounded-xl bg-white/90 border border-brown-900/15 text-brown-900 placeholder:text-brown-700/50 leading-relaxed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/70 motion-reduce:transition-none disabled:opacity-50 disabled:cursor-not-allowed resize-y ${
            error ? "border-danger focus:ring-danger/30" : ""
          } ${className}`.trim()}
          {...props}
        />
        {error && <p className="text-xs text-danger font-medium mt-1">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

