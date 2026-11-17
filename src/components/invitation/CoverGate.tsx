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
import {
  ForegroundRumahGadangOverlay,
  HangingMinangValance,
  RumahGadangGoldCrownSVG,
} from "@/components/ornaments/Minang3DElements";
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
      initial={{ opacity: 1, y: 0, scale: 1 }}
      exit={{
        y: "-100%",
        scale: 1.04,
        opacity: 0,
        transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
      }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      style={{ background: theme.bgPrimaryGradient }}
    >
      {/* Iconic Animated Rumah Gadang Scenic Backdrop with Butterflies & Autumn Trees */}
      <RumahGadangAnimatedScene theme={theme} showPetals />

      {/* Full-screen Songket textile weave overlay */}
      <div className="pointer-events-none absolute inset-0">
        <SongketPatternOverlay
          color={theme.songketStroke}
          opacity={theme.songketOpacity * 0.9}
        />
      </div>

      {/* Top Hanging Geometric Gold Minang Pendants & Songket Pucuak Rabuang Valance */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 mx-auto max-w-[460px]">
        <HangingMinangValance theme={theme} />
      </div>

      {/* Subtle radial spotlight */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 42%, ${theme.accentGold}2A 0%, transparent 62%)`,
        }}
      />

      {/* Centered Invitation Gate Card with Songket Outer Frame & Arch Window */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{
          scale: 0.88,
          opacity: 0,
          y: -36,
          transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 mx-4 flex w-full max-w-[410px] flex-col items-center px-3 py-6 text-center"
      >
        {/* Outer Double Songket Arch Card Frame */}
        <div
          className="relative flex w-full flex-col items-center px-6 pb-8 pt-6 shadow-[0_24px_60px_rgba(10,2,4,0.65)] backdrop-blur-md"
          style={{
            border: `2px solid ${theme.accentGold}`,
            backgroundColor: theme.isLightBase
              ? "rgba(252, 249, 243, 0.94)"
              : "rgba(20, 6, 9, 0.76)",
            borderRadius: "190px 190px 24px 24px",
          }}
        >
          {/* Inner Arch Hairline */}
          <div
            className="pointer-events-none absolute inset-2"
            style={{
              border: `1px solid ${theme.accentGold}66`,
              borderRadius: "182px 182px 18px 18px",
            }}
          />

          {/* Corner Ornaments at bottom */}
          <UkiranCornerSVG
            color={theme.accentGold}
            flipY
            className="pointer-events-none absolute bottom-3 left-3 h-8 w-8 opacity-80"
          />
          <UkiranCornerSVG
            color={theme.accentGold}
            flipX
            flipY
            className="pointer-events-none absolute bottom-3 right-3 h-8 w-8 opacity-80"
          />

          {/* Gold 5-Gonjong Rumah Gadang Emblem & Payuang Kuniang Crest */}
          <div className="relative z-10 mt-1 flex items-end justify-center gap-1">
            <PayuangKuniangSVG
              color={theme.accentGold}
              className="-mr-2 h-11 w-6 opacity-90"
            />
            <RumahGadangGoldCrownSVG
              theme={theme}
              className="h-12 w-28"
            />
            <PayuangKuniangSVG
              color={theme.accentGold}
              className="-ml-2 h-11 w-6 opacity-90"
            />
          </div>

          <p
            className="mt-2 font-display text-[9px] uppercase tracking-[0.28em]"
            style={{ color: theme.accentGold }}
          >
            {config.cover.subtitle || "Maimbau Baralek Gadang"}
          </p>

          {/* Arched Cover Portrait Preview (MP4 #3 00:00 framed window look) */}
          {config.photoMode === "with-photo" && config.cover.coverPhoto ? (
            <div
              className="mt-3 p-1 shadow-lg"
              style={{
                borderRadius: "72px 72px 12px 12px",
                border: `1.5px solid ${theme.accentGold}`,
                background: `linear-gradient(135deg, ${theme.accentGoldLight}44, ${theme.accentGoldDark}44)`,
              }}
            >
              <div
                className="h-32 w-28 overflow-hidden"
                style={{
                  borderRadius: "66px 66px 8px 8px",
                  backgroundColor: theme.bgSticky,
                }}
              >
                {config.cover.coverPhoto.startsWith("/images/minang-") ? (
                  <MinangCoverArtwork
                    bgTop={theme.isLightBase ? theme.accentPrimary : theme.bgSticky}
                    bgBottom={theme.isLightBase ? "#2A080C" : theme.bgPrimary}
                    gold={theme.accentGold}
                    goldLight={theme.accentGoldLight}
                  />
                ) : (
                  <img
                    src={config.cover.coverPhoto}
                    alt={coupleTitle}
                    className="h-full w-full object-cover object-top"
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="mt-2 flex items-center justify-center">
              <GonjongRoofSVG
                color={theme.accentGold}
                secondaryColor={theme.accentGoldLight}
                className="h-auto w-36"
              />
            </div>
          )}

          <p
            className="mt-3 font-script text-3xl leading-none"
            style={{ color: theme.accentGoldLight }}
          >
            {config.cover.title || "The Wedding of"}
          </p>

          <h1
            className="mt-1 font-serif text-3xl sm:text-4xl font-semibold tracking-wide"
            style={{
              color: theme.isLightBase
                ? theme.textOnCard
                : theme.textOnPrimary,
            }}
          >
            {coupleTitle}
          </h1>

          <p
            className="mt-1 text-[11px] uppercase tracking-[0.22em] font-display"
            style={{ color: theme.accentGold }}
          >
            {config.cover.dateDisplay}
          </p>

          <PucuakRabuangDividerSVG
            color={theme.accentGold}
            className="my-3 h-5 w-48"
          />

          {/* Guest Personalization Box */}
          <div
            className="w-full rounded-xl px-4 py-2.5"
            style={{
              border: `1px solid ${theme.accentGold}55`,
              backgroundColor: theme.isLightBase
                ? `${theme.accentPrimary}0E`
                : "rgba(255, 255, 255, 0.05)",
            }}
          >
            <p
              className="text-[10px] uppercase tracking-[0.18em]"
              style={{
                color: theme.isLightBase
                  ? theme.textOnCardMuted
                  : theme.textOnPrimaryMuted,
              }}
            >
              Kepada Yth. Bapak/Ibu/Saudara/i
            </p>
            <p
              className="mt-0.5 font-serif text-lg font-semibold"
              style={{
                color: theme.isLightBase
                  ? theme.textOnCard
                  : theme.textOnPrimary,
              }}
            >
              {guestName}
            </p>
            <p
              className="text-[10px]"
              style={{
                color: theme.isLightBase
                  ? theme.textOnCardMuted
                  : theme.textOnPrimaryMuted,
              }}
            >
              Di Tempat
            </p>
          </div>

          <button
            type="button"
            onClick={onOpen}
            className="mt-5 inline-flex items-center gap-2 rounded-full px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] shadow-[0_8px_20px_rgba(200,162,90,0.35)] transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
            style={{
              background: `linear-gradient(135deg, ${theme.accentGoldLight} 0%, ${theme.accentGold} 55%, ${theme.accentGoldDark} 100%)`,
              color: "#1B1110",
            }}
          >
            <MailOpen className="h-4 w-4" strokeWidth={1.8} />
            Buka Undangan
          </button>
        </div>
      </motion.div>

      {/* Bottom Foreground Carved 5-Gonjong Rumah Gadang & Botanical Roses (MP4 #1/#2/#3 Signature) */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-10 mx-auto h-32 max-w-[540px] opacity-95">
        <ForegroundRumahGadangOverlay theme={theme} className="h-full w-full" />
      </div>
    </motion.div>
  );
}
