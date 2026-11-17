"use client";

import React from "react";
import { motion } from "framer-motion";
import { MailOpen } from "lucide-react";
import { WeddingConfig } from "@/types/wedding";
import { MinangThemePalette } from "@/lib/themes";
import { getCoupleTitle } from "@/lib/config-store";
import {
  GonjongRoofSVG,
  MinangCoverArtwork,
  PayuangKuniangSVG,
  PucuakRabuangDividerSVG,
  SongketPatternOverlay,
  UkiranCornerSVG,
} from "@/components/ornaments/MinangOrnaments";
import { RumahGadangAnimatedScene } from "@/components/ornaments/RumahGadangAnimatedScene";

interface CoverGateProps {
  config: WeddingConfig;
  theme: MinangThemePalette;
  guestName: string;
  onOpen: () => void;
}

export function CoverGate({
  config,
  theme,
  guestName,
  onOpen,
}: CoverGateProps) {
  const coupleTitle = getCoupleTitle(config);

  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      exit={{
        y: "-100%",
        opacity: 0.92,
        transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
      }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: theme.bgPrimaryGradient }}
    >
      {/* Iconic Animated Rumah Gadang Scenic Backdrop */}
      <RumahGadangAnimatedScene theme={theme} showPetals />

      {/* Full-screen Songket textile weave overlay */}
      <div className="absolute inset-0">
        <SongketPatternOverlay
          color={theme.songketStroke}
          opacity={theme.songketOpacity * 0.9}
        />
      </div>

      {/* Subtle radial spotlight */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 38%, ${theme.accentGold}22 0%, transparent 62%)`,
        }}
      />

      {/* Centered Invitation Gate Card */}
      <div className="relative z-10 mx-4 flex w-full max-w-[420px] flex-col items-center px-6 py-8 text-center">
        {/* Ornamental Frame Border */}
        <div
          className="relative flex w-full flex-col items-center px-6 py-8 shadow-2xl backdrop-blur-[2px]"
          style={{
            border: `1.5px solid ${theme.accentGold}88`,
            backgroundColor: theme.isLightBase
              ? "rgba(252, 249, 243, 0.92)"
              : "rgba(18, 6, 8, 0.56)",
            borderRadius: "180px 180px 14px 14px",
          }}
        >
          {/* Corner Ornaments at bottom */}
          <UkiranCornerSVG
            color={theme.accentGold}
            flipY
            className="pointer-events-none absolute bottom-2 left-2 h-9 w-9 opacity-80"
          />
          <UkiranCornerSVG
            color={theme.accentGold}
            flipX
            flipY
            className="pointer-events-none absolute bottom-2 right-2 h-9 w-9 opacity-80"
          />

          {/* Top Ceremonial Label */}
          <p
            className="font-display text-[10px] uppercase tracking-[0.28em]"
            style={{ color: theme.accentGold }}
          >
            {config.cover.subtitle || "Maimbau Baralek Gadang"}
          </p>

          {/* Rumah Gadang & Payuang Kuniang Crest */}
          <div className="mt-3 flex items-end justify-center gap-1">
            <PayuangKuniangSVG
              color={theme.accentGold}
              className="-mr-2 h-14 w-8 opacity-90"
            />
            <GonjongRoofSVG
              color={theme.accentGold}
              secondaryColor={theme.accentGoldLight}
              className="h-auto w-44"
            />
            <PayuangKuniangSVG
              color={theme.accentGold}
              className="-ml-2 h-14 w-8 opacity-90"
            />
          </div>

          {/* Cover Portrait Circle / Arch */}
          {config.photoMode === "with-photo" && config.cover.coverPhoto ? (
            <div
              className="mt-2 h-28 w-28 overflow-hidden rounded-full p-1"
              style={{ border: `1.5px solid ${theme.accentGold}` }}
            >
              {config.cover.coverPhoto.startsWith("/images/minang-") ? (
                <div className="h-full w-full overflow-hidden rounded-full">
                  <MinangCoverArtwork
                    bgTop={theme.isLightBase ? theme.accentPrimary : theme.bgSticky}
                    bgBottom={theme.isLightBase ? "#2A080C" : theme.bgPrimary}
                    gold={theme.accentGold}
                    goldLight={theme.accentGoldLight}
                  />
                </div>
              ) : (
                <img
                  src={config.cover.coverPhoto}
                  alt={coupleTitle}
                  className="h-full w-full rounded-full object-cover"
                />
              )}
            </div>
          ) : null}

          <p
            className="mt-4 font-script text-2xl"
            style={{ color: theme.accentGoldLight }}
          >
            {config.cover.title || "The Wedding of"}
          </p>

          <h1
            className="mt-1 font-serif text-4xl font-semibold tracking-wide"
            style={{
              color: theme.isLightBase
                ? theme.textOnCard
                : theme.textOnPrimary,
            }}
          >
            {coupleTitle}
          </h1>

          <p
            className="mt-1.5 text-xs tracking-[0.2em] uppercase font-display"
            style={{ color: theme.accentGold }}
          >
            {config.cover.dateDisplay}
          </p>

          <PucuakRabuangDividerSVG
            color={theme.accentGold}
            className="my-4 h-6 w-56"
          />

          {/* Guest Personalization Box */}
          <div
            className="w-full rounded-lg px-4 py-3"
            style={{
              border: `1px solid ${theme.accentGold}4D`,
              backgroundColor: theme.isLightBase
                ? `${theme.accentPrimary}0D`
                : "rgba(255, 255, 255, 0.04)",
            }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.18em]"
              style={{
                color: theme.isLightBase
                  ? theme.textOnCardMuted
                  : theme.textOnPrimaryMuted,
              }}
            >
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <p
              className="mt-1 font-serif text-xl font-semibold"
              style={{
                color: theme.isLightBase
                  ? theme.textOnCard
                  : theme.textOnPrimary,
              }}
            >
              {guestName}
            </p>
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="mt-6 inline-flex items-center gap-2.5 rounded-full px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] shadow-lg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${theme.accentGoldLight} 0%, ${theme.accentGold} 55%, ${theme.accentGoldDark} 100%)`,
              color: "#1B1110",
            }}
          >
            <MailOpen className="h-4 w-4" strokeWidth={1.75} />
            Buka Undangan
          </button>
        </div>
      </div>
    </motion.div>
  );
}
