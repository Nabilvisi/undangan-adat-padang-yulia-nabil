"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Compass,
  Globe,
  Map as MapIcon,
  Navigation,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { EventItem } from "@/types/wedding";
import { MinangThemePalette } from "@/lib/themes";

interface Location3DMapProps {
  event: EventItem;
  theme: MinangThemePalette;
}

/**
 * Interactive 3D & Live In-Website Map Viewer.
 * Guests can explore the venue directly inside the invitation without leaving
 * to Google Maps or any external app:
 * - Tab 1: Interactive 3D Architectural Diorama & Route Map (Rotate 360°, Tilt, Zoom)
 * - Tab 2: Live Embedded Street Map (Interactive Pan & Zoom inside the page)
 * - Tab 3: Live 3D Aerial Satellite View (Earth/Roof view inside the page)
 */
export function Location3DMap({ event, theme }: Location3DMapProps) {
  const [viewMode, setViewMode] = useState<"3d-diorama" | "live-map" | "satellite">(
    "3d-diorama"
  );
  const [rotZ, setRotZ] = useState(-18);
  const [rotX, setRotX] = useState(54);
  const [zoom, setZoom] = useState(1);

  const queryTarget =
    event.lat && event.lng
      ? `${event.lat},${event.lng}`
      : encodeURIComponent(
          `${event.venueName}, ${event.address}, ${event.city}`
        );

  const embedStreetUrl = `https://maps.google.com/maps?q=${queryTarget}&t=m&z=16&output=embed&iwloc=near`;
  const embedSatUrl = `https://maps.google.com/maps?q=${queryTarget}&t=k&z=17&output=embed&iwloc=near`;

  return (
    <div
      className="mt-4 overflow-hidden rounded-xl border text-left shadow-inner"
      style={{
        borderColor: `${theme.accentGold}66`,
        backgroundColor: "#14090B",
      }}
    >
      {/* Top Mode Switcher Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-1.5 border-b px-3 py-2"
        style={{
          borderColor: `${theme.accentGold}33`,
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode("3d-diorama")}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
              viewMode === "3d-diorama"
                ? "bg-[#C8A25A] text-[#1B1110]"
                : "text-white/75 hover:bg-white/10"
            }`}
          >
            <Box className="h-3 w-3" />
            Visual 3D
          </button>
          <button
            type="button"
            onClick={() => setViewMode("live-map")}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
              viewMode === "live-map"
                ? "bg-[#C8A25A] text-[#1B1110]"
                : "text-white/75 hover:bg-white/10"
            }`}
          >
            <MapIcon className="h-3 w-3" />
            Peta Langsung
          </button>
          <button
            type="button"
            onClick={() => setViewMode("satellite")}
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
              viewMode === "satellite"
                ? "bg-[#C8A25A] text-[#1B1110]"
                : "text-white/75 hover:bg-white/10"
            }`}
          >
            <Globe className="h-3 w-3" />
            Satelit 3D
          </button>
        </div>

        <span className="text-[10px] font-medium text-[#E8CD93]/80">
          Langsung di Website
        </span>
      </div>

      {/* MODE 1: INTERACTIVE 3D ARCHITECTURAL VENUE DIORAMA */}
      {viewMode === "3d-diorama" ? (
        <div className="relative h-64 w-full overflow-hidden bg-gradient-to-b from-[#1A080C] via-[#260C12] to-[#120507]">
          {/* Perspective 3D Stage */}
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ perspective: "850px" }}
          >
            <div
              className="relative h-56 w-64 transition-transform duration-300"
              style={{
                transformStyle: "preserve-3d",
                transform: `scale(${zoom}) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
              }}
            >
              {/* 3D Map Ground Plane */}
              <div
                className="absolute inset-0 rounded-2xl border-2 shadow-2xl"
                style={{
                  borderColor: theme.accentGold,
                  background:
                    "radial-gradient(circle at 50% 50%, #3A1219 0%, #1C080B 100%)",
                  backgroundImage:
                    "linear-gradient(rgba(232,205,147,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(232,205,147,0.12) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              {/* Main Highway / Boulevard Roads */}
              <div
                className="absolute inset-x-0 top-1/2 h-5 -translate-y-1/2 border-y border-[#E8CD93]/40 bg-[#0D0608]/90"
              >
                <div className="h-full w-full border-b border-dashed border-[#E8CD93]/60" style={{ height: "50%" }} />
              </div>
              <div
                className="absolute inset-y-0 left-1/2 w-5 -translate-x-1/2 border-x border-[#E8CD93]/40 bg-[#0D0608]/90"
              />

              {/* Animated Golden Route Path to Venue */}
              <motion.div
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute left-2 top-1/2 h-2 w-28 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-400 to-[#E8CD93] shadow-[0_0_12px_#E8CD93]"
              />

              {/* Surrounding 3D Extruded City Blocks */}
              {[
                { top: "14%", left: "14%", w: 34, h: 28 },
                { top: "16%", left: "66%", w: 38, h: 30 },
                { top: "66%", left: "16%", w: 36, h: 26 },
                { top: "68%", left: "66%", w: 32, h: 28 },
              ].map((b, i) => (
                <div
                  key={i}
                  className="absolute rounded border border-[#E8CD93]/40 bg-[#4A151E]/90 shadow-lg"
                  style={{
                    top: b.top,
                    left: b.left,
                    width: `${b.w}px`,
                    height: `${b.h}px`,
                    transform: "translateZ(14px)",
                  }}
                />
              ))}

              {/* CENTER 3D VENUE MONUMENT & FLOATING PIN (Stand Up in 3D Space) */}
              <div
                className="absolute left-1/2 top-1/2 flex flex-col items-center"
                style={{
                  transform: `translate(-50%, -50%) translateZ(36px) rotateZ(${-rotZ}deg) rotateX(${-rotX}deg)`,
                }}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex flex-col items-center"
                >
                  <div
                    className="max-w-[185px] truncate rounded-full px-3 py-1 text-[10px] font-bold shadow-xl"
                    style={{
                      backgroundColor: theme.accentGoldLight,
                      color: "#1B1110",
                      border: "1.5px solid #FFFFFF",
                    }}
                  >
                    📍 {event.venueName}
                  </div>

                  {/* Iconic 3D Gonjong Venue Crest */}
                  <svg
                    viewBox="0 0 100 60"
                    className="mt-1 h-12 w-20 drop-shadow-[0_6px_10px_rgba(0,0,0,0.85)]"
                  >
                    <path
                      d="M10 18 C22 42 36 46 50 46 C64 46 78 42 90 18 L80 54 H20 Z"
                      fill="#5A141D"
                      stroke="#E8CD93"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M50 6 C46 28 36 38 25 44 L50 52 L75 44 C64 38 54 28 50 6 Z"
                      fill="#C8A25A"
                      stroke="#FFF3D1"
                      strokeWidth="2"
                    />
                  </svg>
                </motion.div>

                {/* Pulsing Target Ring on Ground */}
                <span className="h-3 w-8 rounded-full bg-[#E8CD93]/60 blur-[2px]" />
              </div>
            </div>
          </div>

          {/* Interactive 3D Camera Controls Overlay */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 rounded-lg bg-black/65 px-3 py-1.5 backdrop-blur-md border border-white/10">
            <div className="flex items-center gap-2 text-[10px] text-white/80">
              <Compass className="h-3.5 w-3.5 text-[#E8CD93]" />
              <span>Putar 3D:</span>
              <input
                type="range"
                min={-65}
                max={65}
                value={rotZ}
                onChange={(e) => setRotZ(Number(e.target.value))}
                className="h-1 w-20 accent-[#C8A25A]"
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.35, +(z + 0.12).toFixed(2)))}
                title="Perbesar 3D"
                className="rounded bg-white/10 p-1 text-white hover:bg-white/20"
              >
                <ZoomIn className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.12).toFixed(2)))}
                title="Perkecil 3D"
                className="rounded bg-white/10 p-1 text-white hover:bg-white/20"
              >
                <ZoomOut className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setRotZ(-18);
                  setRotX(54);
                  setZoom(1);
                }}
                title="Reset Sudut 3D"
                className="rounded bg-white/10 p-1 text-white hover:bg-white/20"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* MODE 2 & 3: EMBEDDED INTERACTIVE MAP / SATELLITE DIRECTLY IN WEBSITE */}
      {viewMode === "live-map" || viewMode === "satellite" ? (
        <div className="relative h-64 w-full bg-[#181214]">
          <iframe
            title={`Peta Lokasi ${event.name}`}
            src={viewMode === "satellite" ? embedSatUrl : embedStreetUrl}
            className="h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      ) : null}

      {/* Bottom Landmark & In-Card Route Bar */}
      <div
        className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 text-[11px]"
        style={{
          backgroundColor: "rgba(18, 7, 9, 0.9)",
          color: "#F5EFE6",
        }}
      >
        <div className="flex items-center gap-1.5 text-white/85">
          <Navigation className="h-3.5 w-3.5 shrink-0 text-[#E8CD93]" />
          <span className="truncate">
            {event.landmarkNote || `${event.venueName}, ${event.city}`}
          </span>
        </div>
        {event.lat && event.lng ? (
          <span className="tabular-nums-editorial rounded bg-white/10 px-2 py-0.5 text-[10px] text-[#E8CD93]">
            {event.lat.toFixed(4)}, {event.lng.toFixed(4)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
