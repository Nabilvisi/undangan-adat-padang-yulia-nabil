"use client";

import React, { useId } from "react";

interface OrnamentProps {
  color?: string;
  secondaryColor?: string;
  className?: string;
  opacity?: number;
}

/**
 * Seamless SVG Songket Pandai Sikek background weave + subtle heritage texture.
 * Makes the background look like a finished luxury textile invitation canvas.
 */
export function SongketPatternOverlay({
  color = "#E5C687",
  opacity = 0.08,
  className = "",
}: OrnamentProps) {
  const uid = useId().replace(/:/g, "");
  const patternId = `songket-weave-${uid}`;
  const borderId = `songket-pucuak-${uid}`;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none select-none ${className}`}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id={patternId}
          width="72"
          height="72"
          patternUnits="userSpaceOnUse"
        >
          {/* Outer Songket diamond */}
          <path
            d="M36 2 L70 36 L36 70 L2 36 Z"
            fill="none"
            stroke={color}
            strokeWidth="0.9"
            strokeOpacity={opacity}
          />
          {/* Inner Saik Kalamai diamond */}
          <path
            d="M36 14 L58 36 L36 58 L14 36 Z"
            fill="none"
            stroke={color}
            strokeWidth="0.7"
            strokeOpacity={opacity * 0.9}
          />
          {/* Corner Pucuak Rabuang triangles */}
          <path
            d="M0 0 L12 0 L0 12 Z M72 0 L60 0 L72 12 Z M0 72 L12 72 L0 60 Z M72 72 L60 72 L72 60 Z"
            fill={color}
            fillOpacity={opacity * 0.65}
          />
          {/* Center Bintang Minang */}
          <circle
            cx="36"
            cy="36"
            r="3"
            fill={color}
            fillOpacity={opacity * 1.1}
          />
          <path
            d="M36 25 V47 M25 36 H47"
            stroke={color}
            strokeWidth="0.6"
            strokeOpacity={opacity * 0.75}
          />
        </pattern>

        <pattern
          id={borderId}
          width="36"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 18 L18 2 L36 18 Z"
            fill="none"
            stroke={color}
            strokeWidth="0.9"
            strokeOpacity={opacity * 1.5}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}

/**
 * Symmetrical 5-Gonjong Rumah Gadang silhouette line-art in brushed gold.
 */
export function GonjongRoofSVG({
  color = "#C8A25A",
  secondaryColor = "#E8CD93",
  className = "w-64 h-auto",
}: OrnamentProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `gonjong-gold-${uid}`;

  return (
    <svg
      viewBox="0 0 360 155"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="360" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={secondaryColor} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
      </defs>

      {/* Outer Left & Right Gonjong */}
      <path
        d="M28 38 C48 80 68 92 98 96 L108 110 L46 108 Z"
        fill={color}
        fillOpacity="0.14"
        stroke={`url(#${gradId})`}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M332 38 C312 80 292 92 262 96 L252 110 L314 108 Z"
        fill={color}
        fillOpacity="0.14"
        stroke={`url(#${gradId})`}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Inner Left & Right Gonjong */}
      <path
        d="M84 22 C104 72 126 85 154 90 L164 108 L94 106 Z"
        fill={color}
        fillOpacity="0.2"
        stroke={`url(#${gradId})`}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M276 22 C256 72 234 85 206 90 L196 108 L266 106 Z"
        fill={color}
        fillOpacity="0.2"
        stroke={`url(#${gradId})`}
        strokeWidth="1.75"
        strokeLinejoin="round"
      />

      {/* Center Grand Gonjong (Anjuang / Rangkiang Peak) */}
      <path
        d="M180 6 C174 52 156 78 130 92 L180 112 L230 92 C204 78 186 52 180 6 Z"
        fill={color}
        fillOpacity="0.24"
        stroke={`url(#${gradId})`}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      <line
        x1="180"
        y1="14"
        x2="180"
        y2="110"
        stroke={`url(#${gradId})`}
        strokeWidth="1.1"
        strokeOpacity="0.7"
      />

      {/* Carved Facade Base & Windows */}
      <rect
        x="58"
        y="108"
        width="244"
        height="34"
        rx="2"
        fill={color}
        fillOpacity="0.09"
        stroke={`url(#${gradId})`}
        strokeWidth="1.4"
      />
      <line
        x1="58"
        y1="116"
        x2="302"
        y2="116"
        stroke={`url(#${gradId})`}
        strokeWidth="0.9"
        strokeOpacity="0.7"
      />
      {/* Traditional Windows */}
      <rect x="78" y="121" width="18" height="16" stroke={`url(#${gradId})`} strokeWidth="1" />
      <rect x="108" y="121" width="18" height="16" stroke={`url(#${gradId})`} strokeWidth="1" />
      <rect x="234" y="121" width="18" height="16" stroke={`url(#${gradId})`} strokeWidth="1" />
      <rect x="264" y="121" width="18" height="16" stroke={`url(#${gradId})`} strokeWidth="1" />

      {/* Center Doorway Arch */}
      <path
        d="M167 142 V125 C167 119 193 119 193 125 V142"
        fill={color}
        fillOpacity="0.22"
        stroke={`url(#${gradId})`}
        strokeWidth="1.3"
      />
      {/* Horizontal Base Line */}
      <line
        x1="20"
        y1="147"
        x2="340"
        y2="147"
        stroke={`url(#${gradId})`}
        strokeWidth="1"
        strokeOpacity="0.5"
      />
    </svg>
  );
}

