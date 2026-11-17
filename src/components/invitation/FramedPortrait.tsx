"use client";

import React from "react";
import { FrameStyle, PhotoMode } from "@/types/wedding";
import { MinangThemePalette } from "@/lib/themes";
import {
  CoupleSiluetMinangSVG,
  GonjongRoofSVG,
  MinangBrideArtwork,
  MinangCoverArtwork,
  MinangGroomArtwork,
  UkiranCornerSVG,
} from "@/components/ornaments/MinangOrnaments";

interface FramedPortraitProps {
  src: string;
  alt: string;
  frameStyle: FrameStyle;
  photoMode: PhotoMode;
  theme: MinangThemePalette;
  variant?: "cover" | "bride" | "groom";
  className?: string;
}

export function FramedPortrait({
  src,
  alt,
  frameStyle,
  photoMode,
  theme,
  variant = "bride",
  className = "",
}: FramedPortraitProps) {
  const isDefaultMinangPlaceholder =
    !src || src.startsWith("/images/minang-");

  const renderInnerVisual = () => {
    if (photoMode === "illustration" && variant === "cover") {
      return (
        <div
          className="flex h-full w-full items-center justify-center p-4"
          style={{ backgroundColor: theme.bgSticky }}
        >
          <CoupleSiluetMinangSVG
            color={theme.accentGoldLight}
            accent={theme.cardBg}
            className="w-40 h-auto"
          />
        </div>
      );
    }

    if (photoMode === "illustration" || isDefaultMinangPlaceholder) {
      const bgTop = theme.isLightBase ? theme.accentPrimary : theme.bgSticky;
      const bgBottom = theme.isLightBase ? "#2A080C" : theme.bgPrimary;

      if (variant === "bride") {
        return (
          <MinangBrideArtwork
            bgTop={bgTop}
            bgBottom={bgBottom}
            gold={theme.accentGold}
            goldLight={theme.accentGoldLight}
          />
        );
      }
      if (variant === "groom") {
        return (
          <MinangGroomArtwork
            bgTop={bgTop}
            bgBottom={bgBottom}
            gold={theme.accentGold}
            goldLight={theme.accentGoldLight}
          />
        );
      }
      return (
        <MinangCoverArtwork
          bgTop={bgTop}
          bgBottom={bgBottom}
          gold={theme.accentGold}
          goldLight={theme.accentGoldLight}
        />
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover object-top"
      />
    );
  };

  if (frameStyle === "oval-ukiran") {
    return (
      <div className={`relative mx-auto flex flex-col items-center ${className}`}>
        <div
          className="relative p-2.5 shadow-xl"
          style={{
            borderRadius: "9999px",
            border: `1.5px solid ${theme.accentGold}`,
            background: `linear-gradient(145deg, ${theme.accentGold}24, transparent)`,
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              width: "196px",
              height: "248px",
              borderRadius: "9999px",
              border: `1px solid ${theme.accentGoldLight}80`,
              backgroundColor: theme.bgSticky,
            }}
          >
            {renderInnerVisual()}
          </div>
        </div>
      </div>
    );
  }

  if (frameStyle === "songket-royal") {
    return (
      <div className={`relative mx-auto w-56 ${className}`}>
        <div
          className="relative p-3"
          style={{
            border: `1.5px solid ${theme.accentGold}`,
            backgroundColor: `${theme.bgSticky}E6`,
          }}
        >
          <UkiranCornerSVG
            color={theme.accentGoldLight}
            className="pointer-events-none absolute left-1 top-1 h-8 w-8 z-10"
          />
          <UkiranCornerSVG
            color={theme.accentGoldLight}
            flipX
            className="pointer-events-none absolute right-1 top-1 h-8 w-8 z-10"
          />
          <UkiranCornerSVG
            color={theme.accentGoldLight}
            flipY
            className="pointer-events-none absolute bottom-1 left-1 h-8 w-8 z-10"
          />
          <UkiranCornerSVG
            color={theme.accentGoldLight}
            flipX
            flipY
            className="pointer-events-none absolute bottom-1 right-1 h-8 w-8 z-10"
          />
          <div
            className="relative aspect-[3/4] w-full overflow-hidden"
            style={{ border: `1px solid ${theme.accentGold}66` }}
          >
            {renderInnerVisual()}
          </div>
        </div>
      </div>
    );
  }

  // Default: 'gonjong-arch'
  return (
    <div className={`relative mx-auto flex flex-col items-center ${className}`}>
      <GonjongRoofSVG
        color={theme.accentGold}
        secondaryColor={theme.accentGoldLight}
        className="-mb-2 w-44 h-auto z-10"
      />
      <div
        className="relative p-2 shadow-xl"
        style={{
          borderTopLeftRadius: "110px",
          borderTopRightRadius: "110px",
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          border: `1.5px solid ${theme.accentGold}`,
          background: `linear-gradient(180deg, ${theme.accentGold}22 0%, ${theme.bgSticky}90 100%)`,
        }}
      >
        <div
          className="relative overflow-hidden"
          style={{
            width: "200px",
            height: "252px",
            borderTopLeftRadius: "102px",
            borderTopRightRadius: "102px",
            borderBottomLeftRadius: "4px",
            borderBottomRightRadius: "4px",
            border: `1px solid ${theme.accentGoldLight}70`,
            backgroundColor: theme.bgSticky,
          }}
        >
          {renderInnerVisual()}
        </div>
      </div>
    </div>
  );
}
