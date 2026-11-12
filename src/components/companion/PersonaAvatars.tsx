"use client";

import React from "react";
import { PersonaId } from "@/backend/ai/personas";

interface PersonaAvatarProps {
  id: PersonaId;
  size?: number;
  className?: string;
  animate?: boolean;
}

export function PersonaAvatar({
  id,
  size = 48,
  className = "",
  animate = false,
}: PersonaAvatarProps) {
  switch (id) {
    case "KINA":
      // Kina: Kelinci Lembut & Empatik (Mint/Sage Green)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-300 ${animate ? "hover:scale-105" : ""} ${className}`}
          aria-label="Persona Kina (Kelinci Empatik)"
        >
          {/* Background disc */}
          <circle cx="50" cy="50" r="46" fill="#EBF4EE" stroke="#3E7B54" strokeWidth="2.5" />
          
          {/* Telinga Kelinci */}
          <path
            d="M36 44 C34 20, 24 10, 31 7 C38 4, 43 20, 42 42"
            fill="#D9EBDD"
            stroke="#2A5339"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M35 38 C34 22, 28 15, 32 13 C36 11, 39 22, 39 37"
            fill="#F6CBC0"
            opacity="0.7"
          />
          <path
            d="M64 44 C66 20, 76 10, 69 7 C62 4, 57 20, 58 42"
            fill="#D9EBDD"
            stroke="#2A5339"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M65 38 C66 22, 72 15, 68 13 C64 11, 61 22, 61 37"
            fill="#F6CBC0"
            opacity="0.7"
          />

          {/* Kepala */}
          <ellipse cx="50" cy="58" rx="28" ry="24" fill="#F4FAF5" stroke="#2A5339" strokeWidth="2.5" />

          {/* Daun kecil di kepala */}
          <path
            d="M50 36 C48 30, 43 28, 41 31 C43 35, 47 37, 50 38"
            fill="#3E7B54"
            stroke="#2A5339"
            strokeWidth="1.5"
          />
          <path
            d="M50 36 C52 30, 57 28, 59 31 C57 35, 53 37, 50 38"
            fill="#52986D"
            stroke="#2A5339"
            strokeWidth="1.5"
          />

          {/* Pipi Merona */}
          <circle cx="34" cy="62" r="5" fill="#F6CBC0" opacity="0.8" />
          <circle cx="66" cy="62" r="5" fill="#F6CBC0" opacity="0.8" />

          {/* Mata berbinar */}
          <circle cx="40" cy="55" r="3.5" fill="#1B241E" />
          <circle cx="41" cy="54" r="1.2" fill="#FFFFFF" />
          <circle cx="60" cy="55" r="3.5" fill="#1B241E" />
          <circle cx="61" cy="54" r="1.2" fill="#FFFFFF" />

          {/* Hidung & Senyum Lembut */}
          <path d="M48 60 L52 60 L50 63 Z" fill="#F28C6E" />
          <path
            d="M45 64 Q50 67 55 64"
            stroke="#2A5339"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case "OLLIE":
      // Ollie: Burung Hantu Bijaksana & Terstruktur (Sky / Teal)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-300 ${animate ? "hover:scale-105" : ""} ${className}`}
          aria-label="Persona Ollie (Burung Hantu Bijaksana)"
        >
          {/* Background disc */}
          <circle cx="50" cy="50" r="46" fill="#E8F4F8" stroke="#356D80" strokeWidth="2.5" />

          {/* Alis / Bulu Mahkota Bijak */}
          <path
            d="M26 36 C34 30, 44 38, 48 42"
            stroke="#234E5D"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M74 36 C66 30, 56 38, 52 42"
            stroke="#234E5D"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Kepala & Badan Hantu */}
          <rect
            x="24"
            y="32"
            width="52"
            height="50"
            rx="24"
            fill="#D2E8EE"
            stroke="#234E5D"
            strokeWidth="2.5"
          />

          {/* Kacamata Bulat / Mata Hantu Cerdas */}
          <circle cx="38" cy="52" r="11" fill="#FFFFFF" stroke="#356D80" strokeWidth="2.5" />
          <circle cx="62" cy="52" r="11" fill="#FFFFFF" stroke="#356D80" strokeWidth="2.5" />
          <line x1="49" y1="52" x2="51" y2="52" stroke="#356D80" strokeWidth="3" />

          {/* Manik Mata */}
          <circle cx="39" cy="52" r="4.5" fill="#1B241E" />
          <circle cx="40.5" cy="50.5" r="1.5" fill="#FFFFFF" />
          <circle cx="63" cy="52" r="4.5" fill="#1B241E" />
          <circle cx="64.5" cy="50.5" r="1.5" fill="#FFFFFF" />

          {/* Paruh Emas */}
          <path d="M47 57 L53 57 L50 65 Z" fill="#EAA342" stroke="#234E5D" strokeWidth="1.5" />

          {/* Dada berbulu */}
          <path
            d="M44 72 Q50 75 56 72"
            stroke="#356D80"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M46 76 Q50 78 54 76"
            stroke="#356D80"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case "RUBI":
      // Rubi: Rubah Ceria & Penuh Energi (Peach / Warm Sunset)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-300 ${animate ? "hover:scale-105" : ""} ${className}`}
          aria-label="Persona Rubi (Rubah Hangat)"
        >
          {/* Background disc */}
          <circle cx="50" cy="50" r="46" fill="#FDF1EB" stroke="#DF6F4A" strokeWidth="2.5" />

          {/* Telinga Rubah Runcing */}
          <polygon
            points="24,42 32,16 46,38"
            fill="#F28C6E"
            stroke="#7E331B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon points="28,38 34,22 42,36" fill="#FDF1EB" />
          <polygon
            points="76,42 68,16 54,38"
            fill="#F28C6E"
            stroke="#7E331B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <polygon points="72,38 66,22 58,36" fill="#FDF1EB" />

          {/* Wajah Rubah */}
          <path
            d="M24 48 C24 66, 42 78, 50 82 C58 78, 76 66, 76 48 C76 34, 24 34, 24 48 Z"
            fill="#F28C6E"
            stroke="#7E331B"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Masker Putih Wajah Bawah */}
          <path
            d="M32 50 C38 62, 45 74, 50 82 C55 74, 62 62, 68 50 C62 48, 58 52, 50 56 C42 52, 38 48, 32 50 Z"
            fill="#FFFFFF"
          />

          {/* Mata Ceria Segitiga / Melengkung */}
          <path
            d="M36 50 Q41 45 46 50"
            stroke="#1B241E"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M54 50 Q59 45 64 50"
            stroke="#1B241E"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />

          {/* Hidung & Senyum Ceria */}
          <circle cx="50" cy="64" r="3.5" fill="#1B241E" />
          <path
            d="M47 67 Q50 70 53 67"
            stroke="#7E331B"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      );

    case "BRUNO":
      // Bruno: Beruang Tenang & Pelindung (Warm Taupe / Khaki Grounding)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-transform duration-300 ${animate ? "hover:scale-105" : ""} ${className}`}
          aria-label="Persona Bruno (Beruang Tenang)"
        >
          {/* Background disc */}
          <circle cx="50" cy="50" r="46" fill="#F4EFEA" stroke="#795F4A" strokeWidth="2.5" />

          {/* Telinga Bulat */}
          <circle cx="28" cy="34" r="10" fill="#A88B73" stroke="#4F3B2C" strokeWidth="2.5" />
          <circle cx="28" cy="34" r="5" fill="#DFC9B6" />
          <circle cx="72" cy="34" r="10" fill="#A88B73" stroke="#4F3B2C" strokeWidth="2.5" />
          <circle cx="72" cy="34" r="5" fill="#DFC9B6" />

          {/* Kepala Beruang */}
          <circle cx="50" cy="56" r="28" fill="#A88B73" stroke="#4F3B2C" strokeWidth="2.5" />

          {/* Moncong Wajah Putih/Krem */}
          <ellipse cx="50" cy="65" rx="16" ry="12" fill="#F7F1EB" />

          {/* Hidung Besar Hangat */}
          <ellipse cx="50" cy="61" rx="6" ry="4" fill="#4F3B2C" />

          {/* Senyum Tenang */}
          <path
            d="M45 68 Q50 71 55 68"
            stroke="#4F3B2C"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Mata Tenang */}
          <circle cx="39" cy="51" r="3" fill="#1B241E" />
          <circle cx="40" cy="50" r="1" fill="#FFFFFF" />
          <circle cx="61" cy="51" r="3" fill="#1B241E" />
          <circle cx="62" cy="50" r="1" fill="#FFFFFF" />
        </svg>
      );
  }
}