/**
 * Ceremonial Minang Umbrella (Payuang Kuniang) — placed symmetrically on cover or headers.
 */
export function PayuangKuniangSVG({
  color = "#C8A25A",
  className = "w-10 h-16",
}: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 64 110"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Finial & Pole */}
      <circle cx="32" cy="11" r="3.5" fill={color} />
      <line x1="32" y1="14" x2="32" y2="104" stroke={color} strokeWidth="1.8" />
      <line x1="25" y1="104" x2="39" y2="104" stroke={color} strokeWidth="1.6" />

      {/* Canopy Tier 1 */}
      <path
        d="M8 38 Q32 14 56 38 Z"
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Fringes */}
      <path
        d="M10 38 V45 M19 38 V45 M28 38 V45 M36 38 V45 M45 38 V45 M54 38 V45"
        stroke={color}
        strokeWidth="1.2"
        strokeOpacity="0.85"
      />
      {/* Lower Tier Accent */}
      <path
        d="M18 52 Q32 45 46 52"
        stroke={color}
        strokeWidth="1.1"
        strokeOpacity="0.65"
      />
    </svg>
  );
}

/**
 * Authentic Songket Pandai Sikek "Pucuak Rabuang" (Bamboo Shoot) horizontal divider.
 */
export function PucuakRabuangDividerSVG({
  color = "#C8A25A",
  className = "w-full max-w-[280px] h-8",
}: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 320 34"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Left & Right Hairlines */}
      <line x1="6" y1="17" x2="95" y2="17" stroke={color} strokeWidth="1" strokeOpacity="0.55" />
      <line x1="225" y1="17" x2="314" y2="17" stroke={color} strokeWidth="1" strokeOpacity="0.55" />

      {/* Outer Pucuak Rabuang Triangles */}
      <polygon
        points="102,25 116,9 130,25"
        fill={color}
        fillOpacity="0.16"
        stroke={color}
        strokeWidth="1.2"
      />
      <polygon
        points="190,25 204,9 218,25"
        fill={color}
        fillOpacity="0.16"
        stroke={color}
        strokeWidth="1.2"
      />

      {/* Center Grand Diamond / Saik Kalamai */}
      <polygon
        points="160,3 182,17 160,31 138,17"
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="1.4"
      />
      <polygon
        points="160,9 172,17 160,25 148,17"
        fill="none"
        stroke={color}
        strokeWidth="1"
      />
      <circle cx="160" cy="17" r="2.6" fill={color} />
      <circle cx="95" cy="17" r="2" fill={color} fillOpacity="0.8" />
      <circle cx="225" cy="17" r="2" fill={color} fillOpacity="0.8" />
    </svg>
  );
}

/**
 * Minangkabau Ukiran "Kaluak Paku" filigree corner ornament.
 */
