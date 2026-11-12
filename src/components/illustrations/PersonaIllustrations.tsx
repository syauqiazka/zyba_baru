import React from "react";

interface PersonaSvgProps {
  className?: string;
  size?: number;
}

// 1. KINA (Kelinci Empatik - Telinga panjang lembut)
export function KinaIllustration({ className = "", size = 48 }: PersonaSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Persona Kina Kelinci"
    >
      <circle cx="24" cy="24" r="23" fill="#FCE3D3" stroke="#3B2A20" strokeWidth="1.5" />
      {/* Telinga Kiri */}
      <path
        d="M17 19C17 11 20 8 20 8C20 8 23 11 23 19"
        fill="#FFFFFF"
        stroke="#3B2A20"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Telinga Kanan */}
      <path
        d="M25 19C25 11 28 8 28 8C28 8 31 11 31 19"
        fill="#FFFFFF"
        stroke="#3B2A20"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Kepala */}
      <ellipse cx="24" cy="28" rx="12" ry="10" fill="#FFFFFF" stroke="#3B2A20" strokeWidth="1.5" />
      {/* Mata */}
      <circle cx="20" cy="27" r="1.5" fill="#3B2A20" />
      <circle cx="28" cy="27" r="1.5" fill="#3B2A20" />
      {/* Hidung & Mulut Tenang */}
      <path d="M23 30L25 30L24 31.5Z" fill="#F2884B" />
      <path d="M22 33C23 34 25 34 26 33" stroke="#3B2A20" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// 2. OLLIE (Burung Hantu Bijak - Mata bulat besar berkacamata halus)
export function OllieIllustration({ className = "", size = 48 }: PersonaSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Persona Ollie Burung Hantu"
    >
      <circle cx="24" cy="24" r="23" fill="#E4EED2" stroke="#3B2A20" strokeWidth="1.5" />
      {/* Rangka Tubuh / Kepala Burung Hantu */}
      <ellipse cx="24" cy="25" rx="14" ry="13" fill="#FFFFFF" stroke="#3B2A20" strokeWidth="1.5" />
      {/* Telinga Jumbai Khas Burung Hantu */}
      <path d="M14 15L17 21" stroke="#3B2A20" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M34 15L31 21" stroke="#3B2A20" strokeWidth="1.8" strokeLinecap="round" />
      {/* Lingkaran Mata Kacamata */}
      <circle cx="19" cy="24" r="4.5" fill="#F7F2E7" stroke="#3B2A20" strokeWidth="1.2" />
      <circle cx="29" cy="24" r="4.5" fill="#F7F2E7" stroke="#3B2A20" strokeWidth="1.2" />
      <path d="M23.5 24H24.5" stroke="#3B2A20" strokeWidth="1.2" />
      <circle cx="19" cy="24" r="1.5" fill="#3B2A20" />
      <circle cx="29" cy="24" r="1.5" fill="#3B2A20" />
      {/* Paruh Hangat */}
      <path d="M22.5 29L25.5 29L24 32Z" fill="#F2884B" stroke="#3B2A20" strokeWidth="1" />
    </svg>
  );
}

// 3. RUBI (Rubah Semangat - Wajah segitiga cerdas)
export function RubiIllustration({ className = "", size = 48 }: PersonaSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Persona Rubi Rubah"
    >
      <circle cx="24" cy="24" r="23" fill="#FCE3D3" stroke="#3B2A20" strokeWidth="1.5" />
      {/* Telinga Rubah Lancip */}
      <path d="M13 14L18 24H12L13 14Z" fill="#F2884B" stroke="#3B2A20" strokeWidth="1.5" />
      <path d="M35 14L30 24H36L35 14Z" fill="#F2884B" stroke="#3B2A20" strokeWidth="1.5" />
      {/* Kepala & Pipi Putih */}
      <polygon points="24,37 11,24 37,24" fill="#F2884B" stroke="#3B2A20" strokeWidth="1.5" />
      <polygon points="24,37 15,26 24,30" fill="#FFFFFF" />
      <polygon points="24,37 33,26 24,30" fill="#FFFFFF" />
      {/* Mata Senyum */}
      <path d="M17 26C18 25 20 25 21 26" stroke="#3B2A20" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M27 26C28 25 30 25 31 26" stroke="#3B2A20" strokeWidth="1.5" strokeLinecap="round" />
      {/* Hidung Hitam di Ujung */}
      <circle cx="24" cy="35" r="1.5" fill="#3B2A20" />
    </svg>
  );
}

// 4. BRUNO (Beruang Kokoh & Pelindung - Telinga bulat tenang)
export function BrunoIllustration({ className = "", size = 48 }: PersonaSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Persona Bruno Beruang"
    >
      <circle cx="24" cy="24" r="23" fill="#E4EED2" stroke="#3B2A20" strokeWidth="1.5" />
      {/* Telinga Bulat */}
      <circle cx="14" cy="17" r="4.5" fill="#5A4636" stroke="#3B2A20" strokeWidth="1.5" />
      <circle cx="34" cy="17" r="4.5" fill="#5A4636" stroke="#3B2A20" strokeWidth="1.5" />
      <circle cx="14" cy="17" r="2" fill="#FCE3D3" />
      <circle cx="34" cy="17" r="2" fill="#FCE3D3" />
      {/* Kepala Beruang */}
      <ellipse cx="24" cy="26" rx="14" ry="12" fill="#5A4636" stroke="#3B2A20" strokeWidth="1.5" />
      {/* Moncong Cream */}
      <ellipse cx="24" cy="29" rx="7" ry="5.5" fill="#F7F2E7" stroke="#3B2A20" strokeWidth="1.2" />
      {/* Mata */}
      <circle cx="19" cy="23" r="1.5" fill="#FFFFFF" />
      <circle cx="29" cy="23" r="1.5" fill="#FFFFFF" />
      <circle cx="19" cy="23" r="1" fill="#3B2A20" />
      <circle cx="29" cy="23" r="1" fill="#3B2A20" />
      {/* Hidung & Senyum */}
      <ellipse cx="24" cy="27.5" rx="2" ry="1.2" fill="#3B2A20" />
      <path d="M22 31C23 32 25 32 26 31" stroke="#3B2A20" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

export function getPersonaIllustration(persona: string, size = 48) {
  switch (persona?.toUpperCase()) {
    case "OLLIE":
      return <OllieIllustration size={size} />;
    case "RUBI":
      return <RubiIllustration size={size} />;
    case "BRUNO":
      return <BrunoIllustration size={size} />;
    case "KINA":
    default:
      return <KinaIllustration size={size} />;
  }
}

