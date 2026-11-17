"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { MinangThemePalette } from "@/lib/themes";

/**
 * 3D Animated Interlocking Metallic Gold Wedding Rings with Diamond Sparkle
 * (Inspired by @oendangin YouTube Short reference s08OhAMl_qs).
 * Floats and rotates gently in 3D perspective between Anak Daro & Marapulai.
 */
export function Floating3DWeddingRings({
  theme,
  className = "",
}: {
  theme: MinangThemePalette;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");

  return (
    <div
      className={`relative mx-auto flex flex-col items-center justify-center py-2 ${className}`}
      style={{ perspective: "600px" }}
    >
      <motion.div
        animate={{
          rotateY: [-18, 18, -18],
          rotateX: [8, -8, 8],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative flex items-center justify-center"
      >
        <svg
          viewBox="0 0 180 120"
          className="h-24 w-36 drop-shadow-[0_10px_14px_rgba(139,104,38,0.32)]"
          fill="none"
        >
          <defs>
            <linearGradient
              id={`ring-gold-1-${uid}`}
              x1="20"
              y1="20"
              x2="120"
              y2="100"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFF5D6" />
              <stop offset="30%" stopColor="#E6C373" />
              <stop offset="65%" stopColor="#9E7324" />
              <stop offset="100%" stopColor="#F5DC9C" />
            </linearGradient>

            <linearGradient
              id={`ring-gold-2-${uid}`}
              x1="60"
              y1="15"
              x2="160"
              y2="105"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#F3D895" />
              <stop offset="40%" stopColor="#B88B38" />
              <stop offset="75%" stopColor="#FFF2CC" />
              <stop offset="100%" stopColor="#8A621C" />
            </linearGradient>
          </defs>

          {/* Soft 3D Ground Shadow */}
          <ellipse
            cx="90"
            cy="106"
            rx="46"
            ry="6"
            fill={theme.accentGoldDark}
            fillOpacity="0.22"
          />

          {/* Left 3D Gold Band (Groom's Ring) */}
          <g transform="rotate(-16 74 62)">
            <ellipse
              cx="74"
              cy="62"
              rx="32"
              ry="24"
              stroke={`url(#ring-gold-1-${uid})`}
              strokeWidth="8.5"
            />
            <ellipse
              cx="74"
              cy="62"
              rx="28"
              ry="20"
              stroke="#FFF9E6"
              strokeWidth="1.2"
              strokeOpacity="0.75"
            />
          </g>

          {/* Right Interlocked 3D Gold Band with Solitaire Diamond (Bride's Ring) */}
          <g transform="rotate(18 106 58)">
            <ellipse
              cx="106"
              cy="58"
              rx="30"
              ry="23"
              stroke={`url(#ring-gold-2-${uid})`}
              strokeWidth="7.5"
            />
            <ellipse
              cx="106"
              cy="58"
              rx="26.5"
              ry="19.5"
              stroke="#FFF9E6"
              strokeWidth="1.1"
              strokeOpacity="0.8"
            />
            {/* Solitaire Diamond Crown */}
            <polygon
              points="106,22 114,29 109,37 103,37 98,29"
              fill="#FFFFFF"
              stroke={theme.accentGold}
              strokeWidth="1.2"
            />
            <polygon
              points="106,22 111,29 106,35 101,29"
              fill="#E5F6FF"
            />
          </g>

          {/* Animated Glint Sparkle on Diamond */}
          <g stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round">
            <line x1="114" y1="14" x2="114" y2="26" />
            <line x1="108" y1="20" x2="120" y2="20" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}

/**
 * Editorial Interlocking Couple Initials Monogram (Y & N) with Crimson-Gold Botanical Vines
 * (Inspired by @oendangin YouTube Short reference s08OhAMl_qs).
 */
export function InterlockingBotanicalMonogram({
  firstInitial = "Y",
  secondInitial = "N",
  theme,
  className = "",
}: {
  firstInitial?: string;
  secondInitial?: string;
  theme: MinangThemePalette;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ scale: 0.92, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className={`relative mx-auto flex h-32 w-44 items-center justify-center ${className}`}
    >
      {/* Subtle Golden Halo & Botanical Vines */}
      <svg
        viewBox="0 0 200 150"
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
      >
        <circle
          cx="100"
          cy="75"
          r="56"
          stroke={theme.accentGold}
          strokeWidth="1"
          strokeOpacity="0.45"
          strokeDasharray="4 4"
        />
        {/* Left & Right Botanical Leaf Sprigs */}
        <path
          d="M44 92 C34 72 38 48 56 32"
          stroke={theme.accentGold}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M40 78 C30 74 28 66 36 64 C42 66 42 74 40 78 Z"
          fill="#8E1B24"
        />
        <path
          d="M46 56 C36 50 36 42 44 41 C50 44 48 52 46 56 Z"
          fill={theme.accentGold}
        />

        <path
          d="M156 58 C166 78 162 102 144 118"
          stroke={theme.accentGold}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M160 72 C170 76 172 84 164 86 C158 84 158 76 160 72 Z"
          fill="#8E1B24"
        />
        <path
          d="M154 94 C164 100 164 108 156 109 C150 106 152 98 154 94 Z"
          fill={theme.accentGold}
        />
      </svg>

      {/* Interlocking Serif Initials */}
      <div className="relative flex items-center justify-center select-none">
        <span
          className="font-serif text-6xl font-bold leading-none drop-shadow-md"
          style={{
            color: theme.isLightBase ? "#7A1620" : theme.accentGoldLight,
            transform: "translate(-10px, -10px)",
          }}
        >
          {firstInitial}
        </span>
        <span
          className="font-script text-4xl leading-none opacity-85"
          style={{
            color: theme.accentGold,
            transform: "translate(0px, 2px)",
          }}
        >
          &amp;
        </span>
        <span
          className="font-serif text-6xl font-bold leading-none drop-shadow-md"
          style={{
            color: theme.isLightBase ? theme.accentGoldDark : "#D95B66",
            transform: "translate(8px, 12px)",
          }}
        >
          {secondInitial}
        </span>
      </div>
    </motion.div>
  );
}

/**
 * 2.5D Ornate Minang Lattice Side Borders & Swaying Botanical Corners
 * (Inspired by @oendangin YouTube Short reference s08OhAMl_qs).
 */
export function Minang25DBorderFrame({
  theme,
}: {
  theme: MinangThemePalette;
}) {
  const uid = useId().replace(/:/g, "");
  const gold = theme.accentGold;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Left Vertical Gold Ukiran Circle-Lattice Border */}
      <svg
        className="absolute bottom-0 left-0 top-0 h-full w-3.5 opacity-55"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={`lattice-l-${uid}`}
            width="14"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <line x1="1" y1="0" x2="1" y2="20" stroke={gold} strokeWidth="1.2" />
            <circle
              cx="7"
              cy="10"
              r="4.2"
              stroke={gold}
              strokeWidth="1.1"
              fill={gold}
              fillOpacity="0.15"
            />
            <line
              x1="13"
              y1="0"
              x2="13"
              y2="20"
              stroke={gold}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="14" height="100%" fill={`url(#lattice-l-${uid})`} />
      </svg>

      {/* Right Vertical Gold Ukiran Circle-Lattice Border */}
      <svg
        className="absolute bottom-0 right-0 top-0 h-full w-3.5 opacity-55"
        preserveAspectRatio="none"
      >
        <rect width="14" height="100%" fill={`url(#lattice-l-${uid})`} />
      </svg>

      {/* Top Hanging Songket Pucuak Rabuang Tapestry Valance */}
      <svg
        viewBox="0 0 420 26"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-5 w-full opacity-75"
      >
        <g fill="#6E151E" stroke={gold} strokeWidth="1">
          {Array.from({ length: 14 }).map((_, i) => {
            const x = i * 30;
            return (
              <polygon
                key={i}
                points={`${x},0 ${x + 15},22 ${x + 30},0`}
              />
            );
          })}
        </g>
      </svg>

      {/* Top-Left & Top-Right Animated Swaying Crimson-Gold Foliage */}
      <motion.svg
        animate={{ rotate: [-2, 2.5, -2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "top left" }}
        viewBox="0 0 90 90"
        className="absolute -left-1 -top-1 h-20 w-20 opacity-85"
      >
        <path
          d="M0 0 Q45 12 72 42 Q35 35 0 0 Z"
          fill="#7D1620"
          stroke={gold}
          strokeWidth="1"
        />
        <path
          d="M0 12 Q32 32 48 68 Q18 48 0 12 Z"
          fill="#5C1018"
          stroke={gold}
          strokeWidth="0.9"
        />
        <circle cx="52" cy="30" r="3" fill={theme.accentGoldLight} />
        <circle cx="34" cy="48" r="2.5" fill={theme.accentGoldLight} />
      </motion.svg>

      <motion.svg
        animate={{ rotate: [2, -2.5, 2] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "top right" }}
        viewBox="0 0 90 90"
        className="absolute -right-1 -top-1 h-20 w-20 -scale-x-100 opacity-85"
      >
        <path
          d="M0 0 Q45 12 72 42 Q35 35 0 0 Z"
          fill="#7D1620"
          stroke={gold}
          strokeWidth="1"
        />
        <path
          d="M0 12 Q32 32 48 68 Q18 48 0 12 Z"
          fill="#5C1018"
          stroke={gold}
          strokeWidth="0.9"
        />
        <circle cx="52" cy="30" r="3" fill={theme.accentGoldLight} />
        <circle cx="34" cy="48" r="2.5" fill={theme.accentGoldLight} />
      </motion.svg>
    </div>
  );
}