export function UkiranCornerSVG({
  color = "#C8A25A",
  className = "w-10 h-10",
  flipX = false,
  flipY = false,
}: OrnamentProps & { flipX?: boolean; flipY?: boolean }) {
  const transform = `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`;
  return (
    <svg
      viewBox="0 0 60 60"
      fill="none"
      className={className}
      aria-hidden="true"
      style={{ transform }}
    >
      <path
        d="M4 54 V12 C4 7.5 7.5 4 12 4 H54"
        stroke={color}
        strokeWidth="1.6"
        strokeOpacity="0.85"
      />
      <path
        d="M11 46 V16 C11 13 13 11 16 11 H46"
        stroke={color}
        strokeWidth="0.9"
        strokeOpacity="0.55"
      />
      {/* Kaluak Paku Fern Spiral */}
      <path
        d="M15 32 C15 21 21 15 32 15 C37 15 40 18 40 22 C40 25 37.5 27 34.5 27 C32 27 30.5 25 31 22.5"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="15" cy="15" r="2.2" fill={color} />
    </svg>
  );
}

/**
 * Radial Suntiang Gadang Crown Crest — placed above monogram or Anak Daro section.
 */
export function SuntiangCrownSVG({
  color = "#C8A25A",
  className = "w-28 h-16",
}: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 180 95"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M25 82 C36 30 144 30 155 82"
        fill={color}
        fillOpacity="0.14"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M44 82 C54 46 126 46 136 82"
        stroke={color}
        strokeWidth="1.1"
        strokeOpacity="0.7"
      />
      {/* Radial Suntiang Rays */}
      <line x1="90" y1="12" x2="90" y2="44" stroke={color} strokeWidth="1.6" />
      <line x1="68" y1="16" x2="76" y2="46" stroke={color} strokeWidth="1.4" />
      <line x1="112" y1="16" x2="104" y2="46" stroke={color} strokeWidth="1.4" />
      <line x1="47" y1="26" x2="62" y2="52" stroke={color} strokeWidth="1.3" />
      <line x1="133" y1="26" x2="118" y2="52" stroke={color} strokeWidth="1.3" />
      <line x1="30" y1="42" x2="50" y2="62" stroke={color} strokeWidth="1.2" />
      <line x1="150" y1="42" x2="130" y2="62" stroke={color} strokeWidth="1.2" />
      <line x1="18" y1="62" x2="42" y2="73" stroke={color} strokeWidth="1.1" />
      <line x1="162" y1="62" x2="138" y2="73" stroke={color} strokeWidth="1.1" />

      {/* Top Pearls */}
      <circle cx="90" cy="11" r="3" fill={color} />
      <circle cx="68" cy="15" r="2.4" fill={color} />
      <circle cx="112" cy="15" r="2.4" fill={color} />
      <circle cx="46" cy="25" r="2.2" fill={color} />
      <circle cx="134" cy="25" r="2.2" fill={color} />
      <circle cx="29" cy="41" r="2" fill={color} />
      <circle cx="151" cy="41" r="2" fill={color} />

      {/* Base Ribbon */}
      <line x1="20" y1="82" x2="160" y2="82" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Carano (Traditional Minang Brass Siriah Dish) for Pasambahan section.
 */
export function CaranoIconSVG({
  color = "#C8A25A",
  className = "w-12 h-12",
}: OrnamentProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 38 C22 25 27 16 32 10 C37 16 42 25 44 38"
        fill={color}
        fillOpacity="0.16"
        stroke={color}
        strokeWidth="1.5"
      />
      <path
        d="M12 38 H52 L46 46 H18 Z"
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M25 46 L21 54 H43 L39 46" stroke={color} strokeWidth="1.4" />
      <line x1="17" y1="54" x2="47" y2="54" stroke={color} strokeWidth="1.6" />
      <circle cx="32" cy="9" r="2.3" fill={color} />
    </svg>
  );
}

/**
 * Full Vector Illustration of Minang Couple (Anak Daro & Marapulai)
 * Used when "Mode Ilustrasi Adat (Tanpa Foto)" is active.
 */
