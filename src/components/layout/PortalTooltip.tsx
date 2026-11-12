"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface PortalTooltipProps {
  label: string;
  children: React.ReactNode;
}

export function PortalTooltip({ label, children }: PortalTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showTooltip = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setCoords({
      top: rect.top + rect.height / 2,
      left: rect.right + 12, // Sesuai DESIGN.md §4.1: left = rect.right + 12
    });
    setVisible(true);
  };

  const hideTooltip = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;
    const handleScrollOrResize = () => setVisible(false);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [visible]);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      className="relative flex items-center justify-center"
    >
      {children}
      {mounted &&
        visible &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: "translateY(-50%)",
            }}
            className="z-50 pointer-events-none px-3 py-1.5 rounded-lg bg-brown-900 text-cream text-xs font-semibold shadow-lg whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none"
          >
            {label}
            {/* Small arrow indicator */}
            <div
              className="absolute -left-1 top-1/2 -translate-y-1/2 border-4 border-transparent border-r-brown-900"
              aria-hidden="true"
            />
          </div>,
          document.body
        )}
    </div>
  );
}

