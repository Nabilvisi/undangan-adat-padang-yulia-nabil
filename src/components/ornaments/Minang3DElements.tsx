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
      viewport={{ once: false, amount: 0.01 }}
      transition={{
        duration: 0.72,
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

/**
 * Embossed 5-Gonjong Gold Rumah Gadang Crown Crest
 * (signature luxury emblem topping Wedding Event, Couple & Wedding Gift pill-arch cards).
 */
export function RumahGadangGoldCrownSVG({
  theme,
  className = "mx-auto h-14 w-32",
}: {
  theme: MinangThemePalette;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const goldLight = theme.accentGoldLight;
  const gold = theme.accentGold;
  const goldDark = theme.accentGoldDark;

  return (
    <svg
      viewBox="0 0 240 105"
      fill="none"
      className={`${className} drop-shadow-[0_4px_8px_rgba(92,21,29,0.22)]`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`crown-g-${uid}`} x1="20" y1="10" x2="220" y2="95" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={goldLight} />
          <stop offset="45%" stopColor={gold} />
          <stop offset="100%" stopColor={goldDark} />
        </linearGradient>
      </defs>

      {/* Outer Gonjong Spires (5 Peaks) */}
      <path
        d="M20 56 C38 66 56 64 74 44 L84 72 H32 Z"
        fill={`url(#crown-g-${uid})`}
        stroke={goldDark}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M220 56 C202 66 184 64 166 44 L156 72 H208 Z"
        fill={`url(#crown-g-${uid})`}
        stroke={goldDark}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Mid Gonjong Peaks */}
      <path
        d="M52 28 C72 48 90 52 108 32 L114 70 H64 Z"
        fill={`url(#crown-g-${uid})`}
        stroke="#FFF6DF"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M188 28 C168 48 150 52 132 32 L126 70 H176 Z"
        fill={`url(#crown-g-${uid})`}
        stroke="#FFF6DF"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Center Tall Main Gonjong */}
      <path
        d="M120 6 C113 30 98 44 82 52 L120 74 L158 52 C142 44 127 30 120 6 Z"
        fill={`url(#crown-g-${uid})`}
        stroke="#FFF9E8"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <line x1="120" y1="10" x2="120" y2="72" stroke="#FFF8E2" strokeWidth="1" strokeOpacity="0.7" />

      {/* Carved Wooden Body */}
      <rect
        x="48"
        y="70"
        width="144"
        height="22"
        rx="3"
        fill={`url(#crown-g-${uid})`}
        stroke={goldDark}
        strokeWidth="1.2"
      />
      {/* Carved Truss / Window Arches */}
      {[64, 82, 100, 120, 140, 158, 176].map((wx) => (
        <rect
          key={wx}
          x={wx - 4}
          y="75"
          width="8"
          height="11"
          rx="1.5"
          fill={theme.accentPrimary}
          fillOpacity="0.72"
          stroke="#FFF7DF"
          strokeWidth="0.7"
        />
      ))}

      {/* Base Plinth & Ornamental Curl */}
      <path
        d="M36 93 H204 M62 98 C90 102 150 102 178 98"
        stroke={gold}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Spire Tip Gems */}
      {[
        [20, 54],
        [52, 26],
        [120, 5],
        [188, 26],
        [220, 54],
      ].map(([cx, cy], idx) => (
        <circle key={idx} cx={cx} cy={cy} r="2.4" fill="#FFF9E6" stroke={gold} strokeWidth="0.8" />
      ))}
    </svg>
  );
}

/**
 * Animated Fluttering Crimson-Gold Butterflies (inspired by @GALERIUNDANGAN_OFFICIAL MP4 #3).
 */