export function CoupleSiluetMinangSVG({
  color = "#C8A25A",
  accent = "#F8F2E7",
  className = "w-56 h-auto",
}: OrnamentProps & { accent?: string }) {
  return (
    <svg
      viewBox="0 0 280 250"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Halo Arch */}
      <path
        d="M35 230 V120 C35 55 82 18 140 18 C198 18 245 55 245 120 V230 Z"
        fill={color}
        fillOpacity="0.09"
        stroke={color}
        strokeWidth="1.4"
      />
      <path
        d="M46 225 V122 C46 64 88 28 140 28 C192 28 234 64 234 122 V225"
        stroke={color}
        strokeWidth="0.8"
        strokeDasharray="4 4"
        strokeOpacity="0.6"
      />

      {/* Anak Daro (Left) with Suntiang Gadang */}
      <g stroke={color} strokeWidth="1.5">
        <path
          d="M55 110 C62 66 122 66 129 110"
          fill={color}
          fillOpacity="0.22"
        />
        <line x1="92" y1="52" x2="92" y2="76" />
        <line x1="76" y1="56" x2="82" y2="79" />
        <line x1="108" y1="56" x2="102" y2="79" />
        <line x1="63" y1="68" x2="73" y2="85" />
        <line x1="121" y1="68" x2="111" y2="85" />
        <circle cx="92" cy="51" r="2.2" fill={accent} />
        <circle cx="76" cy="55" r="2" fill={accent} />
        <circle cx="108" cy="55" r="2" fill={accent} />

        {/* Face & Baju Kurung */}
        <ellipse cx="92" cy="118" rx="16" ry="20" fill={color} fillOpacity="0.14" />
        <path
          d="M54 225 C58 175 68 148 84 142 Q92 146 100 142 C116 148 126 175 130 225 Z"
          fill={color}
          fillOpacity="0.18"
        />
        <path d="M74 152 Q92 172 110 152" strokeWidth="1.3" />
      </g>

      {/* Marapulai (Right) with Saluak */}
      <g stroke={color} strokeWidth="1.5">
        <path
          d="M164 102 C166 78 182 70 192 70 C205 70 218 80 219 102 C205 97 178 97 164 102 Z"
          fill={color}
          fillOpacity="0.24"
        />
        <path d="M169 92 Q192 81 214 92" strokeWidth="1.1" />
        {/* Face & Penghulu Outfit */}
        <path
          d="M174 102 V118 C174 132 182 138 192 138 C202 138 210 132 210 118 V102 Z"
          fill={color}
          fillOpacity="0.14"
        />
        <path
          d="M150 225 C154 174 166 148 182 142 H202 C218 148 230 174 234 225 Z"
          fill={color}
          fillOpacity="0.2"
        />
        <line x1="192" y1="142" x2="192" y2="225" strokeWidth="1.2" />
        {/* Songket Cawek */}
        <path
          d="M162 192 Q192 199 222 192 L226 212 Q192 220 158 212 Z"
          fill={color}
          fillOpacity="0.16"
        />
      </g>

      {/* Bottom Ground Line */}
      <line x1="25" y1="225" x2="255" y2="225" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}

/**
 * Theme-reactive inline Minang Cover Artwork (Rumah Gadang under Crescent & Payuang Kuniang).
 * Automatically adapts colors to the active Minang theme palette.
 */
