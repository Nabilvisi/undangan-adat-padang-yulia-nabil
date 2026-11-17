"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import { MinangThemePalette } from "@/lib/themes";

interface RumahGadangSceneProps {
  theme: MinangThemePalette;
  className?: string;
  showPetals?: boolean;
}

const PETALS = [
  { left: "8%", delay: 0, duration: 11, size: 8 },
  { left: "21%", delay: 2.2, duration: 13, size: 10 },
  { left: "36%", delay: 1.1, duration: 10, size: 7 },
  { left: "52%", delay: 3.4, duration: 14, size: 9 },
  { left: "67%", delay: 0.7, duration: 12, size: 8 },
  { left: "81%", delay: 2.8, duration: 11.5, size: 10 },
  { left: "92%", delay: 1.6, duration: 13.5, size: 7 },
];

/**
 * Full-bleed iconic Minangkabau Rumah Gadang Bagonjong & Bukit Barisan scenic background
 * with living animations (drifting highland mist, swaying Marawa flags, glowing windows,
 * rippling reflection water, and floating golden Songket / Bunga Rampai particles).
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

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Scenic SVG Canvas */}
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
            <stop offset="58%" stopColor={skyMid} />
            <stop offset="100%" stopColor="#120507" />
          </linearGradient>

          <radialGradient id={`moon-glow-${uid}`} cx="50%" cy="34%" r="46%">
            <stop offset="0%" stopColor={goldLight} stopOpacity="0.34" />
            <stop offset="50%" stopColor={gold} stopOpacity="0.12" />
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

          <pattern
            id={`ukiran-wall-${uid}`}
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M12 2 L22 12 L12 22 L2 12 Z"
              stroke={gold}
              strokeWidth="0.7"
              strokeOpacity="0.28"
            />
            <circle cx="12" cy="12" r="1.5" fill={goldLight} fillOpacity="0.3" />
          </pattern>
        </defs>

        {/* Sky Base & Golden Radial Glow */}
        <rect width="1200" height="900" fill={`url(#sky-${uid})`} />
        <rect width="1200" height="900" fill={`url(#moon-glow-${uid})`} />

        {/* Radiant Sunburst Rays behind Rumah Gadang */}
        <g stroke={goldLight} strokeOpacity="0.08" strokeWidth="1.5">
          <line x1="600" y1="360" x2="150" y2="40" />
          <line x1="600" y1="360" x2="350" y2="10" />
          <line x1="600" y1="360" x2="600" y2="0" />
          <line x1="600" y1="360" x2="850" y2="10" />
          <line x1="600" y1="360" x2="1050" y2="40" />
          <line x1="600" y1="360" x2="60" y2="220" />
          <line x1="600" y1="360" x2="1140" y2="220" />
        </g>

        {/* Golden Crescent Moon & Twinkling Stars */}
        <path
          d="M625 110 A48 48 0 1 0 668 175 A38 38 0 1 1 625 110 Z"
          fill={goldLight}
          fillOpacity="0.42"
        />
        <circle cx="240" cy="130" r="2" fill={goldLight} fillOpacity="0.55" />
        <circle cx="410" cy="95" r="2.5" fill={goldLight} fillOpacity="0.45" />
        <circle cx="810" cy="105" r="2" fill={goldLight} fillOpacity="0.5" />
        <circle cx="960" cy="145" r="2.5" fill={goldLight} fillOpacity="0.4" />

        {/* Bukit Barisan (Mount Marapi & Singgalang) Silhouette */}
        <path
          d="M0 590 L140 450 L270 515 L440 370 L590 485 L760 355 L930 495 L1070 430 L1200 560 V720 H0 Z"
          fill="#1A0609"
          fillOpacity="0.55"
          stroke={gold}
          strokeOpacity="0.18"
          strokeWidth="1.2"
        />

        {/* Left & Right Rangkiang (Traditional Rice Barns) */}
        <g
          stroke={`url(#gold-stroke-${uid})`}
          strokeWidth="1.6"
          strokeOpacity="0.55"
        >
          {/* Left Rangkiang */}
          <path
            d="M125 420 C142 465 158 475 180 480 C202 475 218 465 235 420 L220 535 H140 Z"
            fill="#22070B"
            fillOpacity="0.78"
          />
          <line x1="152" y1="535" x2="152" y2="625" strokeWidth="2.5" />
          <line x1="208" y1="535" x2="208" y2="625" strokeWidth="2.5" />

          {/* Right Rangkiang */}
          <path
            d="M965 420 C982 465 998 475 1020 480 C1042 475 1058 465 1075 420 L1060 535 H980 Z"
            fill="#22070B"
            fillOpacity="0.78"
          />
          <line x1="992" y1="535" x2="992" y2="625" strokeWidth="2.5" />
          <line x1="1048" y1="535" x2="1048" y2="625" strokeWidth="2.5" />
        </g>

        {/* GRAND ICONIC 7-GONJONG RUMAH GADANG */}
        <g
          stroke={`url(#gold-stroke-${uid})`}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          opacity="0.72"
        >
          {/* Tier 3 Outer Gonjong (Left & Right) */}
          <path
            d="M235 340 C268 428 308 452 365 462 L385 500 L270 496 Z"
            fill="#26070B"
            fillOpacity="0.9"
          />
          <path
            d="M965 340 C932 428 892 452 835 462 L815 500 L930 496 Z"
            fill="#26070B"
            fillOpacity="0.9"
          />

          {/* Tier 2 Mid Gonjong (Left & Right) */}
          <path
            d="M315 290 C348 395 390 425 445 436 L465 492 L340 488 Z"
            fill="#31090E"
            fillOpacity="0.92"
          />
          <path
            d="M885 290 C852 395 810 425 755 436 L735 492 L860 488 Z"
            fill="#31090E"
            fillOpacity="0.92"
          />

          {/* Tier 1 Inner Gonjong (Left & Right) */}
          <path
            d="M405 245 C438 362 478 398 532 412 L548 485 L425 482 Z"
            fill="#3B0C12"
            fillOpacity="0.95"
          />
          <path
            d="M795 245 C762 362 722 398 668 412 L652 485 L775 482 Z"
            fill="#3B0C12"
            fillOpacity="0.95"
          />

          {/* Center Anjuang / Main Gonjong Spire */}
          <path
            d="M600 185 C588 292 548 352 495 382 L600 455 L705 382 C652 352 612 292 600 185 Z"
            fill="#460F16"
          />
          <line x1="600" y1="195" x2="600" y2="450" strokeWidth="1.4" strokeOpacity="0.65" />

          {/* Finial Spires on Gonjong Tips */}
          <circle cx="235" cy="336" r="3" fill={goldLight} />
          <circle cx="315" cy="286" r="3" fill={goldLight} />
          <circle cx="405" cy="241" r="3.5" fill={goldLight} />
          <circle cx="600" cy="180" r="4.5" fill={goldLight} />
          <circle cx="795" cy="241" r="3.5" fill={goldLight} />
          <circle cx="885" cy="286" r="3" fill={goldLight} />
          <circle cx="965" cy="336" r="3" fill={goldLight} />

          {/* Main Carved Timber Body (Dindiang Ukiran) */}
          <rect
            x="285"
            y="492"
            width="630"
            height="125"
            fill="#29070B"
            fillOpacity="0.95"
          />
          <rect
            x="285"
            y="492"
            width="630"
            height="125"
            fill={`url(#ukiran-wall-${uid})`}
          />

          {/* Horizontal Carved Bands */}
          <line x1="285" y1="514" x2="915" y2="514" strokeWidth="1.5" />
          <line x1="285" y1="592" x2="915" y2="592" strokeWidth="1.5" />

          {/* Warm Glowing Windows (7 Jendela Rumah Gadang) */}
          {[320, 385, 450, 705, 770, 835].map((wx) => (
            <g key={wx}>
              <rect
                x={wx}
                y={528}
                width="44"
                height="48"
                rx="3"
                fill={goldLight}
                fillOpacity="0.22"
                stroke={goldLight}
                strokeWidth="1.4"
              />
              <line x1={wx + 22} y1={528} x2={wx + 22} y2={576} strokeWidth="1" />
              <line x1={wx} y1={552} x2={wx + 44} y2={552} strokeWidth="1" />
            </g>
          ))}

          {/* Grand Ceremonial Center Doorway & Tanggo (Stairs) */}
          <path
            d="M558 617 V534 C558 514 642 514 642 534 V617 Z"
            fill={goldLight}
            fillOpacity="0.26"
            stroke={goldLight}
            strokeWidth="2"
          />
          <path
            d="M545 617 H655 L682 685 H518 Z"
            fill="#1D0508"
            stroke={gold}
            strokeWidth="1.8"
          />
          <line x1="536" y1="638" x2="664" y2="638" strokeWidth="1.3" />
          <line x1="528" y1="660" x2="672" y2="660" strokeWidth="1.3" />

          {/* Tonggak Tuo (Support Pillars) */}
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

          {/* Ground Courtyard Line & Pucuak Rabuang Frieze */}
          <line x1="100" y1="685" x2="1100" y2="685" strokeWidth="2" />
        </g>

        {/* Rippling Water Reflection below Rumah Gadang */}
        <g stroke={goldLight} strokeOpacity="0.22" strokeWidth="1.2">
          <line x1="380" y1="715" x2="820" y2="715" strokeDasharray="18 12" />
          <line x1="420" y1="738" x2="780" y2="738" strokeDasharray="12 16" />
          <line x1="460" y1="760" x2="740" y2="760" strokeDasharray="10 18" />
        </g>
      </svg>

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