export function FlutteringButterflies({
  theme,
  className = "",
}: {
  theme: MinangThemePalette;
  className?: string;
}) {
  const butterflies = [
    { left: "10%", top: "16%", delay: 0.2, duration: 9, scale: 0.92, dx: [0, 32, -12, 0], dy: [0, -22, -40, 0] },
    { left: "82%", top: "18%", delay: 1.4, duration: 10.5, scale: 0.85, dx: [0, -30, 14, 0], dy: [0, -20, 12, 0] },
    { left: "16%", top: "38%", delay: 2.3, duration: 11, scale: 0.74, dx: [0, 22, -16, 0], dy: [0, -24, -8, 0] },
  ];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {butterflies.map((b, idx) => (
        <motion.div
          key={idx}
          style={{ left: b.left, top: b.top }}
          animate={{
            x: b.dx,
            y: b.dy,
            rotate: idx % 2 === 0 ? [-8, 12, -6] : [8, -12, 6],
            scale: [b.scale * 0.9, b.scale * 1.08, b.scale * 0.9],
          }}
          transition={{
            duration: b.duration,
            delay: b.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute z-20"
        >
          <motion.svg
            animate={{ scaleX: [1, 0.42, 1] }}
            transition={{ duration: 0.42, repeat: Infinity, ease: "easeInOut" }}
            viewBox="0 0 42 36"
            className="h-7 w-8 drop-shadow-[0_4px_6px_rgba(0,0,0,0.28)]"
            fill="none"
          >
            {/* Left Wings */}
            <path
              d="M21 18 C13 4 2 4 3 15 C4 22 14 21 21 19 Z"
              fill="#9E1F2B"
              stroke={theme.accentGoldLight}
              strokeWidth="1"
            />
            <path
              d="M21 20 C13 21 6 27 10 32 C15 35 19 28 21 21 Z"
              fill="#7A131E"
              stroke={theme.accentGold}
              strokeWidth="0.9"
            />
            {/* Right Wings */}
            <path
              d="M21 18 C29 4 40 4 39 15 C38 22 28 21 21 19 Z"
              fill="#9E1F2B"
              stroke={theme.accentGoldLight}
              strokeWidth="1"
            />
            <path
              d="M21 20 C29 21 36 27 32 32 C27 35 23 28 21 21 Z"
              fill="#7A131E"
              stroke={theme.accentGold}
              strokeWidth="0.9"
            />
            {/* Wing Gold Spots */}
            <circle cx="11" cy="13" r="1.8" fill={theme.accentGoldLight} />
            <circle cx="31" cy="13" r="1.8" fill={theme.accentGoldLight} />
            {/* Body */}
            <line x1="21" y1="11" x2="21" y2="27" stroke={theme.accentGoldLight} strokeWidth="1.5" strokeLinecap="round" />
          </motion.svg>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Top Swaying Gold Minang Pendants & Triangular Songket Pucuak Rabuang Header Valance
 * (combines MP4 #2 hanging gold pendants & MP4 #1/#3 triangular valance).
 */
export function HangingMinangValance({
  theme,
  className = "",
}: {
  theme: MinangThemePalette;
  className?: string;
}) {
  const gold = theme.accentGold;
  const goldLight = theme.accentGoldLight;
  const pendantPositions = [10, 24, 38, 62, 76, 90];

  return (
    <div
      className={`pointer-events-none relative w-full overflow-visible select-none ${className}`}
      aria-hidden="true"
    >
      {/* Top Pucuak Rabuang Songket Valance Strip */}
      <svg viewBox="0 0 420 22" preserveAspectRatio="none" className="h-4 w-full opacity-85">
        <g fill={theme.accentPrimary} stroke={gold} strokeWidth="0.9">
          {Array.from({ length: 21 }).map((_, idx) => {
            const x = idx * 20;
            return <polygon key={idx} points={`${x},0 ${x + 10},18 ${x + 20},0`} />;
          })}
        </g>
      </svg>

      {/* Hanging Swaying Golden Minang Geometric Tassels */}
      <div className="relative h-8 w-full">
        {pendantPositions.map((pct, i) => (
          <motion.svg
            key={pct}
            style={{ left: `${pct}%`, transformOrigin: "top center" }}
            animate={{ rotate: i % 2 === 0 ? [-3.5, 3.5, -3.5] : [3.5, -3.5, 3.5] }}
            transition={{ duration: 3.4 + (i % 3) * 0.4, repeat: Infinity, ease: "easeInOut" }}
            viewBox="0 0 24 44"
            className={`absolute top-0 -translate-x-1/2 ${
              i === 0 || i === 5 ? "h-9 w-5" : i === 2 || i === 3 ? "h-6 w-4" : "h-7 w-4"
            } opacity-90`}
            fill="none"
          >
            <line x1="12" y1="0" x2="12" y2="12" stroke={goldLight} strokeWidth="1.2" />
            <polygon points="12,11 19,20 12,29 5,20" fill={gold} fillOpacity="0.35" stroke={goldLight} strokeWidth="1.2" />
            <polygon points="12,15 15.5,20 12,25 8.5,20" fill="#8B1A24" stroke={goldLight} strokeWidth="0.8" />
            <circle cx="12" cy="34" r="2.2" fill={goldLight} />
            <line x1="12" y1="36" x2="12" y2="42" stroke={gold} strokeWidth="1" strokeDasharray="1.5 1.5" />
          </motion.svg>
        ))}
      </div>
    </div>
  );
}

/**
 * Foreground Fixed Bottom 5-Gonjong Rumah Gadang & Crimson/Coral Botanical Corner Clusters
 * (creates true 3D depth parallax as scrolled invitation sections slide behind the eaves!).
 */
export function ForegroundRumahGadangOverlay({
  theme,
  className = "",
}: {
  theme: MinangThemePalette;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const gold = theme.accentGold;
  const goldLight = theme.accentGoldLight;
  const wallFill = theme.isLightBase ? "#5B1E24" : "#24080B";
  const roofFill = theme.isLightBase ? "#75252D" : "#340C10";

  return (
    <div
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 520 165"
        preserveAspectRatio="xMidYMax slice"
        className="h-full w-full drop-shadow-[0_-10px_22px_rgba(14,4,6,0.45)]"
        fill="none"
      >
        <defs>
          <linearGradient id={`fg-fade-${uid}`} x1="260" y1="68" x2="260" y2="165" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#140407" stopOpacity="0" />
            <stop offset="65%" stopColor="#140407" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#120406" stopOpacity="0.94" />
          </linearGradient>
        </defs>

        {/* Feather-soft bottom mist grounding without sharp horizontal seam */}
        <rect x="0" y="68" width="520" height="97" fill={`url(#fg-fade-${uid})`} />

        {/* Carved Foreground 5-Gonjong Rumah Gadang Silhouette */}
        <g stroke={goldLight} strokeWidth="1.6" strokeLinejoin="round">
          {/* Outer Gonjong */}
          <path d="M98 62 C116 92 132 98 158 102 L166 118 H114 Z" fill={roofFill} />
          <path d="M422 62 C404 92 388 98 362 102 L354 118 H406 Z" fill={roofFill} />

          {/* Inner Gonjong */}
          <path d="M168 38 C184 78 202 88 228 92 L236 114 H178 Z" fill={roofFill} />
          <path d="M352 38 C336 78 318 88 292 92 L284 114 H342 Z" fill={roofFill} />

          {/* Center Tall Gonjong */}
          <path d="M260 16 C252 54 234 74 210 86 L260 112 L310 86 C286 74 268 54 260 16 Z" fill={roofFill} />
          <line x1="260" y1="22" x2="260" y2="110" stroke={gold} strokeWidth="1.1" />

          {/* Carved Timber Walls */}
          <rect x="122" y="114" width="276" height="51" fill={wallFill} stroke={gold} strokeWidth="1.4" />
          {[142, 168, 194, 298, 324, 350].map((wx) => (
            <rect
              key={wx}
              x={wx}
              y="124"
              width="18"
              height="24"
              rx="2"
              fill={goldLight}
              fillOpacity="0.28"
              stroke={goldLight}
              strokeWidth="1"
            />
          ))}
          {/* Main Stairs */}
          <path d="M242 118 H278 V165 H242 Z" fill={goldLight} fillOpacity="0.2" stroke={goldLight} strokeWidth="1.2" />

          {/* Finial Tips */}
          {[
            [98, 60],
            [168, 36],
            [260, 14],
            [352, 36],
            [422, 60],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2.6" fill={goldLight} />
          ))}
        </g>

        {/* Left & Right Lush Crimson Roses & Coral-Pink Orchids Cluster */}
        <g>
          {/* Left Foliage */}
          <path d="M0 165 Q25 100 92 115 Q52 140 42 165 Z" fill="#1C392A" stroke={gold} strokeWidth="0.9" />
          <path d="M40 165 Q78 118 128 134 Q88 152 80 165 Z" fill="#264C39" />
          {/* Crimson Rose */}
          <g transform="translate(56, 128)">
            <circle cx="0" cy="0" r="14" fill="#9E1F2B" stroke={goldLight} strokeWidth="1" />
            <circle cx="-2" cy="-2" r="9" fill="#B92B3A" />
            <circle cx="0" cy="0" r="4.5" fill="#F29C9C" />
          </g>
          {/* Coral Orchid / White Lily */}
          <g transform="translate(94, 144)">
            <circle cx="0" cy="-8" r="6.5" fill="#FFFDF8" stroke={gold} strokeWidth="0.8" />
            <circle cx="-8" cy="0" r="6.5" fill="#FFFDF8" stroke={gold} strokeWidth="0.8" />
            <circle cx="8" cy="0" r="6.5" fill="#FFFDF8" stroke={gold} strokeWidth="0.8" />
            <circle cx="0" cy="7" r="6.5" fill="#FFFDF8" stroke={gold} strokeWidth="0.8" />
            <circle cx="0" cy="0" r="3.2" fill="#C84654" />
          </g>

          {/* Right Foliage */}
          <path d="M520 165 Q495 100 428 115 Q468 140 478 165 Z" fill="#1C392A" stroke={gold} strokeWidth="0.9" />
          <path d="M480 165 Q442 118 392 134 Q432 152 440 165 Z" fill="#264C39" />
          <g transform="translate(464, 128)">
            <circle cx="0" cy="0" r="14" fill="#9E1F2B" stroke={goldLight} strokeWidth="1" />
            <circle cx="2" cy="-2" r="9" fill="#B92B3A" />
            <circle cx="0" cy="0" r="4.5" fill="#F29C9C" />
          </g>
          <g transform="translate(426, 144)">
            <circle cx="0" cy="-8" r="6.5" fill="#FFFDF8" stroke={gold} strokeWidth="0.8" />
            <circle cx="-8" cy="0" r="6.5" fill="#FFFDF8" stroke={gold} strokeWidth="0.8" />
            <circle cx="8" cy="0" r="6.5" fill="#FFFDF8" stroke={gold} strokeWidth="0.8" />
            <circle cx="0" cy="7" r="6.5" fill="#FFFDF8" stroke={gold} strokeWidth="0.8" />
            <circle cx="0" cy="0" r="3.2" fill="#C84654" />
          </g>
        </g>
      </svg>
    </div>
  );
}
