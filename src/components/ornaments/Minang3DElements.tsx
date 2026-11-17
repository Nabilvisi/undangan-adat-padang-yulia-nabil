"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { MinangThemePalette } from "@/lib/themes";

/**
 * Bidirectional 3D Scroll Reveal Wrapper (`once: false`).
 * Animates both when scrolling DOWN and when scrolling UP (like by.wekita.id),
 * adding 3D perspective rotation (rotateX / rotateY) and scale transitions.
 */
export function Reveal3D({
  children,
  variant = "zoom-up",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  variant?:
    | "zoom-up"
    | "zoom-down"
    | "zoom-out"
    | "slide-left-3d"
    | "slide-right-3d";
  delay?: number;
  className?: string;
}) {
  const initialMap = {
    "zoom-up": { opacity: 0, y: 44, scale: 0.88, rotateX: 16 },
    "zoom-down": { opacity: 0, y: -40, scale: 0.88, rotateX: -16 },
    "zoom-out": { opacity: 0, y: 18, scale: 1.16, rotateX: 10 },
    "slide-left-3d": { opacity: 0, x: -48, scale: 0.9, rotateY: 18 },
    "slide-right-3d": { opacity: 0, x: 48, scale: 0.9, rotateY: -18 },
  };

  return (
    <motion.div
      initial={initialMap[variant]}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotateX: 0,
        rotateY: 0,
      }}
      viewport={{ once: false, amount: 0.16, margin: "-20px 0px -20px 0px" }}
      transition={{
        duration: 0.82,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ transformPerspective: 950 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Wekita-inspired Minang Swaying Corner Foliage, White Orchids & Golden Ukiran Wings.
 * Combines continuous ambient swaying (`±4deg`, `scale 1..1.06`) with repeatable
 * scroll-up / scroll-down 3D entrance on every section card.
 */
export function MinangCardFloralWings({
  theme,
}: {
  theme: MinangThemePalette;
}) {
  const gold = theme.accentGold;
  const goldLight = theme.accentGoldLight;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Top-Left Swaying Golden Tree Branch & Crimson Leaf Wing */}
      <motion.div
        initial={{ opacity: 0, x: -24, rotate: -14, scale: 0.82 }}
        whileInView={{ opacity: 0.85, x: 0, rotate: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{ duration: 0.85 }}
        className="absolute -left-2 -top-2 h-24 w-24"
      >
        <motion.svg
          animate={{ rotate: [-3.5, 3.5, -3.5], scale: [1, 1.06, 1] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top left" }}
          viewBox="0 0 110 110"
          className="h-full w-full"
          fill="none"
        >
          <path
            d="M0 0 Q55 10 92 48 Q48 42 0 0 Z"
            fill={gold}
            fillOpacity="0.24"
            stroke={gold}
            strokeWidth="1.2"
          />
          <path
            d="M0 14 Q42 36 64 82 Q24 58 0 14 Z"
            fill="#7D1620"
            fillOpacity="0.55"
            stroke={gold}
            strokeWidth="1"
          />
          {/* White Orchid Blossom Accent */}
          <g transform="translate(38, 34)">
            <circle cx="0" cy="-7" r="6" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
            <circle cx="-7" cy="0" r="6" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
            <circle cx="7" cy="0" r="6" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
            <circle cx="0" cy="7" r="6" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
            <circle cx="0" cy="0" r="3" fill={gold} />
          </g>
          <circle cx="68" cy="34" r="2.8" fill={goldLight} />
        </motion.svg>
      </motion.div>

      {/* Top-Right Swaying Golden Tree Branch & Crimson Leaf Wing */}
      <motion.div
        initial={{ opacity: 0, x: 24, rotate: 14, scale: 0.82 }}
        whileInView={{ opacity: 0.85, x: 0, rotate: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.12 }}
        transition={{ duration: 0.85 }}
        className="absolute -right-2 -top-2 h-24 w-24 -scale-x-100"
      >
        <motion.svg
          animate={{ rotate: [3.5, -3.5, 3.5], scale: [1, 1.06, 1] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top left" }}
          viewBox="0 0 110 110"
          className="h-full w-full"
          fill="none"
        >
          <path
            d="M0 0 Q55 10 92 48 Q48 42 0 0 Z"
            fill={gold}
            fillOpacity="0.24"
            stroke={gold}
            strokeWidth="1.2"
          />
          <path
            d="M0 14 Q42 36 64 82 Q24 58 0 14 Z"
            fill="#7D1620"
            fillOpacity="0.55"
            stroke={gold}
            strokeWidth="1"
          />
          <g transform="translate(38, 34)">
            <circle cx="0" cy="-7" r="6" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
            <circle cx="-7" cy="0" r="6" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
            <circle cx="7" cy="0" r="6" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
            <circle cx="0" cy="7" r="6" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
            <circle cx="0" cy="0" r="3" fill={gold} />
          </g>
        </motion.svg>
      </motion.div>

      {/* Bottom-Left & Bottom-Right Swaying White Orchids & Gold Leaves */}
      <motion.svg
        animate={{ rotate: [-3, 3, -3], scale: [1, 1.05, 1] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "bottom left" }}
        viewBox="0 0 90 90"
        className="absolute -bottom-1 -left-1 h-16 w-16 opacity-75"
        fill="none"
      >
        <path
          d="M0 90 Q35 55 72 68 Q40 82 0 90 Z"
          fill={gold}
          fillOpacity="0.22"
          stroke={gold}
          strokeWidth="1"
        />
        <circle cx="26" cy="66" r="5" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
        <circle cx="34" cy="60" r="4" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
        <circle cx="30" cy="64" r="2" fill={gold} />
      </motion.svg>

      <motion.svg
        animate={{ rotate: [3, -3, 3], scale: [1, 1.05, 1] }}
        transition={{ duration: 4.0, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "bottom right" }}
        viewBox="0 0 90 90"
        className="absolute -bottom-1 -right-1 h-16 w-16 -scale-x-100 opacity-75"
        fill="none"
      >
        <path
          d="M0 90 Q35 55 72 68 Q40 82 0 90 Z"
          fill={gold}
          fillOpacity="0.22"
          stroke={gold}
          strokeWidth="1"
        />
        <circle cx="26" cy="66" r="5" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
        <circle cx="34" cy="60" r="4" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
        <circle cx="30" cy="64" r="2" fill={gold} />
      </motion.svg>
    </div>
  );
}

/**
 * 3D Animated Interlocking Metallic Gold Wedding Rings with Diamond Sparkle
 * (Inspired by @oendangin YouTube Short reference s08OhAMl_qs).
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
    <Reveal3D variant="zoom-out" className={className}>
      <div
        className="relative mx-auto flex flex-col items-center justify-center py-2"
        style={{ perspective: "600px" }}
      >
        <motion.div
          animate={{
            rotateY: [-20, 20, -20],
            rotateX: [10, -10, 10],
            y: [0, -6, 0],
          }}
          transition={{
            duration: 5.2,
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

            <ellipse
              cx="90"
              cy="106"
              rx="46"
              ry="6"
              fill={theme.accentGoldDark}
              fillOpacity="0.22"
            />

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

            <g stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round">
              <line x1="114" y1="14" x2="114" y2="26" />
              <line x1="108" y1="20" x2="120" y2="20" />
            </g>
          </svg>
        </motion.div>
      </div>
    </Reveal3D>
  );
}

/**
 * Editorial Interlocking Couple Initials Monogram (Y & N) with Crimson-Gold Botanical Vines.
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
    <Reveal3D
      variant="zoom-out"
      className={`relative mx-auto flex h-32 w-44 items-center justify-center ${className}`}
    >
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
    </Reveal3D>
  );
}

/**
 * 2.5D Ornate Minang Lattice Side Borders, Swaying Golden Trees (.wayanGL/.wayanGR),
 * White Orchids, and Animated Double-Chevron Scroll Cue (Inspired by by.wekita.id & @oendangin).
 */
export function Minang25DBorderFrame({
  theme,
  showScrollCue = false,
}: {
  theme: MinangThemePalette;
  showScrollCue?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const gold = theme.accentGold;
  const goldLight = theme.accentGoldLight;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* Left & Right Vertical Gold Ukiran Circle-Lattice Borders */}
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

      {/* Swaying Golden Trees & Crimson Foliage on Left & Right (.wayanGL / .wayanGR style) */}
      <motion.svg
        animate={{ rotate: [0, -5, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "bottom left" }}
        viewBox="0 0 100 180"
        className="absolute left-0 top-6 h-36 w-20 opacity-80"
        fill="none"
      >
        <path
          d="M0 150 C18 110 28 75 56 35 M22 105 C38 95 54 88 72 82 M14 128 C32 120 48 116 64 114"
          stroke={goldLight}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <ellipse cx="58" cy="34" rx="22" ry="12" fill={gold} fillOpacity="0.28" stroke={goldLight} strokeWidth="1" />
        <ellipse cx="72" cy="80" rx="18" ry="9" fill="#7D1620" fillOpacity="0.65" stroke={gold} strokeWidth="1" />
        <ellipse cx="64" cy="112" rx="16" ry="8" fill={gold} fillOpacity="0.24" stroke={goldLight} strokeWidth="1" />
      </motion.svg>

      <motion.svg
        animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "bottom right" }}
        viewBox="0 0 100 180"
        className="absolute right-0 top-6 h-36 w-20 -scale-x-100 opacity-80"
        fill="none"
      >
        <path
          d="M0 150 C18 110 28 75 56 35 M22 105 C38 95 54 88 72 82 M14 128 C32 120 48 116 64 114"
          stroke={goldLight}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <ellipse cx="58" cy="34" rx="22" ry="12" fill={gold} fillOpacity="0.28" stroke={goldLight} strokeWidth="1" />
        <ellipse cx="72" cy="80" rx="18" ry="9" fill="#7D1620" fillOpacity="0.65" stroke={gold} strokeWidth="1" />
        <ellipse cx="64" cy="112" rx="16" ry="8" fill={gold} fillOpacity="0.24" stroke={goldLight} strokeWidth="1" />
      </motion.svg>

      {/* Bottom White Orchids & Crimson Florals (Left & Right Corners) */}
      <motion.svg
        animate={{ rotate: [-3, 4, -3], scale: [1, 1.06, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "bottom left" }}
        viewBox="0 0 110 110"
        className="absolute bottom-0 left-2 h-20 w-20 opacity-85"
        fill="none"
      >
        <path d="M0 110 Q32 62 78 78 Q42 96 0 110 Z" fill="#1F3B2E" stroke={gold} strokeWidth="1" />
        <g transform="translate(32, 74)">
          <circle cx="0" cy="-8" r="7" fill="#FFFDF8" stroke={gold} strokeWidth="1" />
          <circle cx="-8" cy="0" r="7" fill="#FFFDF8" stroke={gold} strokeWidth="1" />
          <circle cx="8" cy="0" r="7" fill="#FFFDF8" stroke={gold} strokeWidth="1" />
          <circle cx="0" cy="8" r="7" fill="#FFFDF8" stroke={gold} strokeWidth="1" />
          <circle cx="0" cy="0" r="3.5" fill="#9E1F2B" />
        </g>
        <g transform="translate(54, 88)">
          <circle cx="0" cy="-6" r="5" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
          <circle cx="-6" cy="0" r="5" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
          <circle cx="6" cy="0" r="5" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
          <circle cx="0" cy="0" r="2.5" fill={gold} />
        </g>
      </motion.svg>

      <motion.svg
        animate={{ rotate: [3, -4, 3], scale: [1, 1.06, 1] }}
        transition={{ duration: 3.7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "bottom right" }}
        viewBox="0 0 110 110"
        className="absolute bottom-0 right-2 h-20 w-20 -scale-x-100 opacity-85"
        fill="none"
      >
        <path d="M0 110 Q32 62 78 78 Q42 96 0 110 Z" fill="#1F3B2E" stroke={gold} strokeWidth="1" />
        <g transform="translate(32, 74)">
          <circle cx="0" cy="-8" r="7" fill="#FFFDF8" stroke={gold} strokeWidth="1" />
          <circle cx="-8" cy="0" r="7" fill="#FFFDF8" stroke={gold} strokeWidth="1" />
          <circle cx="8" cy="0" r="7" fill="#FFFDF8" stroke={gold} strokeWidth="1" />
          <circle cx="0" cy="8" r="7" fill="#FFFDF8" stroke={gold} strokeWidth="1" />
          <circle cx="0" cy="0" r="3.5" fill="#9E1F2B" />
        </g>
        <g transform="translate(54, 88)">
          <circle cx="0" cy="-6" r="5" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
          <circle cx="-6" cy="0" r="5" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
          <circle cx="6" cy="0" r="5" fill="#FFFDF8" stroke={gold} strokeWidth="0.9" />
          <circle cx="0" cy="0" r="2.5" fill={gold} />
        </g>
      </motion.svg>

      {/* Animated Golden Double-Chevron Scroll Cue (like by.wekita.id Hero) */}
      {showScrollCue ? (
        <motion.div
          animate={{ y: [0, 7, 0], opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2"
        >
          <svg viewBox="0 0 28 28" className="h-6 w-6" fill="none">
            <path
              d="M6 7 L14 15 L22 7 M6 14 L14 22 L22 14"
              stroke={goldLight}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      ) : null}
    </div>
  );
}