export function MinangCoverArtwork({
  bgTop = "#28070B",
  bgBottom = "#4A1118",
  gold = "#C8A25A",
  goldLight = "#EBD197",
  className = "w-full h-full",
}: {
  bgTop?: string;
  bgBottom?: string;
  gold?: string;
  goldLight?: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`cov-bg-${uid}`} x1="0" y1="0" x2="400" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={bgTop} />
          <stop offset="55%" stopColor={bgBottom} />
          <stop offset="100%" stopColor={bgTop} />
        </linearGradient>
        <radialGradient id={`cov-glow-${uid}`} cx="50%" cy="42%" r="48%">
          <stop offset="0%" stopColor={gold} stopOpacity="0.28" />
          <stop offset="100%" stopColor={gold} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#cov-bg-${uid})`} />
      <rect width="400" height="500" fill={`url(#cov-glow-${uid})`} />
      <path
        d="M36 470 V190 C36 90 110 42 200 34 C290 42 364 90 364 190 V470 Z"
        stroke={gold}
        strokeWidth="1.5"
        strokeOpacity="0.6"
      />
      <path
        d="M214 106 A28 28 0 1 0 237 145 A22 22 0 1 1 214 106 Z"
        fill={goldLight}
        fillOpacity="0.88"
      />
      <circle cx="130" cy="122" r="1.8" fill={goldLight} fillOpacity="0.7" />
      <circle cx="272" cy="122" r="1.8" fill={goldLight} fillOpacity="0.7" />

      {/* Payuang Kuniang Left & Right */}
      <g stroke={gold} strokeWidth="1.5">
        <line x1="84" y1="226" x2="84" y2="386" strokeOpacity="0.8" />
        <path d="M52 226 Q84 200 116 226 Z" fill={gold} fillOpacity="0.18" />
        <line x1="316" y1="226" x2="316" y2="386" strokeOpacity="0.8" />
        <path d="M284 226 Q316 200 348 226 Z" fill={gold} fillOpacity="0.18" />
      </g>

      {/* Rumah Gadang */}
      <g stroke={goldLight} strokeWidth="1.7" strokeLinejoin="round">
        <path d="M84 212 C104 256 122 266 148 270 L158 286 L102 284 Z" fill={bgTop} fillOpacity="0.88" />
        <path d="M316 212 C296 256 278 266 252 270 L242 286 L298 284 Z" fill={bgTop} fillOpacity="0.88" />
        <path d="M124 190 C142 244 162 256 184 260 L192 280 L132 278 Z" fill={bgTop} fillOpacity="0.92" />
        <path d="M276 190 C258 244 238 256 216 260 L208 280 L268 278 Z" fill={bgTop} fillOpacity="0.92" />
        <path d="M200 160 C195 208 176 234 154 246 L200 274 L246 246 C224 234 205 208 200 160 Z" fill={bgBottom} />
        <rect x="108" y="284" width="184" height="76" fill={bgTop} fillOpacity="0.94" />
        <rect x="122" y="308" width="22" height="26" fill={gold} fillOpacity="0.14" />
        <rect x="152" y="308" width="22" height="26" fill={gold} fillOpacity="0.14" />
        <rect x="226" y="308" width="22" height="26" fill={gold} fillOpacity="0.14" />
        <rect x="256" y="308" width="22" height="26" fill={gold} fillOpacity="0.14" />
        <path d="M184 360 V314 C184 304 216 304 216 314 V360 Z" fill={gold} fillOpacity="0.2" />
        <path d="M178 360 H222 L232 390 H168 Z" fill={bgTop} />
        <line x1="74" y1="390" x2="326" y2="390" strokeOpacity="0.75" />
      </g>

      {/* Pucuak Rabuang Bottom Border */}
      <g stroke={gold} strokeWidth="1.2" fill={gold} fillOpacity="0.16">
        <polygon points="75,436 93,408 111,436" />
        <polygon points="111,436 129,408 147,436" />
        <polygon points="147,436 165,408 183,436" />
        <polygon points="183,436 201,408 219,436" />
        <polygon points="219,436 237,408 255,436" />
        <polygon points="255,436 273,408 291,436" />
        <polygon points="291,436 309,408 327,436" />
      </g>
    </svg>
  );
}

/**
 * Theme-reactive Anak Daro Portrait Artwork.
 */
