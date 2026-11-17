"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import {
  Calendar,
  Edit3,
  Gift,
  Heart,
  Image as ImageIcon,
  Music,
  Palette,
  Pause,
  Users,
} from "lucide-react";
import defaultWishes from "@/data/wishes.json";
import { MINANG_THEMES, THEME_LIST } from "@/lib/themes";
import {
  DEFAULT_WEDDING_CONFIG,
  LOCAL_STORAGE_CONFIG_KEY,
  LOCAL_STORAGE_WISHES_KEY,
  getCoupleTitle,
  mergeWeddingConfig,
} from "@/lib/config-store";
import { MUSIC_TRACK_OPTIONS, MinangAudioPlayer } from "@/lib/audio";
import { MusicTrackId, ThemeId, WeddingConfig, WishItem } from "@/types/wedding";
import {
  GonjongRoofSVG,
  PayuangKuniangSVG,
  PucuakRabuangDividerSVG,
  SongketPatternOverlay,
} from "@/components/ornaments/MinangOrnaments";
import { RumahGadangAnimatedScene } from "@/components/ornaments/RumahGadangAnimatedScene";
import { CoverGate } from "./CoverGate";
import { InvitationSections, StudioTabKey } from "./InvitationSections";

interface InvitationViewProps {
  initialConfig?: WeddingConfig;
  initialGuestName?: string;
  initialGuestCode?: string;
  initialGuestMode?: boolean;
  overrideConfig?: WeddingConfig;
  onThemeQuickChange?: (themeId: ThemeId) => void;
  forceOpened?: boolean;
  isEmbeddedPreview?: boolean;
  forceMobileLayout?: boolean;
  showEditBadges?: boolean;
  onEditSection?: (tab: StudioTabKey) => void;
}

