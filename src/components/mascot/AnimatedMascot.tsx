"use client";

import React, { useEffect, useState } from "react";

export type MascotState = "idle" | "email" | "password" | "success" | "error";

interface AnimatedMascotProps {
  state?: MascotState;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AnimatedMascot({
  state = "idle",
  className = "",
  size = "md",
}: AnimatedMascotProps) {
  const [blink, setBlink] = useState(false);

  // Natural blinking timer
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 3800);

    return () => clearInterval(blinkInterval);
  }, []);

  const dimensions =
    size === "sm" ? "w-36 h-36" : size === "lg" ? "w-72 h-72" : "w-56 h-56";

  const isCoveringEyes = state === "password";
  const isLookingAtForm = state === "email";
  const isHappy = state === "success";

  return (
    <div className={`relative flex items-center justify-center select-none ${dimensions} ${className}`}>
      <style jsx>{`
        @keyframes mascotBreathe {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-5px) scale(1.02);
          }
        }
        @keyframes tailSway {
          0%, 100% {
            transform: rotate(-4deg);
          }
          50% {
            transform: rotate(6deg);
          }
        }
        @keyframes leafFlutterLeft {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(-3deg);
          }
        }
        @keyframes leafFlutterRight {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }
        @keyframes jumpJoy {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          40% {
            transform: translateY(-16px) scale(1.05);
          }
          60% {
            transform: translateY(-8px) scale(1.02);
          }
        }
        .animate-mascot-breathe {
          animation: mascotBreathe 4s ease-in-out infinite;
          transform-origin: bottom center;
        }
        .animate-tail {
          animation: tailSway 3s ease-in-out infinite;
          transform-origin: 35px 120px;
        }
        .animate-frill-left {
          animation: leafFlutterLeft 3.5s ease-in-out infinite;
          transform-origin: 45px 65px;
        }
        .animate-frill-right {
          animation: leafFlutterRight 3.5s ease-in-out infinite;
          transform-origin: 95px 65px;
        }
        .animate-mascot-jump {
          animation: jumpJoy 0.8s ease-in-out infinite;
          transform-origin: bottom center;
        }
      `}</style>

      <svg
        viewBox="0 0 160 160"
        className={`w-full h-full drop-shadow-md transition-all duration-500 ${
          isHappy ? "animate-mascot-jump" : "animate-mascot-breathe"
        }`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow under mascot */}
        <ellipse cx="80" cy="148" rx="36" ry="7" fill="rgba(27, 36, 30, 0.12)" />

        {/* 1. TAIL (Curled salamander tail behind body) */}
        <g className="animate-tail">
          {/* Main tail body */}
          <path
            d="M50 115 C30 115 15 105 18 88 C20 76 34 82 42 96 C48 106 55 118 60 125 Z"
            fill="#80C887"
            stroke="#2A6B36"
            strokeWidth="2.5"
          />
          {/* Light cream underside of tail */}
          <path
            d="M38 98 C30 88 23 85 20 89 C18 97 28 108 45 114 Z"
            fill="#FBF5E5"
            stroke="#2A6B36"
            strokeWidth="1.5"
          />
        </g>

        {/* 2. BODY & LEGS */}
        {/* Left Foot */}
        <path
          d="M52 135 C52 130 58 126 65 128 C70 130 72 138 68 143 C64 146 54 146 52 135 Z"
          fill="#80C887"
          stroke="#2A6B36"
          strokeWidth="2"
        />
        {/* Right Foot */}
        <path
          d="M108 135 C108 130 102 126 95 128 C90 130 88 138 92 143 C96 146 106 146 108 135 Z"
          fill="#80C887"
          stroke="#2A6B36"
          strokeWidth="2"
        />

        {/* Torso */}
        <path
          d="M55 92 C55 80 105 80 105 92 C108 110 106 135 95 140 C85 144 75 144 65 140 C54 135 52 110 55 92 Z"
          fill="#95D49C"
          stroke="#2A6B36"
          strokeWidth="2.5"
        />

        {/* Cream Belly Patch */}
        <path
          d="M66 98 C66 90 94 90 94 98 C96 112 94 133 87 137 C80 140 76 139 72 136 C66 131 64 112 66 98 Z"
          fill="#FDF8EE"
          stroke="#2A6B36"
          strokeWidth="1.5"
        />

        {/* 3. HEAD LEAFY FRILLS (Axolotl leaf gills on left & right) */}
        {/* Left Frills (3 Layered Leaf Petals) */}
        <g className="animate-frill-left">
          {/* Top leaf */}
          <path
            d="M54 48 C40 38 28 42 24 50 C22 56 32 60 48 56 Z"
            fill="#4D9658"
            stroke="#2A6B36"
            strokeWidth="2"
          />
          {/* Middle leaf (largest) */}
          <path
            d="M48 60 C30 52 16 60 14 70 C12 78 26 82 46 72 Z"
            fill="#5EAA6A"
            stroke="#2A6B36"
            strokeWidth="2"
          />
          {/* Bottom leaf */}
          <path
            d="M48 72 C34 70 24 78 25 86 C26 92 38 92 50 82 Z"
            fill="#4D9658"
            stroke="#2A6B36"
            strokeWidth="2"
          />
        </g>

        {/* Right Frills (3 Layered Leaf Petals) */}
        <g className="animate-frill-right">
          {/* Top leaf */}
          <path
            d="M106 48 C120 38 132 42 136 50 C138 56 128 60 112 56 Z"
            fill="#4D9658"
            stroke="#2A6B36"
            strokeWidth="2"
          />
          {/* Middle leaf (largest) */}
          <path
            d="M112 60 C130 52 144 60 146 70 C148 78 134 82 114 72 Z"
            fill="#5EAA6A"
            stroke="#2A6B36"
            strokeWidth="2"
          />
          {/* Bottom leaf */}
          <path
            d="M112 72 C126 70 136 78 135 86 C134 92 122 92 110 82 Z"
            fill="#4D9658"
            stroke="#2A6B36"
            strokeWidth="2"
          />
        </g>

        {/* 4. HEAD BASE */}
        <path
          d="M46 68 C44 45 60 34 80 34 C100 34 116 45 114 68 C114 88 102 96 80 96 C58 96 46 88 46 68 Z"
          fill="#95D49C"
          stroke="#2A6B36"
          strokeWidth="2.5"
        />

        {/* Forehead Crown Leaf Emblem (From User Character Sheet) */}
        <path
          d="M80 38 C76 43 74 48 80 52 C86 48 84 43 80 38 Z"
          fill="#3E7B54"
        />
        <path
          d="M74 44 C70 47 71 50 76 51 C77 48 76 45 74 44 Z"
          fill="#3E7B54"
        />
        <path
          d="M86 44 C90 47 89 50 84 51 C83 48 84 45 86 44 Z"
          fill="#3E7B54"
        />

        {/* Cheek Blush */}
        <ellipse cx="58" cy="74" rx="5" ry="3.5" fill="#F8A287" opacity="0.8" />
        <ellipse cx="102" cy="74" rx="5" ry="3.5" fill="#F8A287" opacity="0.8" />

        {/* 5. EYES */}
        {blink ? (
          // Blinking Eyes (Happy arcs)
          <g stroke="#1B241E" strokeWidth="2.5" strokeLinecap="round">
            <path d="M62 68 Q67 73 72 68" />
            <path d="M88 68 Q93 73 98 68" />
          </g>
        ) : isHappy ? (
          // Joyful closed arcs (^ ^)
          <g stroke="#1B241E" strokeWidth="2.5" strokeLinecap="round">
            <path d="M62 70 Q67 63 72 70" />
            <path d="M88 70 Q93 63 98 70" />
          </g>
        ) : (
          // Open Big Shiny Eyes
          <g>
            {/* Left Eye */}
            <circle cx="67" cy="67" r="7" fill="#1B241E" />
            {/* Eye Highlight */}
            <circle
              cx={isLookingAtForm ? "64" : "65"}
              cy="65"
              r="2.5"
              fill="#FFFFFF"
            />
            <circle cx="69" cy="69" r="1.2" fill="#FFFFFF" />

            {/* Right Eye */}
            <circle cx="93" cy="67" r="7" fill="#1B241E" />
            {/* Eye Highlight */}
            <circle
              cx={isLookingAtForm ? "90" : "91"}
              cy="65"
              r="2.5"
              fill="#FFFFFF"
            />
            <circle cx="95" cy="69" r="1.2" fill="#FFFFFF" />
          </g>
        )}

        {/* 6. MOUTH */}
        {isHappy ? (
          // Wide Happy Open Mouth with Pink Tongue
          <g>
            <path
              d="M72 77 Q80 88 88 77 Z"
              fill="#C84B31"
              stroke="#1B241E"
              strokeWidth="1.8"
            />
            {/* Tongue */}
            <path d="M75 80 Q80 87 85 80 Z" fill="#F5938B" />
          </g>
        ) : (
          // Cute Gentle Smile
          <path
            d="M75 77 Q80 81 85 77"
            stroke="#1B241E"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* 7. ARMS & PEEK-A-BOO LEAF */}
        {isCoveringEyes ? (
          // PEEK-A-BOO: Mascot holds a big green leaf covering its eyes (User Sheet: "Menyembunyikan Diri")
          <g className="transition-all duration-300">
            {/* Big Green Leaf Covering Face */}
            <path
              d="M48 50 C44 32 78 28 108 42 C122 55 120 78 105 84 C80 94 48 80 48 50 Z"
              fill="#3E7B54"
              stroke="#1B241E"
              strokeWidth="2"
            />
            {/* Leaf Veins */}
            <path d="M52 52 Q82 60 112 46" stroke="#28583B" strokeWidth="2" />
            <path d="M72 58 Q82 50 88 44" stroke="#28583B" strokeWidth="1.5" />
            <path d="M86 62 Q96 55 102 48" stroke="#28583B" strokeWidth="1.5" />
            <path d="M64 55 Q72 65 76 72" stroke="#28583B" strokeWidth="1.5" />

            {/* Little Hands Gripping Leaf */}
            <ellipse cx="60" cy="74" rx="5" ry="4" fill="#80C887" stroke="#2A6B36" strokeWidth="1.5" />
            <ellipse cx="100" cy="74" rx="5" ry="4" fill="#80C887" stroke="#2A6B36" strokeWidth="1.5" />

            {/* One cheeky eye peeking out just above or below the leaf! */}
            <circle cx="106" cy="46" r="3" fill="#1B241E" />
            <circle cx="105" cy="45" r="1" fill="#FFFFFF" />
          </g>
        ) : (
          // Normal Resting / Standing Arms
          <g>
            {/* Left Arm */}
            <path
              d="M56 94 C48 98 44 108 50 114 C55 118 62 110 62 102 Z"
              fill="#80C887"
              stroke="#2A6B36"
              strokeWidth="2"
            />
            {/* Right Arm */}
            <path
              d="M104 94 C112 98 116 108 110 114 C105 118 98 110 98 102 Z"
              fill="#80C887"
              stroke="#2A6B36"
              strokeWidth="2"
            />
          </g>
        )}
      </svg>
    </div>
  );
}

