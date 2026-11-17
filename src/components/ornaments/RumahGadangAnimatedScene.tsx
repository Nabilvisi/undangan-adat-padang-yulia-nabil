"use client";

import React, { useId } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MinangThemePalette } from "@/lib/themes";

interface RumahGadangSceneProps {
  theme: MinangThemePalette;
  className?: string;
  showPetals?: boolean;
}

const PETALS = [
  { left: "7%", delay: 0, duration: 11, size: 8 },
  { left: "19%", delay: 2.2, duration: 13, size: 10 },
  { left: "34%", delay: 1.1, duration: 10, size: 7 },
  { left: "51%", delay: 3.4, duration: 14, size: 9 },
  { left: "66%", delay: 0.7, duration: 12, size: 8 },
  { left: "82%", delay: 2.8, duration: 11.5, size: 10 },
  { left: "93%", delay: 1.6, duration: 13.5, size: 7 },
];

/**
 * 3D Multi-Plane Parallax Rumah Gadang Scene inspired by @KalavaniInvitation (W2dzxgzx53o)
 * & @oendangin (s08OhAMl_qs):
 * - Layer 1 (Far Z): Misty Bukit Barisan mountain ridges & golden crescent sky
 * - Layer 2 (Mid-Far Z): Pine forest & Animated Cascading Waterfall (Air Terjun Lembah Anai)
 * - Layer 3 (Center Z): 3D Carved Wooden Rumah Gadang Bagonjong with white-gold fascia & Rangkiang
 * - Layer 4 (Mid-Near Z): 3D Perspective Cobblestone Pathway leading to Rumah Gadang
 * - Layer 5 (Near Z): Flying White Doves (Burung Merpati Putih) crossing the scene
 * - Layer 6 (Foreground Z): Swaying White Lilies & Crimson-Gold Botanical Foliage
 */