export function InvitationView({
  initialConfig = DEFAULT_WEDDING_CONFIG,
  initialGuestName,
  initialGuestCode,
  initialGuestMode = false,
  overrideConfig,
  onThemeQuickChange,
  forceOpened = false,
  isEmbeddedPreview = false,
  forceMobileLayout = false,
  showEditBadges = false,
  onEditSection,
}: InvitationViewProps) {
  const [config, setConfig] = useState<WeddingConfig>(initialConfig);
  const [guestName, setGuestName] = useState<string>(
    initialGuestName || initialConfig.cover.defaultGuestName
  );
  const [guestCode, setGuestCode] = useState<string | undefined>(
    initialGuestCode
  );
  const [isGuestShareMode, setIsGuestShareMode] = useState(initialGuestMode);
  const [isOpened, setIsOpened] = useState(forceOpened);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showThemeDrawer, setShowThemeDrawer] = useState(false);
  const [showMusicDrawer, setShowMusicDrawer] = useState(false);
  const [wishes, setWishes] = useState<WishItem[]>(defaultWishes as WishItem[]);

  const audioRef = useRef<MinangAudioPlayer | null>(null);

  // Use overrideConfig directly when controlled by StudioEditor
  const activeConfig = overrideConfig || config;
  const theme = useMemo(
    () => MINANG_THEMES[activeConfig.themeId] || MINANG_THEMES["sirah-gadang"],
    [activeConfig.themeId]
  );

  // Load config & query params on mount (when not controlled by Studio)
  useEffect(() => {
    if (overrideConfig) return;

    let mounted = true;
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get("to") || params.get("tamu");
    const codeParam = params.get("code") || params.get("qr");
    const themeParam = params.get("theme") as ThemeId | null;
    const guestModeParam = params.get("guest");

    if (toParam) {
      setGuestName(toParam);
    }
    if (codeParam) {
      setGuestCode(codeParam);
    }
    if (guestModeParam === "1" || guestModeParam === "true") {
      setIsGuestShareMode(true);
    }

    const loadInitial = async () => {
      let resolved = initialConfig;
      try {
        const res = await fetch("/api/config", { cache: "no-store" });
        if (res.ok) {
          const serverData = await res.json();
          resolved = mergeWeddingConfig(serverData);
        }
      } catch {
        // fallback to initialConfig
      }

      try {
        const localRaw = window.localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
        if (localRaw) {
          const parsedLocal = JSON.parse(localRaw);
          resolved = mergeWeddingConfig(parsedLocal);
        }
      } catch {
        // ignore localStorage errors
      }

      if (themeParam && MINANG_THEMES[themeParam]) {
        resolved = { ...resolved, themeId: themeParam };
      }

      if (mounted) {
        setConfig(resolved);
        if (!toParam && !initialGuestName) {
          setGuestName(resolved.cover.defaultGuestName);
        }
      }
    };

    void loadInitial();
    return () => {
      mounted = false;
    };
  }, [initialConfig, initialGuestName, overrideConfig]);

  // Load wishes on mount
  useEffect(() => {
    let mounted = true;
    const loadWishes = async () => {
      let serverWishes: WishItem[] = defaultWishes as WishItem[];
      try {
        const res = await fetch("/api/wishes", { cache: "no-store" });
        if (res.ok) {
          serverWishes = (await res.json()) as WishItem[];
        }
      } catch {
        // ignore
      }

      try {
        const localRaw = window.localStorage.getItem(LOCAL_STORAGE_WISHES_KEY);
        if (localRaw) {
          const localWishes = JSON.parse(localRaw) as WishItem[];
          const seen = new Set(serverWishes.map((w) => w.id));
          const merged = [
            ...localWishes.filter((w) => !seen.has(w.id)),
            ...serverWishes,
          ];
          if (mounted) setWishes(merged);
          return;
        }
      } catch {
        // ignore
      }

      if (mounted) setWishes(serverWishes);
    };
    void loadWishes();
    return () => {
      mounted = false;
    };
  }, []);

  // Configure audio engine
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new MinangAudioPlayer();
    }
    audioRef.current.configure(
      activeConfig.music.trackId,
      activeConfig.music.customAudioUrl
    );
    if (!activeConfig.music.enabled && audioRef.current.isPlaying()) {
      audioRef.current.stop();
      setIsPlaying(false);
    }
  }, [
    activeConfig.music.enabled,
    activeConfig.music.trackId,
    activeConfig.music.customAudioUrl,
  ]);

  useEffect(() => {
    return () => {
      audioRef.current?.stop();
    };
  }, []);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    if (activeConfig.music.enabled && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleToggleMusic = () => {
    if (!audioRef.current) return;
    const nextState = audioRef.current.toggle();
    setIsPlaying(nextState);
  };

  const handleSelectTheme = (nextThemeId: ThemeId) => {
    if (onThemeQuickChange) {
      onThemeQuickChange(nextThemeId);
      return;
    }
    const nextConfig = { ...activeConfig, themeId: nextThemeId };
    setConfig(nextConfig);
    try {
      window.localStorage.setItem(
        LOCAL_STORAGE_CONFIG_KEY,
        JSON.stringify(nextConfig)
      );
    } catch {
      // ignore
    }
  };

  const handleSelectMusicTrack = (trackId: MusicTrackId) => {
    const nextConfig = {
      ...activeConfig,
      music: { ...activeConfig.music, enabled: true, trackId },
    };
    setConfig(nextConfig);
    if (audioRef.current) {
      audioRef.current.configure(trackId, activeConfig.music.customAudioUrl);
      if (!audioRef.current.isPlaying()) {
        audioRef.current.play();
      }
      setIsPlaying(true);
    }
  };

  const handleSubmitWish = async (payload: {
    name: string;
    attendance: "hadir" | "berhalangan" | "ragu";
    guestCount: number;
    message: string;
  }) => {
    let createdWish: WishItem = {
      id: `wish-${Date.now()}`,
      ...payload,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.wish) createdWish = data.wish;
      }
    } catch {
      // ignore network fallback
    }

    const updated = [createdWish, ...wishes];
    setWishes(updated);
    try {
      window.localStorage.setItem(
        LOCAL_STORAGE_WISHES_KEY,
        JSON.stringify(updated)
      );
    } catch {
      // ignore
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const coupleTitle = getCoupleTitle(activeConfig);

  return (
    <div
      className="relative min-h-screen w-full transition-colors duration-500"
      style={{ background: theme.bgPrimaryGradient }}
    >
      {/* Cover Gate (when not opened yet) */}
      <AnimatePresence>
        {!isOpened && !forceOpened ? (
          <CoverGate
            config={activeConfig}
            theme={theme}
            guestName={guestName}
            onOpen={handleOpenInvitation}
          />
        ) : null}
      </AnimatePresence>

      {/* Main Layout: Desktop Split-Screen + Mobile Right Column */}
      <div
        className={`relative flex min-h-screen w-full ${
          forceMobileLayout ? "justify-center" : "lg:flex-row"
        }`}
      >
        {/* LEFT STICKY SHOWCASE PANEL (Desktop Only) */}
        {!forceMobileLayout ? (
          <aside
            className="relative hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-1 lg:flex-col lg:items-center lg:justify-between lg:overflow-hidden lg:p-10"
            style={{
              backgroundColor: theme.bgSticky,
              borderRight: `1px solid ${theme.accentGold}44`,
            }}
          >
            {/* Atmospheric Songket & Cover Photo Backdrop */}
            {activeConfig.photoMode === "with-photo" &&
            activeConfig.cover.stickyPhoto ? (
              <div
                className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20 transition-all duration-700"
                style={{
                  backgroundImage: `url(${activeConfig.cover.stickyPhoto})`,
                }}
              />
            ) : null}

            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(circle at 50% 45%, transparent 15%, ${theme.bgSticky}E8 88%)`,
              }}
            />

            {/* Iconic Animated Rumah Gadang & Bukit Barisan Scenic Backdrop */}
            <RumahGadangAnimatedScene theme={theme} showPetals />

            <div className="pointer-events-none absolute inset-0">
              <SongketPatternOverlay
                color={theme.songketStroke}
                opacity={theme.songketOpacity * 0.85}
              />
            </div>

            {/* Top Studio & Theme Controls Bar (Desktop Showcase) */}
            {!isEmbeddedPreview && !isGuestShareMode ? (
              <div className="relative z-20 flex w-full items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-1.5 rounded-full bg-black/35 px-3 py-1.5 backdrop-blur-md border border-white/10">
                  <span className="mr-1 text-[10px] font-display uppercase tracking-[0.16em] text-white/75">
                    Versi Warna:
                  </span>
                  {THEME_LIST.map((t) => {
                    const active = t.id === theme.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectTheme(t.id)}
                        title={`${t.name} — ${t.tagline}`}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                          active
                            ? "bg-white/20 text-white ring-1 ring-[#E8CD93]"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <span
                          className="h-2.5 w-2.5 rounded-full border border-white/40"
                          style={{ backgroundColor: t.swatches[0] }}
                        />
                        <span className="hidden xl:inline">{t.name}</span>
                      </button>
                    );
                  })}
                </div>

                <Link
                  href="/studio"
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-lg transition hover:scale-[1.03]"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accentGoldLight} 0%, ${theme.accentGold} 100%)`,
                    color: "#1B1110",
                  }}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit Undangan (Studio)
                </Link>
              </div>
            ) : (
              <div />
            )}

            {/* Center Architectural Crest & Couple Showcase */}
            <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
              <div className="flex items-end justify-center gap-2">
                <PayuangKuniangSVG
                  color={theme.accentGold}
                  className="h-16 w-9 opacity-85"
                />
                <GonjongRoofSVG
                  color={theme.accentGold}
                  secondaryColor={theme.accentGoldLight}
                  className="h-auto w-60"
                />
                <PayuangKuniangSVG
                  color={theme.accentGold}
                  className="h-16 w-9 opacity-85"
                />
              </div>

              <p
                className="mt-6 font-display text-xs uppercase tracking-[0.32em]"
                style={{ color: theme.accentGold }}
              >
                {activeConfig.cover.subtitle}
              </p>

              <h1
                className="mt-2 font-serif text-5xl xl:text-6xl font-semibold tracking-wide"
                style={{ color: "#FBF5EA" }}
              >
                {coupleTitle}
              </h1>

              <PucuakRabuangDividerSVG
                color={theme.accentGold}
                className="my-5 h-7 w-64"
              />

              <p className="font-display text-xs uppercase tracking-[0.24em] text-[#DFC9A6]">
                {activeConfig.cover.dateDisplay}
              </p>

              {guestName ? (
                <div
                  className="mt-6 rounded-full px-6 py-2 text-xs backdrop-blur-sm"
                  style={{
                    border: `1px solid ${theme.accentGold}55`,
                    backgroundColor: "rgba(0, 0, 0, 0.28)",
                    color: "#FBF5EA",
                  }}
                >
                  Kepada Yth:{" "}
                  <span className="font-semibold text-[#E8CD93]">
                    {guestName}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Bottom Active Theme Metadata */}
            <div className="relative z-10 flex w-full items-center justify-between text-[11px] text-white/65">
              <span>
                Tema Aktif:{" "}
                <strong className="text-[#E8CD93]">{theme.name}</strong>
              </span>
              <span>Adat Minangkabau • Sumatera Barat</span>
            </div>
          </aside>
        ) : null}

        {/* RIGHT SCROLLABLE MOBILE-FIRST INVITATION COLUMN */}
        <main
          className={`relative mx-auto w-full ${
            forceMobileLayout ? "max-w-[420px]" : "lg:w-[460px] lg:shrink-0"
          } min-h-screen px-4 py-6 sm:px-5`}
        >
          {/* Background Iconic Rumah Gadang & Songket Texture for Column */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden opacity-45 lg:hidden">
            <RumahGadangAnimatedScene theme={theme} showPetals />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <SongketPatternOverlay
              color={theme.songketStroke}
              opacity={theme.songketOpacity}
            />
          </div>

          {/* Mobile / Quick Top Toolbar (Visible on mobile or embedded preview, hidden in guest-share mode) */}
          {!isGuestShareMode ? (
            <div
              className={`relative z-30 mb-4 flex items-center justify-between gap-2 ${
                !forceMobileLayout && !isEmbeddedPreview ? "lg:hidden" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setShowThemeDrawer((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold shadow-md backdrop-blur-md transition"
                style={{
                  backgroundColor: theme.isLightBase
                    ? "rgba(255,255,255,0.88)"
                    : "rgba(18,6,8,0.72)",
                  color: theme.isLightBase
                    ? theme.textOnCard
                    : theme.textOnPrimary,
                  border: `1px solid ${theme.accentGold}77`,
                }}
              >
                <Palette className="h-3.5 w-3.5" />
                4 Versi Warna
              </button>

              {!isEmbeddedPreview ? (
                <Link
                  href="/studio"
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold shadow-md transition"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accentGoldLight}, ${theme.accentGold})`,
                    color: "#1B1110",
                  }}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit di Studio
                </Link>
              ) : null}
            </div>
          ) : null}

          {/* Expandable Theme Version Picker on Mobile / Embedded Preview */}
          {showThemeDrawer && !isGuestShareMode ? (
            <div
              className="relative z-30 mb-4 grid grid-cols-2 gap-2 rounded-2xl p-3 shadow-xl backdrop-blur-md"
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.accentGold}`,
                color: theme.textOnCard,
              }}
            >
              {THEME_LIST.map((t) => {
                const active = t.id === theme.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      handleSelectTheme(t.id);
                      setShowThemeDrawer(false);
                    }}
                    className="flex items-center gap-2 rounded-xl p-2 text-left text-xs transition"
                    style={{
                      backgroundColor: active
                        ? `${theme.accentGold}2E`
                        : theme.cardBgAlt,
                      border: `1px solid ${
                        active ? theme.accentGold : "transparent"
                      }`,
                    }}
                  >
                    <span
                      className="h-5 w-5 shrink-0 rounded-full border border-black/20"
                      style={{ backgroundColor: t.swatches[0] }}
                    />
                    <span className="truncate font-semibold">{t.name}</span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {/* All Invitation Sections */}
          <div className="relative z-10">
            <InvitationSections
              config={activeConfig}
              theme={theme}
              guestName={guestName}
              guestCode={guestCode}
              wishes={wishes}
              onSubmitWish={handleSubmitWish}
              onEditSection={onEditSection}
              showEditBadges={showEditBadges}
            />
          </div>

          {/* Minang Instrument Quick Picker Drawer */}
          {showMusicDrawer ? (
            <div
              className={`${
                isEmbeddedPreview ? "sticky bottom-16" : "fixed bottom-20"
              } left-0 right-0 z-40 mx-auto max-w-[390px] rounded-2xl p-3.5 shadow-2xl backdrop-blur-md ${
                !isEmbeddedPreview && !forceMobileLayout
                  ? "lg:left-auto lg:right-8 lg:w-[396px]"
                  : ""
              }`}
              style={{
                backgroundColor: "rgba(22, 8, 10, 0.95)",
                border: `1px solid ${theme.accentGold}`,
                color: "#FBF5EA",
              }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="font-display text-[10px] font-bold uppercase tracking-[0.2em] text-[#E8CD93]">
                  Pilih Instrumen Musik Minang
                </span>
                <button
                  type="button"
                  onClick={() => setShowMusicDrawer(false)}
                  className="text-[11px] text-white/60 hover:text-white"
                >
                  Tutup
                </button>
              </div>
              <div className="space-y-1.5">
                {MUSIC_TRACK_OPTIONS.filter((t) => t.id !== "custom").map(
                  (track) => {
                    const active = activeConfig.music.trackId === track.id;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => {
                          handleSelectMusicTrack(track.id);
                          setShowMusicDrawer(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                          active
                            ? "bg-[#C8A25A]/25 border border-[#E8CD93]"
                            : "bg-white/5 hover:bg-white/10 border border-transparent"
                        }`}
                      >
                        <div>
                          <p className="font-semibold text-white">
                            {track.label}
                          </p>
                          <p className="text-[10px] text-[#E8CD93]/80">
                            {track.instrumentTag}
                          </p>
                        </div>
                        {active ? (
                          <span className="rounded-full bg-[#E8CD93] px-2 py-0.5 text-[9px] font-bold text-[#1B1110]">
                            Aktif
                          </span>
                        ) : null}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          ) : null}

          {/* Floating Music Toggle + Quick Navigation Dock */}
          <div
            className={`${
              isEmbeddedPreview ? "sticky bottom-3" : "fixed bottom-4"
            } left-0 right-0 z-40 mx-auto flex max-w-[390px] items-center justify-between gap-1.5 rounded-full px-3 py-2 shadow-2xl backdrop-blur-md ${
              !isEmbeddedPreview && !forceMobileLayout
                ? "lg:left-auto lg:right-8 lg:w-[396px]"
                : ""
            }`}
            style={{
              backgroundColor: "rgba(22, 8, 10, 0.86)",
              border: `1px solid ${theme.accentGold}88`,
              color: "#FBF5EA",
            }}
          >
            <button
              type="button"
              onClick={() => scrollToSection("couple")}
              className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[9px] font-medium text-white/80 hover:text-[#E8CD93]"
            >
              <Users className="h-3.5 w-3.5" />
              Mempelai
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("events")}
              className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[9px] font-medium text-white/80 hover:text-[#E8CD93]"
            >
              <Calendar className="h-3.5 w-3.5" />
              Acara
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("gallery")}
              className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[9px] font-medium text-white/80 hover:text-[#E8CD93]"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Galeri
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("gifts")}
              className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[9px] font-medium text-white/80 hover:text-[#E8CD93]"
            >
              <Gift className="h-3.5 w-3.5" />
              Hadiah
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("wishes")}
              className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[9px] font-medium text-white/80 hover:text-[#E8CD93]"
            >
              <Heart className="h-3.5 w-3.5" />
              Ucapan
            </button>

            {activeConfig.music.enabled ? (
              <div className="ml-1 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowMusicDrawer((prev) => !prev)}
                  title="Ganti Instrumen Musik Minang"
                  className="hidden sm:inline-flex items-center rounded-full border border-[#E8CD93]/40 bg-white/10 px-2 py-1 text-[9px] font-semibold text-[#E8CD93] hover:bg-white/20"
                >
                  Instrumen
                </button>
                <button
                  type="button"
                  onClick={handleToggleMusic}
                  aria-label={isPlaying ? "Matikan Musik" : "Putar Musik"}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-md transition ${
                    isPlaying ? "animate-spin-slow" : ""
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${theme.accentGoldLight}, ${theme.accentGold})`,
                    color: "#1B1110",
                  }}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Music className="h-4 w-4" />
                  )}
                </button>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