export function MinangBrideArtwork({
  bgTop = "#360C11",
  bgBottom = "#51151D",
  gold = "#C8A25A",
  goldLight = "#F1DA9D",
  className = "w-full h-full",
}: {
  bgTop?: string;
  bgBottom?: string;
  gold?: string;
  goldLight?: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`br-bg-${uid}`} x1="0" y1="0" x2="400" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={bgTop} />
          <stop offset="55%" stopColor={bgBottom} />
          <stop offset="100%" stopColor={bgTop} />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#br-bg-${uid})`} />
      <circle cx="200" cy="205" r="132" stroke={gold} strokeWidth="1.2" strokeOpacity="0.5" />
      <circle cx="200" cy="205" r="122" stroke={gold} strokeWidth="0.9" strokeDasharray="4 4" strokeOpacity="0.45" />

      <g stroke={goldLight} strokeWidth="1.6" strokeLinecap="round">
        <path d="M90 185 C112 86 288 86 310 185" fill={gold} fillOpacity="0.18" />
        <line x1="200" y1="70" x2="200" y2="118" />
        <line x1="168" y1="76" x2="178" y2="120" />
        <line x1="232" y1="76" x2="222" y2="120" />
        <line x1="138" y1="88" x2="156" y2="128" />
        <line x1="262" y1="88" x2="244" y2="128" />
        <line x1="112" y1="108" x2="138" y2="142" />
        <line x1="288" y1="108" x2="262" y2="142" />
        <circle cx="200" cy="70" r="3.5" fill={goldLight} />
        <circle cx="168" cy="76" r="2.8" fill={goldLight} />
        <circle cx="232" cy="76" r="2.8" fill={goldLight} />

        <ellipse cx="200" cy="198" rx="34" ry="44" fill={bgTop} />
        <circle cx="161" cy="210" r="4.5" fill={gold} fillOpacity="0.4" />
        <circle cx="239" cy="210" r="4.5" fill={gold} fillOpacity="0.4" />
        <path d="M188 240 V260 Q200 268 212 260 V240" fill={bgTop} />
        <path d="M108 432 C116 338 145 282 185 266 Q200 274 215 266 C255 282 284 338 292 432 Z" fill={bgTop} />
        <path d="M164 275 Q200 315 236 275" strokeWidth="1.8" />
        <circle cx="200" cy="304" r="4.5" fill={goldLight} />
        <path d="M200 330 L215 352 L200 374 L185 352 Z" strokeOpacity="0.6" />
      </g>
      <text x="200" y="468" textAnchor="middle" fill={goldLight} fontFamily="Georgia, serif" fontSize="11" letterSpacing="4" opacity="0.85">
        ANAK DARO
      </text>
    </svg>
  );
}

/**
 * Theme-reactive Marapulai Portrait Artwork.
 */
export function MinangGroomArtwork({
  bgTop = "#28070B",
  bgBottom = "#481219",
  gold = "#C8A25A",
  goldLight = "#F1DA9D",
  className = "w-full h-full",
}: {
  bgTop?: string;
  bgBottom?: string;
  gold?: string;
  goldLight?: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`gr-bg-${uid}`} x1="0" y1="0" x2="400" y2="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={bgTop} />
          <stop offset="55%" stopColor={bgBottom} />
          <stop offset="100%" stopColor={bgTop} />
        </linearGradient>
      </defs>
      <rect width="400" height="500" fill={`url(#gr-bg-${uid})`} />
      <circle cx="200" cy="205" r="132" stroke={gold} strokeWidth="1.2" strokeOpacity="0.5" />
      <circle cx="200" cy="205" r="122" stroke={gold} strokeWidth="0.9" strokeDasharray="4 4" strokeOpacity="0.45" />

      <g stroke={goldLight} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {/* Saluak Minang */}
        <path d="M148 168 C152 124 182 106 204 104 C226 106 248 126 252 168 C230 158 170 158 148 168 Z" fill={bgTop} />
        <path d="M156 150 Q200 130 245 150" strokeWidth="1.2" />
        <path d="M164 134 Q202 118 238 138" strokeWidth="1.2" />
        <path d="M236 124 L258 108 L250 146" fill={gold} fillOpacity="0.2" />

        {/* Face & Penghulu Robe */}
        <path d="M162 168 V200 C162 228 178 246 200 246 C222 246 238 228 238 200 V168 Z" fill={bgTop} />
        <path d="M185 245 V264 H215 V245" fill={bgTop} />
        <path d="M106 432 C116 336 142 280 182 264 H218 C258 280 284 336 294 432 Z" fill={bgTop} />
        <path d="M182 264 L200 296 L218 264" fill={gold} fillOpacity="0.2" />
        <line x1="200" y1="296" x2="200" y2="432" />
        <circle cx="200" cy="312" r="2.8" fill={goldLight} />
        <circle cx="200" cy="334" r="2.8" fill={goldLight} />

        {/* Cawek Songket & Keris */}
        <path d="M138 378 Q200 388 262 378 L268 410 Q200 420 132 410 Z" fill={gold} fillOpacity="0.18" />
        <path d="M180 360 L226 400" strokeWidth="2.4" />
      </g>
      <text x="200" y="468" textAnchor="middle" fill={goldLight} fontFamily="Georgia, serif" fontSize="11" letterSpacing="4" opacity="0.85">
        MARAPULAI
      </text>
    </svg>
  );
}