export function RumahGadangAnimatedScene({
  theme,
  className = "",
  showPetals = true,
}: RumahGadangSceneProps) {
  const uid = useId().replace(/:/g, "");
  const gold = theme.accentGold;
  const goldLight = theme.accentGoldLight;
  const skyTop = theme.isLightBase ? "#3E0E14" : theme.bgSticky;
  const skyMid = theme.isLightBase ? "#5B161F" : theme.bgPrimary;

  // Live Scroll-Up & Scroll-Down 3D Camera Parallax
  const { scrollYProgress } = useScroll();
  const scrollScale = useTransform(scrollYProgress, [0, 0.45, 1], [1, 1.14, 1.03]);
  const scrollRotateX = useTransform(scrollYProgress, [0, 0.5, 1], [0, 6, -4]);
  const scrollYShift = useTransform(scrollYProgress, [0, 0.5, 1], ["0%", "-4%", "3%"]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
      style={{ perspective: "1000px" }}
    >
      {/* 3D Scroll-Driven Camera Wrapper + Continuous Breathing */}
      <motion.div
        style={{
          scale: scrollScale,
          rotateX: scrollRotateX,
          y: scrollYShift,
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full transition-transform duration-150 ease-out"
      >
        <motion.div
          animate={{
            scale: [1, 1.035, 1],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="h-full w-full"
        >
        <svg
          viewBox="0 0 1200 900"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          className="h-full w-full"
        >
          <defs>
            <linearGradient
              id={`sky-${uid}`}
              x1="600"
              y1="0"
              x2="600"
              y2="900"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={skyTop} />
              <stop offset="55%" stopColor={skyMid} />
              <stop offset="100%" stopColor="#110406" />
            </linearGradient>

            <radialGradient id={`moon-glow-${uid}`} cx="50%" cy="32%" r="48%">
              <stop offset="0%" stopColor={goldLight} stopOpacity="0.36" />
              <stop offset="50%" stopColor={gold} stopOpacity="0.14" />
              <stop offset="100%" stopColor={gold} stopOpacity="0" />
            </radialGradient>

            <linearGradient
              id={`gold-stroke-${uid}`}
              x1="200"
              y1="150"
              x2="1000"
              y2="780"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={goldLight} />
              <stop offset="50%" stopColor={gold} />
              <stop offset="100%" stopColor={theme.accentGoldDark} />
            </linearGradient>

            <linearGradient
              id={`wood-wall-${uid}`}
              x1="285"
              y1="480"
              x2="915"
              y2="630"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#4A1A14" />
              <stop offset="50%" stopColor="#63261C" />
              <stop offset="100%" stopColor="#38120E" />
            </linearGradient>

            <linearGradient
              id={`waterfall-${uid}`}
              x1="920"
              y1="260"
              x2="920"
              y2="620"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.48" />
              <stop offset="50%" stopColor="#D8F0F8" stopOpacity="0.32" />
              <stop offset="100%" stopColor={goldLight} stopOpacity="0.08" />
            </linearGradient>

            <pattern
              id={`ukiran-wall-${uid}`}
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M12 2 L22 12 L12 22 L2 12 Z"
                stroke={goldLight}
                strokeWidth="0.75"
                strokeOpacity="0.34"
              />
              <circle
                cx="12"
                cy="12"
                r="1.6"
                fill={goldLight}
                fillOpacity="0.35"
              />
            </pattern>
          </defs>

          {/* LAYER 1: Sky & Golden Glow */}
          <rect width="1200" height="900" fill={`url(#sky-${uid})`} />
          <rect width="1200" height="900" fill={`url(#moon-glow-${uid})`} />

          {/* Sunburst Rays */}
          <g stroke={goldLight} strokeOpacity="0.08" strokeWidth="1.5">
            <line x1="600" y1="360" x2="150" y2="40" />
            <line x1="600" y1="360" x2="350" y2="10" />
            <line x1="600" y1="360" x2="600" y2="0" />
            <line x1="600" y1="360" x2="850" y2="10" />
            <line x1="600" y1="360" x2="1050" y2="40" />
          </g>

          {/* Golden Crescent Moon */}
          <path
            d="M625 105 A46 46 0 1 0 668 170 A36 36 0 1 1 625 105 Z"
            fill={goldLight}
            fillOpacity="0.45"
          />

          {/* LAYER 2: Distant Misty Bukit Barisan Ridges */}
          <path
            d="M0 540 L160 390 L310 470 L480 310 L640 440 L820 280 L1010 430 L1200 340 V700 H0 Z"
            fill="#1D080C"
            fillOpacity="0.48"
          />
          <path
            d="M0 590 L140 450 L270 515 L440 370 L590 485 L760 355 L930 495 L1070 430 L1200 560 V720 H0 Z"
            fill="#160508"
            fillOpacity="0.65"
            stroke={gold}
            strokeOpacity="0.2"
            strokeWidth="1.2"
          />

          {/* LAYER 2B: Right Cliff & Cascading Waterfall (Air Terjun Lembah Anai Reference) */}
          <g opacity="0.65">
            {/* Cliff Rocks */}
            <path
              d="M830 330 L905 275 L985 290 L1045 360 L1030 600 L820 600 Z"
              fill="#231215"
              stroke={gold}
              strokeOpacity="0.25"
              strokeWidth="1"
            />
            {/* Waterfall Stream */}
            <path
              d="M895 282 C905 360 912 440 925 585 H968 C955 440 945 360 935 285 Z"
              fill={`url(#waterfall-${uid})`}
            />
            <path
              d="M908 290 C916 380 922 460 934 580 M924 292 C932 380 940 460 952 580"
              stroke="#FFFFFF"
              strokeOpacity="0.45"
              strokeWidth="1.5"
              strokeDasharray="10 8"
            />
            {/* Waterfall Mist Pool at Base */}
            <ellipse
              cx="942"
              cy="585"
              rx="55"
              ry="12"
              fill="#FFFFFF"
              fillOpacity="0.22"
            />
          </g>

          {/* Highland Pine Trees (Left & Right Midground) */}
          {[110, 165, 220, 855, 995, 1060].map((tx, i) => (
            <g
              key={tx}
              opacity={0.42 + (i % 2) * 0.12}
              fill="#192822"
              stroke={gold}
              strokeOpacity="0.22"
              strokeWidth="0.8"
            >
              <polygon points={`${tx},370 ${tx - 26},435 ${tx + 26},435`} />
              <polygon points={`${tx},410 ${tx - 34},485 ${tx + 34},485`} />
              <polygon points={`${tx},455 ${tx - 42},540 ${tx + 42},540`} />
            </g>
          ))}

          {/* Left & Right Rangkiang (Traditional Rice Barns) */}
          <g
            stroke={`url(#gold-stroke-${uid})`}
            strokeWidth="1.6"
            strokeOpacity="0.62"
          >
            <path
              d="M125 420 C142 465 158 475 180 480 C202 475 218 465 235 420 L220 535 H140 Z"
              fill="#2A0B0F"
              fillOpacity="0.85"
            />
            <line x1="152" y1="535" x2="152" y2="625" strokeWidth="2.5" />
            <line x1="208" y1="535" x2="208" y2="625" strokeWidth="2.5" />

            <path
              d="M965 420 C982 465 998 475 1020 480 C1042 475 1058 465 1075 420 L1060 535 H980 Z"
              fill="#2A0B0F"
              fillOpacity="0.85"
            />
            <line x1="992" y1="535" x2="992" y2="625" strokeWidth="2.5" />
            <line x1="1048" y1="535" x2="1048" y2="625" strokeWidth="2.5" />
          </g>

          {/* LAYER 3: GRAND 3D CARVED WOODEN 7-GONJONG RUMAH GADANG */}
          <g
            stroke={`url(#gold-stroke-${uid})`}
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.82"
          >
            {/* Outer Gonjong Peaks */}
            <path
              d="M235 340 C268 428 308 452 365 462 L385 500 L270 496 Z"
              fill="#2A0B0E"
            />
            <path
              d="M965 340 C932 428 892 452 835 462 L815 500 L930 496 Z"
              fill="#2A0B0E"
            />

            {/* Mid Gonjong Peaks */}
            <path
              d="M315 290 C348 395 390 425 445 436 L465 492 L340 488 Z"
              fill="#350E13"
            />
            <path
              d="M885 290 C852 395 810 425 755 436 L735 492 L860 488 Z"
              fill="#350E13"
            />

            {/* Inner Gonjong Peaks with White-Gold Listplank Trim (Short #1 Style) */}
            <path
              d="M405 245 C438 362 478 398 532 412 L548 485 L425 482 Z"
              fill="#421218"
            />
            <path
              d="M405 245 C438 362 478 398 532 412"
              stroke="#FFF6E5"
              strokeOpacity="0.65"
              strokeWidth="3"
            />
            <path
              d="M795 245 C762 362 722 398 668 412 L652 485 L775 482 Z"
              fill="#421218"
            />
            <path
              d="M795 245 C762 362 722 398 668 412"
              stroke="#FFF6E5"
              strokeOpacity="0.65"
              strokeWidth="3"
            />

            {/* Center Anjuang / Main Gonjong Spire */}
            <path
              d="M600 185 C588 292 548 352 495 382 L600 455 L705 382 C652 352 612 292 600 185 Z"
              fill="#4E151C"
            />
            <path
              d="M600 185 C588 292 548 352 495 382 M600 185 C612 292 652 352 705 382"
              stroke="#FFF6E5"
              strokeOpacity="0.7"
              strokeWidth="2.8"
            />
            <line
              x1="600"
              y1="195"
              x2="600"
              y2="450"
              strokeWidth="1.4"
              strokeOpacity="0.7"
            />

            {/* Finial Spires */}
            {[
              [235, 336],
              [315, 286],
              [405, 241],
              [600, 180],
              [795, 241],
              [885, 286],
              [965, 336],
            ].map(([cx, cy], idx) => (
              <circle key={idx} cx={cx} cy={cy} r="3.5" fill={goldLight} />
            ))}

            {/* 3D Carved Timber Body (Dindiang Ukiran Kayu Jati/Mahoni) */}
            <rect
              x="285"
              y="492"
              width="630"
              height="125"
              fill={`url(#wood-wall-${uid})`}
            />
            <rect
              x="285"
              y="492"
              width="630"
              height="125"
              fill={`url(#ukiran-wall-${uid})`}
            />

            <line x1="285" y1="514" x2="915" y2="514" strokeWidth="1.6" />
            <line x1="285" y1="592" x2="915" y2="592" strokeWidth="1.6" />

            {/* Warm Glowing Windows */}
            {[320, 385, 450, 705, 770, 835].map((wx) => (
              <g key={wx}>
                <rect
                  x={wx}
                  y={528}
                  width="44"
                  height="48"
                  rx="3"
                  fill={goldLight}
                  fillOpacity="0.25"
                  stroke={goldLight}
                  strokeWidth="1.4"
                />
                <line
                  x1={wx + 22}
                  y1={528}
                  x2={wx + 22}
                  y2={576}
                  strokeWidth="1"
                />
                <line
                  x1={wx}
                  y1={552}
                  x2={wx + 44}
                  y2={552}
                  strokeWidth="1"
                />
              </g>
            ))}

            {/* Center Ceremonial Doorway & Tanggo */}
            <path
              d="M558 617 V534 C558 514 642 514 642 534 V617 Z"
              fill={goldLight}
              fillOpacity="0.28"
              stroke={goldLight}
              strokeWidth="2"
            />
            <path
              d="M545 617 H655 L682 685 H518 Z"
              fill="#22070B"
              stroke={gold}
              strokeWidth="1.8"
            />
            <line x1="536" y1="638" x2="664" y2="638" strokeWidth="1.3" />
            <line x1="528" y1="660" x2="672" y2="660" strokeWidth="1.3" />

            {/* Tonggak Tuo Pillars */}
            {[310, 390, 470, 730, 810, 890].map((px) => (
              <line
                key={px}
                x1={px}
                y1="617"
                x2={px}
                y2="685"
                strokeWidth="4"
              />
            ))}
            <line x1="100" y1="685" x2="1100" y2="685" strokeWidth="2" />
          </g>

          {/* LAYER 4: 3D Perspective Cobblestone Garden Pathway (Short #1 Reference) */}
          <g opacity="0.52" stroke={goldLight} strokeWidth="1.2">
            <path
              d="M518 685 L340 900 H860 L682 685 Z"
              fill="#2A1517"
              fillOpacity="0.75"
            />
            {/* Perspective Stone Tile Grid Lines */}
            <line x1="560" y1="685" x2="465" y2="900" strokeOpacity="0.45" />
            <line x1="600" y1="685" x2="600" y2="900" strokeOpacity="0.5" />
            <line x1="640" y1="685" x2="735" y2="900" strokeOpacity="0.45" />
            <line x1="490" y1="720" x2="710" y2="720" strokeOpacity="0.45" />
            <line x1="455" y1="762" x2="745" y2="762" strokeOpacity="0.5" />
            <line x1="415" y1="810" x2="785" y2="810" strokeOpacity="0.55" />
            <line x1="372" y1="862" x2="828" y2="862" strokeOpacity="0.6" />
          </g>

          {/* LAYER 6: Foreground White Lilies & Tropical Foliage (Left & Right Corners) */}
          <g opacity="0.58">
            {/* Left White Lilies Cluster */}
            <path
              d="M0 900 Q70 760 160 720 Q90 820 60 900 Z"
              fill="#1E352B"
              stroke={gold}
              strokeWidth="1"
            />
            <path
              d="M20 900 Q120 790 220 770 Q140 845 110 900 Z"
              fill="#274437"
            />
            {/* Lily Blossoms Left */}
            <g transform="translate(135, 745)">
              <path
                d="M0 0 C-12 -22 -28 -18 -22 0 C-28 18 -12 22 0 0 Z"
                fill="#FFFDF9"
                stroke={goldLight}
                strokeWidth="1"
              />
              <path
                d="M0 0 C12 -22 28 -18 22 0 C28 18 12 22 0 0 Z"
                fill="#FFFDF9"
                stroke={goldLight}
                strokeWidth="1"
              />
              <path
                d="M0 0 C-18 -12 -18 -28 0 -24 C18 -28 18 -12 0 0 Z"
                fill="#FFFDF9"
                stroke={goldLight}
                strokeWidth="1"
              />
              <circle cx="0" cy="-2" r="3.5" fill={gold} />
            </g>

            {/* Right White Lilies Cluster */}
            <path
              d="M1200 900 Q1130 760 1040 720 Q1110 820 1140 900 Z"
              fill="#1E352B"
              stroke={gold}
              strokeWidth="1"
            />
            <path
              d="M1180 900 Q1080 790 980 770 Q1060 845 1090 900 Z"
              fill="#274437"
            />
            <g transform="translate(1065, 745)">
              <path
                d="M0 0 C-12 -22 -28 -18 -22 0 C-28 18 -12 22 0 0 Z"
                fill="#FFFDF9"
                stroke={goldLight}
                strokeWidth="1"
              />
              <path
                d="M0 0 C12 -22 28 -18 22 0 C28 18 12 22 0 0 Z"
                fill="#FFFDF9"
                stroke={goldLight}
                strokeWidth="1"
              />
              <path
                d="M0 0 C-18 -12 -18 -28 0 -24 C18 -28 18 -12 0 0 Z"
                fill="#FFFDF9"
                stroke={goldLight}
                strokeWidth="1"
              />
              <circle cx="0" cy="-2" r="3.5" fill={gold} />
            </g>
          </g>
        </svg>
        </motion.div>
      </motion.div>

      {/* LAYER 5: Animated Flying White Doves (Burung Merpati Putih — Short #1 Reference) */}
      <motion.div
        initial={{ x: "-12vw", y: "46vh", scale: 0.75 }}
        animate={{
          x: ["-12vw", "48vw", "108vw"],
          y: ["48vh", "32vh", "22vh"],
          scale: [0.7, 1, 0.85],
        }}
        transition={{
          duration: 19,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-0 top-0 z-10 opacity-75"
      >
        <svg viewBox="0 0 64 48" className="h-9 w-12 drop-shadow-md">
          <path
            d="M30 26 C20 10 8 8 2 14 C12 18 18 24 24 28 C18 30 12 34 6 38 C16 36 24 33 32 30 C40 28 50 24 60 18 C52 18 44 20 38 22 C44 12 52 6 58 2 C46 6 36 14 30 26 Z"
            fill="#FFFDF9"
            stroke={goldLight}
            strokeWidth="1.2"
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ x: "105vw", y: "38vh", scale: 0.65 }}
        animate={{
          x: ["105vw", "52vw", "-10vw"],
          y: ["38vh", "26vh", "18vh"],
          scale: [0.65, 0.9, 0.7],
        }}
        transition={{
          duration: 23,
          delay: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-0 top-0 z-10 opacity-65"
      >
        <svg
          viewBox="0 0 64 48"
          className="h-8 w-10 -scale-x-100 drop-shadow-md"
        >
          <path
            d="M30 26 C20 10 8 8 2 14 C12 18 18 24 24 28 C18 30 12 34 6 38 C16 36 24 33 32 30 C40 28 50 24 60 18 C52 18 44 20 38 22 C44 12 52 6 58 2 C46 6 36 14 30 26 Z"
            fill="#FFFDF9"
            stroke={goldLight}
            strokeWidth="1.2"
          />
        </svg>
      </motion.div>

      {/* Animated Drifting Highland Mist / Clouds over Gonjong Roof */}
      <motion.div
        animate={{ x: ["-6%", "6%", "-6%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-0 top-[24%] h-40 opacity-30"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${goldLight}33 0%, transparent 70%)`,
        }}
      />

      {/* Animated Swaying Marawa Banners (Left & Right) */}
      <motion.div
        animate={{ rotate: [-2.5, 2.5, -2.5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "bottom center" }}
        className="absolute bottom-[22%] left-[6%] hidden h-40 w-4 overflow-hidden rounded-t-full border border-[#C8A25A]/50 opacity-65 sm:flex"
      >
        <div className="h-full w-1/3 bg-[#141013]" />
        <div className="h-full w-1/3 bg-[#8B1A24]" />
        <div className="h-full w-1/3 bg-[#E5C158]" />
      </motion.div>

      <motion.div
        animate={{ rotate: [2.5, -2.5, 2.5] }}
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "bottom center" }}
        className="absolute bottom-[22%] right-[6%] hidden h-40 w-4 overflow-hidden rounded-t-full border border-[#C8A25A]/50 opacity-65 sm:flex"
      >
        <div className="h-full w-1/3 bg-[#141013]" />
        <div className="h-full w-1/3 bg-[#8B1A24]" />
        <div className="h-full w-1/3 bg-[#E5C158]" />
      </motion.div>

      {/* Falling Bunga Rampai & Golden Songket Shimmer Particles */}
      {showPetals ? (
        <div className="absolute inset-0 overflow-hidden">
          {PETALS.map((p, idx) => (
            <motion.span
              key={idx}
              initial={{ y: -30, opacity: 0, rotate: 0 }}
              animate={{
                y: ["0vh", "95vh"],
                x: [0, idx % 2 === 0 ? 28 : -28, 0],
                opacity: [0, 0.65, 0.55, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: p.left,
                width: `${p.size}px`,
                height: `${p.size}px`,
                background:
                  idx % 2 === 0
                    ? `linear-gradient(135deg, ${goldLight}, ${gold})`
                    : "linear-gradient(135deg, #9E1F2B, #E8CD93)",
                borderRadius: idx % 2 === 0 ? "2px" : "9999px 0 9999px 0",
              }}
              className="absolute top-0 shadow-sm"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
