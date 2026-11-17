"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarPlus,
  Check,
  Clock,
  Copy,
  Edit3,
  ExternalLink,
  Gift,
  Heart,
  Instagram,
  MapPin,
  Radio,
  Send,
  Shirt,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { WeddingConfig, WishItem } from "@/types/wedding";
import { MinangThemePalette } from "@/lib/themes";
import {
  buildGoogleCalendarUrl,
  formatIndonesianDate,
  getCoupleOrder,
  getCoupleTitle,
} from "@/lib/config-store";
import {
  CaranoIconSVG,
  PayuangKuniangSVG,
  PucuakRabuangDividerSVG,
  SuntiangCrownSVG,
  UkiranCornerSVG,
} from "@/components/ornaments/MinangOrnaments";
import {
  Floating3DWeddingRings,
  FlutteringButterflies,
  InterlockingBotanicalMonogram,
  Minang25DBorderFrame,
  MinangCardFloralWings,
  Reveal3D,
  RumahGadangGoldCrownSVG,
} from "@/components/ornaments/Minang3DElements";
import {
  FramedPortrait,
} from "./FramedPortrait";
import { CountdownCard } from "./CountdownCard";
import { Location3DMap } from "./Location3DMap";
import {
  GuestQrPass,
  deriveDeterministicGuestCode,
} from "./GuestQrPass";
import { DirectTransferPanel } from "./DirectTransferPanel";

export type StudioTabKey =
  | "tema"
  | "mempelai"
  | "acara"
  | "foto"
  | "cerita"
  | "busana"
  | "hadiah"
  | "tamu"
  | "database"
  | "transfer";

interface InvitationSectionsProps {
  config: WeddingConfig;
  theme: MinangThemePalette;
  guestName?: string;
  guestCode?: string;
  wishes: WishItem[];
  onSubmitWish: (wish: {
    name: string;
    attendance: "hadir" | "berhalangan" | "ragu";
    guestCount: number;
    message: string;
  }) => Promise<void>;
  onEditSection?: (tab: StudioTabKey) => void;
  showEditBadges?: boolean;
}

function EditorialCard({
  id,
  theme,
  children,
  editTab,
  editLabel,
  onEditSection,
  showEditBadges,
  className = "",
}: {
  id?: string;
  theme: MinangThemePalette;
  children: React.ReactNode;
  editTab?: StudioTabKey;
  editLabel?: string;
  onEditSection?: (tab: StudioTabKey) => void;
  showEditBadges?: boolean;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 42, scale: 0.92, rotateX: 11 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: false, amount: 0.01 }}
      transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
      style={{
        backgroundColor: theme.cardBg,
        border: `1px solid ${theme.cardBorder}`,
        color: theme.textOnCard,
        transformPerspective: 1000,
      }}
      className={`relative overflow-hidden rounded-2xl px-6 py-8 shadow-xl ${
        theme.isLightBase ? "" : "paper-grain"
      } ${className}`}
    >
      {/* Swaying White Orchids, Golden Tree Branches & Crimson Leaf Wings */}
      <MinangCardFloralWings theme={theme} />

      {/* Inner recessed archival hairline */}
      <div
        className="pointer-events-none absolute inset-2.5 rounded-xl"
        style={{ border: `1px solid ${theme.accentGold}3D` }}
      />

      {/* Kaluak Paku corner ornaments */}
      <UkiranCornerSVG
        color={theme.accentGold}
        className="pointer-events-none absolute left-2 top-2 h-8 w-8 opacity-75"
      />
      <UkiranCornerSVG
        color={theme.accentGold}
        flipX
        className="pointer-events-none absolute right-2 top-2 h-8 w-8 opacity-75"
      />
      <UkiranCornerSVG
        color={theme.accentGold}
        flipY
        className="pointer-events-none absolute bottom-2 left-2 h-8 w-8 opacity-75"
      />
      <UkiranCornerSVG
        color={theme.accentGold}
        flipX
        flipY
        className="pointer-events-none absolute bottom-2 right-2 h-8 w-8 opacity-75"
      />

      {showEditBadges && editTab && onEditSection ? (
        <button
          type="button"
          onClick={() => onEditSection(editTab)}
          className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold shadow-md transition hover:scale-105"
          style={{
            backgroundColor: theme.accentPrimary,
            color: theme.accentPrimaryText,
            border: `1px solid ${theme.accentGold}`,
          }}
        >
          <Edit3 className="h-3 w-3" />
          {editLabel || "Edit"}
        </button>
      ) : null}

      <div className="relative z-10">{children}</div>
    </motion.section>
  );
}

/**
 * Luxury Double-Ended Pill/Stadium Arch Card crowned with 5-Gonjong Gold Rumah Gadang
 * & Crimson-Gold Songket Halo Ring (inspired by @GALERIUNDANGAN_OFFICIAL MP4 #2 & #3).
 */
function PillArchCard({
  id,
  theme,
  children,
  editTab,
  editLabel,
  onEditSection,
  showEditBadges,
  showCrown = true,
  radiusClass = "rounded-[108px]",
  innerRadiusClass = "rounded-[98px]",
  className = "",
}: {
  id?: string;
  theme: MinangThemePalette;
  children: React.ReactNode;
  editTab?: StudioTabKey;
  editLabel?: string;
  onEditSection?: (tab: StudioTabKey) => void;
  showEditBadges?: boolean;
  showCrown?: boolean;
  radiusClass?: string;
  innerRadiusClass?: string;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 44, scale: 0.9, rotateX: 12 }}
      whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      viewport={{ once: false, amount: 0.01 }}
      transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: `linear-gradient(180deg, ${theme.cardBg} 0%, ${theme.cardBgAlt} 100%)`,
        border: `2px solid ${theme.accentGold}`,
        color: theme.textOnCard,
        boxShadow:
          "0 22px 48px rgba(18, 4, 7, 0.38), inset 0 0 0 6px rgba(125, 22, 32, 0.08)",
        transformPerspective: 1000,
      }}
      className={`relative overflow-hidden ${radiusClass} px-6 py-12 shadow-2xl ${className}`}
    >
      {/* Swaying Orchids & Floral Botanical Wings */}
      <MinangCardFloralWings theme={theme} />

      {/* Outer Songket Floral Halo Border Ring */}
      <div
        className={`pointer-events-none absolute inset-2.5 ${innerRadiusClass}`}
        style={{
          border: `1.5px dashed ${theme.accentGold}88`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-4 rounded-[110px]"
        style={{
          border: `1px solid ${theme.accentPrimary}33`,
        }}
      />

      {showEditBadges && editTab && onEditSection ? (
        <button
          type="button"
          onClick={() => onEditSection(editTab)}
          className="absolute right-8 top-8 z-20 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold shadow-md transition hover:scale-105"
          style={{
            backgroundColor: theme.accentPrimary,
            color: theme.accentPrimaryText,
            border: `1px solid ${theme.accentGold}`,
          }}
        >
          <Edit3 className="h-3 w-3" />
          {editLabel || "Edit"}
        </button>
      ) : null}

      <div className="relative z-10">
        {showCrown ? (
          <div className="mb-3 flex justify-center">
            <RumahGadangGoldCrownSVG theme={theme} className="h-12 w-28" />
          </div>
        ) : null}
        {children}
      </div>
    </motion.section>
  );
}

export function InvitationSections({
  config,
  theme,
  guestName = "Tamu Kehormatan",
  guestCode,
  wishes,
  onSubmitWish,
  onEditSection,
  showEditBadges = false,
}: InvitationSectionsProps) {
  const { first, second, firstIsBride } = getCoupleOrder(config);
  const coupleTitle = getCoupleTitle(config);
  const resolvedGuestCode = deriveDeterministicGuestCode(guestName, guestCode);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dressTab, setDressTab] = useState<"wanita" | "pria">("wanita");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxCaption, setLightboxCaption] = useState<string>("");

  // RSVP form state
  const [wishName, setWishName] = useState("");
  const [wishAttendance, setWishAttendance] = useState<
    "hadir" | "berhalangan" | "ragu"
  >("hadir");
  const [wishGuestCount, setWishGuestCount] = useState(2);
  const [wishMessage, setWishMessage] = useState("");
  const [wishSubmitting, setWishSubmitting] = useState(false);
  const [wishSuccess, setWishSuccess] = useState(false);

  const copyText = (text: string, key: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishMessage.trim()) return;
    setWishSubmitting(true);
    try {
      await onSubmitWish({
        name: wishName.trim(),
        attendance: wishAttendance,
        guestCount: wishGuestCount,
        message: wishMessage.trim(),
      });
      setWishName("");
      setWishMessage("");
      setWishSuccess(true);
      setTimeout(() => setWishSuccess(false), 3500);
    } finally {
      setWishSubmitting(false);
    }
  };

  const activeEvents = config.events.filter((ev) => ev.enabled);

  return (
    <div className="space-y-7 pb-48">
      {/* 1. HERO SECTION — Arch Window, Fluttering Butterflies, Suntiang & Monogram */}
      <motion.section
        id="hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-t-[170px] rounded-b-3xl px-6 pb-11 pt-12 text-center shadow-2xl"
        style={{
          background: theme.isLightBase
            ? `linear-gradient(180deg, ${theme.cardBg} 0%, ${theme.cardBgAlt} 100%)`
            : `radial-gradient(circle at 50% 35%, ${theme.accentPrimary}CC 0%, rgba(20, 5, 8, 0.86) 100%)`,
          border: `1.5px solid ${theme.accentGold}99`,
          color: theme.isLightBase ? theme.textOnCard : theme.textOnPrimary,
        }}
      >
        {showEditBadges && onEditSection ? (
          <button
            type="button"
            onClick={() => onEditSection("foto")}
            className="absolute right-6 top-8 z-20 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold shadow-md transition hover:scale-105"
            style={{
              backgroundColor: theme.accentPrimary,
              color: theme.accentPrimaryText,
              border: `1px solid ${theme.accentGold}`,
            }}
          >
            <Edit3 className="h-3 w-3" />
            Edit Sampul
          </button>
        ) : null}

        {/* 2.5D Ornate Minang Lattice Side Borders, Swaying Golden Trees, White Orchids & Scroll Cue */}
        <Minang25DBorderFrame theme={theme} showScrollCue />

        {/* Animated Crimson-Gold Butterflies inside Hero (MP4 #3 00:05-00:08) */}
        <FlutteringButterflies theme={theme} />

        {/* Suntiang Crest & 2.5D Interlocking Botanical Monogram */}
        <div className="relative z-10 flex flex-col items-center">
          <SuntiangCrownSVG
            color={theme.accentGold}
            className="w-24 h-auto opacity-95"
          />
          <InterlockingBotanicalMonogram
            firstInitial={(first.nickname || "Y").charAt(0).toUpperCase()}
            secondInitial={(second.nickname || "N").charAt(0).toUpperCase()}
            theme={theme}
            className="-mt-3"
          />
        </div>

        <p
          className="relative z-10 mt-4 font-display text-[10px] uppercase tracking-[0.28em]"
          style={{ color: theme.accentGold }}
        >
          {config.cover.subtitle}
        </p>

        <h2
          className="relative z-10 mt-2 font-serif text-4xl font-semibold tracking-wide"
          style={{
            color: theme.isLightBase ? theme.textOnCard : theme.textOnPrimary,
          }}
        >
          {coupleTitle}
        </h2>

        <p
          className="relative z-10 mt-1.5 text-xs uppercase tracking-[0.2em] font-display"
          style={{
            color: theme.isLightBase
              ? theme.textOnCardMuted
              : theme.textOnPrimaryMuted,
          }}
        >
          {config.cover.dateDisplay}
        </p>

        <div className="relative z-10 mt-6">
          <FramedPortrait
            src={config.cover.coverPhoto}
            alt={coupleTitle}
            frameStyle={config.frameStyle}
            photoMode={config.photoMode}
            theme={theme}
            variant="cover"
          />
        </div>

        <div className="relative z-10 mt-6 flex items-center justify-center gap-2">
          <PayuangKuniangSVG
            color={theme.accentGold}
            className="h-10 w-6 opacity-80"
          />
          <PucuakRabuangDividerSVG
            color={theme.accentGold}
            className="h-6 w-48"
          />
          <PayuangKuniangSVG
            color={theme.accentGold}
            className="h-10 w-6 opacity-80"
          />
        </div>
      </motion.section>

      {/* 2. PASAMBAHAN MINANG */}
      <EditorialCard
        id="pasambahan"
        theme={theme}
        editTab="cerita"
        editLabel="Edit Teks"
        onEditSection={onEditSection}
        showEditBadges={showEditBadges}
      >
        <div className="flex flex-col items-center text-center">
          <CaranoIconSVG color={theme.accentGold} className="h-11 w-11" />
          <p
            className="mt-3 text-xl font-medium"
            style={{ color: theme.accentGoldDark }}
            dir="rtl"
          >
            {config.pasambahan.arabicBismillah}
          </p>

          <p
            className="mt-3 font-serif text-sm italic leading-relaxed"
            style={{ color: theme.textOnCardMuted }}
          >
            “{config.pasambahan.minangPantun}”
          </p>

          <PucuakRabuangDividerSVG
            color={theme.accentGold}
            className="my-4 h-6 w-52"
          />

          <p
            className="text-xs leading-relaxed"
            style={{ color: theme.textOnCard }}
          >
            {config.pasambahan.invitationIntro}
          </p>
        </div>
      </EditorialCard>

      {/* 3. PROFIL MEMPELAI — Crowned with 5-Gonjong Gold Rumah Gadang & We Are Getting Married (MP4 #2/#3) */}
      <PillArchCard
        id="couple"
        theme={theme}
        editTab="mempelai"
        editLabel="Edit Mempelai"
        onEditSection={onEditSection}
        showEditBadges={showEditBadges}
        radiusClass="rounded-[68px]"
        innerRadiusClass="rounded-[60px]"
      >
        <div className="text-center">
          <p
            className="font-script text-3xl leading-none"
            style={{ color: theme.accentPrimary }}
          >
            We Are Getting Married!
          </p>
          <p
            className="mt-1 font-display text-[10px] uppercase tracking-[0.26em]"
            style={{ color: theme.accentGoldDark }}
          >
            Anak Daro &amp; Marapulai
          </p>
          <h3 className="mt-1 font-serif text-3xl font-semibold">
            Mempelai Berbahagia
          </h3>
        </div>

        <div className="mt-7 space-y-7">
          {[first, second].map((person, idx) => {
            const isBride =
              (idx === 0 && firstIsBride) || (idx === 1 && !firstIsBride);
            return (
              <React.Fragment key={person.roleLabel + idx}>
                {idx === 1 && (
                  <div className="flex flex-col items-center justify-center gap-1 py-1">
                    <span
                      className="font-script text-4xl leading-none"
                      style={{ color: theme.accentGoldDark }}
                    >
                      &amp;
                    </span>
                    <Floating3DWeddingRings theme={theme} />
                  </div>
                )}

                <Reveal3D
                  variant={idx === 0 ? "slide-left-3d" : "slide-right-3d"}
                  className="flex flex-col items-center text-center"
                >
                  <span
                    className="mb-3 rounded-full px-3.5 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.22em]"
                    style={{
                      backgroundColor: `${theme.accentGold}20`,
                      color: theme.accentGoldDark,
                      border: `1px solid ${theme.accentGold}66`,
                    }}
                  >
                    {person.roleLabel}
                  </span>

                  <FramedPortrait
                    src={person.photo}
                    alt={person.fullName}
                    frameStyle={config.frameStyle}
                    photoMode={config.photoMode}
                    theme={theme}
                    variant={isBride ? "bride" : "groom"}
                  />

                  <h4
                    className="mt-4 font-script text-4xl leading-tight"
                    style={{ color: theme.accentPrimary }}
                  >
                    {person.nickname || person.fullName}
                  </h4>
                  <p className="mt-0.5 font-serif text-xl font-bold tracking-wide">
                    {person.fullName}
                  </p>

                  {person.showGala && person.gala ? (
                    <p
                      className="mt-1 font-serif text-sm italic font-medium"
                      style={{ color: theme.accentGoldDark }}
                    >
                      {person.gala}
                    </p>
                  ) : null}

                  <p
                    className="mt-2.5 text-xs"
                    style={{ color: theme.textOnCardMuted }}
                  >
                    {person.childOrder}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold">
                    {person.fatherName}
                  </p>
                  <p className="text-xs font-semibold">&amp; {person.motherName}</p>

                  {person.suku ? (
                    <p
                      className="mt-1.5 text-[11px] uppercase tracking-[0.14em]"
                      style={{ color: theme.textOnCardMuted }}
                    >
                      {person.suku}
                    </p>
                  ) : null}

                  {person.instagram ? (
                    <a
                      href={`https://instagram.com/${person.instagram.replace(
                        /^@/,
                        ""
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-semibold shadow-sm transition hover:scale-105"
                      style={{
                        backgroundColor: theme.accentPrimary,
                        color: theme.accentPrimaryText,
                        border: `1px solid ${theme.accentGold}88`,
                      }}
                    >
                      <Instagram className="h-3 w-3" />
                      {person.instagram.startsWith("@")
                        ? person.instagram
                        : `@${person.instagram}`}
                    </a>
                  ) : null}
                </Reveal3D>
              </React.Fragment>
            );
          })}
        </div>
      </PillArchCard>

      {/* 4. COUNTDOWN MAROON PHOTO-OVERLAY BANNER & RANGKAIAN ACARA (MP4 #1/#2/#3) */}
      <motion.section
        id="countdown"
        initial={{ opacity: 0, y: 40, scale: 0.94, rotateX: 10 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        viewport={{ once: false, amount: 0.01 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: `linear-gradient(180deg, ${theme.accentPrimary} 0%, ${theme.bgSticky} 100%)`,
          border: `1.5px solid ${theme.accentGold}99`,
          color: "#FBF5EA",
          transformPerspective: 1000,
        }}
        className="relative overflow-hidden rounded-3xl px-5 pb-8 pt-6 text-center shadow-2xl"
      >
        <div
          className="pointer-events-none absolute inset-2.5 rounded-2xl"
          style={{ border: `1px solid ${theme.accentGold}44` }}
        />

        {/* Top Wide Framed Couple Photo Strip */}
        {config.photoMode === "with-photo" && config.cover.coverPhoto ? (
          <div
            className="relative mx-auto mb-5 h-32 w-full overflow-hidden rounded-t-[80px] rounded-b-xl shadow-lg"
            style={{
              border: `1.5px solid ${theme.accentGold}`,
              backgroundColor: theme.bgSticky,
            }}
          >
            {config.cover.coverPhoto.startsWith("/images/minang-") ? (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-[#4E1118] to-[#23060A]">
                <RumahGadangGoldCrownSVG theme={theme} className="h-20 w-44" />
              </div>
            ) : (
              <img
                src={config.cover.coverPhoto}
                alt={coupleTitle}
                className="h-full w-full object-cover object-center"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          </div>
        ) : null}

        <p
          className="font-script text-4xl leading-none"
          style={{ color: theme.accentGoldLight }}
        >
          Countdown
        </p>
        <p className="mt-1 font-display text-[10px] uppercase tracking-[0.26em] text-white/75">
          Menghitung Hari Menuju Momen Bahagia
        </p>

        <div className="relative z-10 mt-5">
          <CountdownCard targetDate={config.countdownDate} theme={theme} />
        </div>

        <PucuakRabuangDividerSVG
          color={theme.accentGold}
          className="mx-auto my-5 h-5 w-48 opacity-85"
        />

        <p className="text-xs italic leading-relaxed text-[#F5EAD7]/90">
          “{config.pasambahan.quoteText}”
        </p>
        <p
          className="mt-2 font-display text-[11px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: theme.accentGoldLight }}
        >
          {config.pasambahan.quoteSource}
        </p>

        <a
          href="#events"
          className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] shadow-lg transition hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${theme.accentGoldLight}, ${theme.accentGold})`,
            color: "#1B1110",
          }}
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          Save The Date
        </a>
      </motion.section>

      {/* 4B. WEDDING EVENT SECTION OVER ATMOSPHERIC BACKDROP WITH PILL-ARCH CARDS */}
      <section
        id="events"
        className="relative space-y-5 overflow-hidden rounded-3xl px-4 py-8 shadow-2xl"
        style={{
          backgroundColor: theme.isLightBase
            ? theme.cardBgAlt
            : "rgba(26, 7, 10, 0.72)",
          border: `1.5px solid ${theme.accentGold}77`,
        }}
      >
        {/* Subtle Prewedding / Couple Photo Atmosphere Backdrop behind Event Pills (MP4 #1/#3) */}
        {config.photoMode === "with-photo" &&
        config.cover.stickyPhoto &&
        !config.cover.stickyPhoto.startsWith("/images/minang-") ? (
          <div
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20 blur-[1px]"
            style={{ backgroundImage: `url(${config.cover.stickyPhoto})` }}
          />
        ) : null}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: theme.isLightBase
              ? `linear-gradient(180deg, ${theme.cardBg}E6 0%, ${theme.cardBgAlt}D9 100%)`
              : `linear-gradient(180deg, rgba(22,6,8,0.68) 0%, rgba(44,11,16,0.78) 100%)`,
          }}
        />

        {showEditBadges && onEditSection ? (
          <button
            type="button"
            onClick={() => onEditSection("acara")}
            className="relative z-20 mx-auto mb-2 flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-semibold shadow-md transition hover:scale-105"
            style={{
              backgroundColor: theme.accentPrimary,
              color: theme.accentPrimaryText,
              border: `1px solid ${theme.accentGold}`,
            }}
          >
            <Edit3 className="h-3 w-3" />
            Edit Acara
          </button>
        ) : null}

        <div className="relative z-10 text-center">
          <p
            className="font-script text-4xl leading-none"
            style={{
              color: theme.isLightBase
                ? theme.accentPrimary
                : theme.accentGoldLight,
            }}
          >
            Wedding Event
          </p>
          <h3
            className="mt-1 font-serif text-3xl font-semibold"
            style={{
              color: theme.isLightBase ? theme.textOnCard : "#FBF5EA",
            }}
          >
            Rangkaian Acara
          </h3>
          <p
            className="mt-1 text-xs"
            style={{
              color: theme.isLightBase
                ? theme.textOnCardMuted
                : "rgba(251,245,234,0.8)",
            }}
          >
            Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir
          </p>
        </div>

        <div className="relative z-10 space-y-6">
          {activeEvents.map((ev, evIdx) => (
            <PillArchCard
              key={ev.id}
              theme={theme}
              radiusClass="rounded-[88px] sm:rounded-[108px]"
              innerRadiusClass="rounded-[80px] sm:rounded-[98px]"
              className={`text-center ${evIdx % 2 === 0 ? "" : ""}`}
            >
              <p
                className="font-display text-[10px] uppercase tracking-[0.22em]"
                style={{ color: theme.accentGoldDark }}
              >
                {ev.subtitle}
              </p>
              <h4 className="mt-1 font-serif text-2xl font-bold uppercase tracking-wide">
                {ev.name}
              </h4>

              {/* Heart Emblem Divider (MP4 #2/#3 Pill Card Detail) */}
              <div className="my-2.5 flex items-center justify-center gap-2">
                <span
                  className="h-px w-10"
                  style={{ backgroundColor: `${theme.accentGold}77` }}
                />
                <Heart
                  className="h-3.5 w-3.5 fill-current"
                  style={{ color: theme.accentPrimary }}
                />
                <span
                  className="h-px w-10"
                  style={{ backgroundColor: `${theme.accentGold}77` }}
                />
              </div>

              <div
                className="mt-2 space-y-1 text-xs"
                style={{ color: theme.textOnCard }}
              >
                <p className="font-semibold">{formatIndonesianDate(ev.date)}</p>
                <p
                  className="inline-flex items-center justify-center gap-1.5"
                  style={{ color: theme.textOnCardMuted }}
                >
                  <Clock className="h-3.5 w-3.5" />
                  {ev.startTime} — {ev.endTime}
                </p>
              </div>

              <div
                className="mt-3 pt-3 text-xs"
                style={{ borderTop: `1px dashed ${theme.accentGold}55` }}
              >
                <p className="font-semibold">{ev.venueName}</p>
                <p
                  className="mt-0.5 leading-relaxed"
                  style={{ color: theme.textOnCardMuted }}
                >
                  {ev.address}
                </p>
                {ev.city ? (
                  <p
                    className="mt-0.5 font-medium"
                    style={{ color: theme.textOnCardMuted }}
                  >
                    {ev.city}
                  </p>
                ) : null}
              </div>

              {/* Embedded 3D & Interactive Live Map Directly Inside Website */}
              <Location3DMap event={ev} theme={theme} />

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <a
                  href={buildGoogleCalendarUrl(ev, coupleTitle)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold transition hover:opacity-85"
                  style={{
                    backgroundColor: theme.accentPrimary,
                    color: theme.accentPrimaryText,
                  }}
                >
                  <CalendarPlus className="h-3.5 w-3.5" />
                  Simpan ke Kalender
                </a>
                {ev.mapsUrl ? (
                  <a
                    href={ev.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold transition hover:opacity-90"
                    style={{
                      border: `1px solid ${theme.accentGold}`,
                      color: theme.textOnCard,
                    }}
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    Google Map
                  </a>
                ) : null}
              </div>
            </PillArchCard>
          ))}
        </div>

        {/* UNIQUE QR PASS PER GUEST */}
        <div className="relative z-10 mt-6 rounded-2xl bg-white/95 p-3 shadow-lg">
          <GuestQrPass
            guestName={guestName}
            guestCode={resolvedGuestCode}
            coupleTitle={coupleTitle}
            dateDisplay={config.cover.dateDisplay}
            theme={theme}
          />
        </div>
      </section>

      {/* 5. LOVE STORY TIMELINE WITH LEFT HEART NODES (MP4 #1/#2/#3) */}
      {config.loveStory.enabled && config.loveStory.items.length > 0 ? (
        <EditorialCard
          id="story"
          theme={theme}
          editTab="cerita"
          editLabel="Edit Cerita"
          onEditSection={onEditSection}
          showEditBadges={showEditBadges}
        >
          <div className="text-center">
            <p
              className="font-script text-3xl leading-none"
              style={{ color: theme.accentPrimary }}
            >
              Our Love Story
            </p>
            <h3 className="mt-1 font-serif text-3xl font-semibold">
              {config.loveStory.heading}
            </h3>
          </div>

          <div className="relative mt-7 space-y-5 pl-7">
            <div
              className="absolute bottom-2 left-2.5 top-2 w-0.5 rounded-full"
              style={{ backgroundColor: `${theme.accentGold}88` }}
            />
            {config.loveStory.items.map((item, idx) => (
              <Reveal3D
                key={item.id}
                variant={idx % 2 === 0 ? "zoom-up" : "slide-right-3d"}
                delay={idx * 0.08}
                className="relative"
              >
                {/* Heart Icon Node on Vertical Rail */}
                <span
                  className="absolute -left-[27px] top-3 flex h-5 w-5 items-center justify-center rounded-full shadow-sm"
                  style={{
                    backgroundColor: theme.cardBg,
                    border: `1.5px solid ${theme.accentGold}`,
                  }}
                >
                  <Heart
                    className="h-2.5 w-2.5 fill-current"
                    style={{ color: theme.accentPrimary }}
                  />
                </span>

                <div
                  className="rounded-t-2xl rounded-b-xl p-4 shadow-sm"
                  style={{
                    backgroundColor: theme.cardBgAlt,
                    border: `1px solid ${theme.accentGold}55`,
                  }}
                >
                  <p
                    className="font-display text-[10px] font-semibold uppercase tracking-[0.2em]"
                    style={{ color: theme.accentGoldDark }}
                  >
                    {item.year}
                  </p>
                  <h4 className="mt-0.5 font-serif text-lg font-bold">
                    {item.title}
                  </h4>
                  <p
                    className="mt-1 text-xs leading-relaxed"
                    style={{ color: theme.textOnCardMuted }}
                  >
                    {item.description}
                  </p>
                </div>
              </Reveal3D>
            ))}
          </div>
        </EditorialCard>
      ) : null}

      {/* 6. LIVE STREAMING 3-PANEL TRIPTYCH + GALERI 8 FOTO (4x2) */}
      {(config.gallery.enabled && config.gallery.photos.length > 0) ||
      config.liveStreaming.enabled ? (
        <EditorialCard
          id="gallery"
          theme={theme}
          editTab="foto"
          editLabel="Edit Galeri"
          onEditSection={onEditSection}
          showEditBadges={showEditBadges}
        >
          {config.liveStreaming.enabled ? (
            <Reveal3D
              variant="zoom-out"
              className="mb-7 overflow-hidden rounded-2xl p-5 text-center shadow-lg"
            >
              <div
                className="relative overflow-hidden rounded-2xl px-4 py-6 text-center"
                style={{
                  background: `linear-gradient(180deg, ${theme.accentPrimary} 0%, ${theme.bgSticky} 100%)`,
                  border: `1.5px solid ${theme.accentGold}`,
                  color: "#FBF5EA",
                }}
              >
                {/* 3-Panel Triptych Preview (MP4 #3 00:18-00:19 Live Streaming Showcase) */}
                <div className="mb-4 grid grid-cols-3 items-end gap-2 px-1">
                  {[
                    config.bride.photo,
                    config.cover.coverPhoto,
                    config.groom.photo,
                  ].map((panelSrc, pIdx) => (
                    <div
                      key={pIdx}
                      className={`overflow-hidden rounded-t-full rounded-b-lg border shadow-md ${
                        pIdx === 1 ? "aspect-[3/4] scale-105 z-10" : "aspect-[3/4] opacity-85"
                      }`}
                      style={{
                        borderColor: theme.accentGold,
                        backgroundColor: theme.bgSticky,
                      }}
                    >
                      {!panelSrc || panelSrc.startsWith("/images/minang-") ? (
                        <div className="flex h-full w-full items-center justify-center bg-[#320B10] p-2">
                          <RumahGadangGoldCrownSVG
                            theme={theme}
                            className="h-auto w-full opacity-90"
                          />
                        </div>
                      ) : (
                        <img
                          src={panelSrc}
                          alt={`Live Streaming Preview ${pIdx + 1}`}
                          className="h-full w-full object-cover object-top"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Radio className="h-4 w-4" style={{ color: theme.accentGoldLight }} />
                  <span
                    className="font-script text-3xl leading-none"
                    style={{ color: theme.accentGoldLight }}
                  >
                    Live Streaming
                  </span>
                </div>
                <p className="mt-1.5 font-serif text-lg font-semibold text-white">
                  {config.liveStreaming.platform}
                </p>
                <p className="mt-1 text-xs text-white/80">
                  {config.liveStreaming.scheduleNote}
                </p>
                <a
                  href={config.liveStreaming.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold transition hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${theme.accentGoldLight}, ${theme.accentGold})`,
                    color: "#1B1110",
                  }}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {config.liveStreaming.buttonLabel}
                </a>
              </div>
            </Reveal3D>
          ) : null}

          {config.gallery.enabled && config.gallery.photos.length > 0 ? (
            <>
              <div className="text-center">
                <p
                  className="font-script text-3xl leading-none"
                  style={{ color: theme.accentPrimary }}
                >
                  Galeri Foto
                </p>
                <h3 className="mt-1 font-serif text-3xl font-semibold">
                  {config.gallery.heading}
                </h3>
                <p
                  className="mt-1.5 text-xs"
                  style={{ color: theme.textOnCardMuted }}
                >
                  {config.gallery.subtitle}
                </p>
              </div>

              {/* 8-Photo Gallery Grid: STRICT 4 Columns x 2 Rows with Arch-Top Framing & Bidirectional 3D Scroll Reveal */}
              <div className="mt-5 grid grid-cols-4 gap-2">
                {config.gallery.photos.slice(0, 8).map((photo, index) => (
                  <motion.button
                    key={photo.id}
                    type="button"
                    initial={{
                      opacity: 0,
                      y: index < 4 ? -28 : 28,
                      rotateY: index % 2 === 0 ? -22 : 22,
                      scale: 0.86,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                      rotateY: 0,
                      scale: 1,
                    }}
                    viewport={{ once: false, amount: 0.02 }}
                    transition={{
                      duration: 0.65,
                      delay: (index % 4) * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={() => {
                      setLightboxUrl(photo.url);
                      setLightboxCaption(photo.caption);
                    }}
                    className="group relative aspect-[3/4] overflow-hidden rounded-t-[24px] rounded-b-lg text-left shadow-md transition hover:scale-[1.04]"
                    style={{
                      border: `1.5px solid ${theme.accentGold}88`,
                      backgroundColor: theme.bgSticky,
                      transformPerspective: 800,
                    }}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption || `Galeri ${index + 1}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />
                    {photo.caption ? (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-1.5">
                        <p className="truncate text-[8px] font-medium text-white/95">
                          {photo.caption}
                        </p>
                      </div>
                    ) : null}
                  </motion.button>
                ))}
              </div>
            </>
          ) : null}
        </EditorialCard>
      ) : null}

      {/* 7. DRESS CODE / PANDUAN BUSANA */}
      {config.dressCode.enabled ? (
        <EditorialCard
          id="dresscode"
          theme={theme}
          editTab="busana"
          editLabel="Edit Busana"
          onEditSection={onEditSection}
          showEditBadges={showEditBadges}
        >
          <div className="text-center">
            <div className="flex justify-center">
              <Shirt
                className="h-6 w-6"
                style={{ color: theme.accentGoldDark }}
                strokeWidth={1.5}
              />
            </div>
            <p
              className="mt-2 font-display text-[10px] uppercase tracking-[0.26em]"
              style={{ color: theme.accentGoldDark }}
            >
              Attire Guide
            </p>
            <h3 className="mt-1 font-serif text-3xl font-semibold">
              Panduan Busana
            </h3>
            <p
              className="mt-2 text-xs leading-relaxed"
              style={{ color: theme.textOnCardMuted }}
            >
              {config.dressCode.note}
            </p>
          </div>

          <div className="mt-5 flex justify-center gap-2">
            {(["wanita", "pria"] as const).map((tab) => {
              const active = dressTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setDressTab(tab)}
                  className="rounded-full px-5 py-1.5 font-display text-[11px] font-semibold uppercase tracking-[0.18em] transition"
                  style={{
                    backgroundColor: active
                      ? theme.accentPrimary
                      : theme.cardBgAlt,
                    color: active ? theme.accentPrimaryText : theme.textOnCard,
                    border: `1px solid ${theme.accentGold}66`,
                  }}
                >
                  {tab === "wanita" ? "Wanita" : "Pria"}
                </button>
              );
            })}
          </div>

          <div
            className="mt-4 rounded-xl p-4 text-center"
            style={{
              backgroundColor: theme.cardBgAlt,
              border: `1px solid ${theme.accentGold}44`,
            }}
          >
            <p className="text-xs font-medium leading-relaxed">
              {dressTab === "wanita"
                ? config.dressCode.womenAttire
                : config.dressCode.menAttire}
            </p>
          </div>

          {config.dressCode.colors.length > 0 ? (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
              {config.dressCode.colors.map((swatch, idx) => (
                <div
                  key={`${swatch.name}-${idx}`}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span
                    className="h-8 w-8 rounded-full shadow-sm"
                    style={{
                      backgroundColor: swatch.hex,
                      border: `2px solid ${theme.accentGold}`,
                    }}
                  />
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: theme.textOnCardMuted }}
                  >
                    {swatch.name}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </EditorialCard>
      ) : null}

      {/* 8. TANDA KASIH / WEDDING GIFT — Crowned Pill-Arch Royal Card (MP4 #2/#3) */}
      {config.gifts.enabled ? (
        <PillArchCard
          id="gifts"
          theme={theme}
          editTab="hadiah"
          editLabel="Edit Hadiah"
          onEditSection={onEditSection}
          showEditBadges={showEditBadges}
          radiusClass="rounded-[64px] sm:rounded-[76px]"
          innerRadiusClass="rounded-[56px] sm:rounded-[68px]"
        >
          <div className="text-center">
            <p
              className="font-script text-4xl leading-none"
              style={{ color: theme.accentPrimary }}
            >
              Wedding Gift
            </p>
            <h3 className="mt-1 font-serif text-3xl font-semibold">
              Tanda Kasih
            </h3>
            <p
              className="mt-2 text-xs leading-relaxed"
              style={{ color: theme.textOnCardMuted }}
            >
              {config.gifts.subtitle}
            </p>
          </div>

          {/* QR Code & Real Bank Account Transfer + Instant Confirmation */}
          <DirectTransferPanel
            guestName={guestName}
            guestCode={resolvedGuestCode}
            coupleTitle={coupleTitle}
            bankAccounts={config.gifts.bankAccounts}
            qrisImage={config.gifts.qrisImage}
            theme={theme}
          />

          {/* Heart Emblem Divider */}
          <div className="my-5 flex items-center justify-center gap-2">
            <span
              className="h-px w-12"
              style={{ backgroundColor: `${theme.accentGold}77` }}
            />
            <Heart
              className="h-4 w-4 fill-current"
              style={{ color: theme.accentGoldDark }}
            />
            <span
              className="h-px w-12"
              style={{ backgroundColor: `${theme.accentGold}77` }}
            />
          </div>

          <div className="space-y-3">
            {config.gifts.physicalGift.enabled ? (
              <div
                className="rounded-2xl p-4 text-center"
                style={{
                  backgroundColor: theme.cardBgAlt,
                  border: `1px solid ${theme.accentGold}55`,
                }}
              >
                <div className="mb-1 flex justify-center">
                  <Gift
                    className="h-5 w-5"
                    style={{ color: theme.accentGoldDark }}
                    strokeWidth={1.6}
                  />
                </div>
                <p
                  className="font-display text-[10px] font-semibold uppercase tracking-[0.2em]"
                  style={{ color: theme.accentGoldDark }}
                >
                  Kirim Kado Fisik
                </p>
                <p className="mt-1.5 text-xs font-semibold">
                  {config.gifts.physicalGift.recipient} (
                  {config.gifts.physicalGift.phone})
                </p>
                <p
                  className="mt-1 text-xs leading-relaxed"
                  style={{ color: theme.textOnCardMuted }}
                >
                  {config.gifts.physicalGift.address}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    copyText(config.gifts.physicalGift.address, "phys-addr")
                  }
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full px-5 py-1.5 text-[11px] font-semibold transition hover:opacity-85"
                  style={{
                    backgroundColor: theme.accentPrimary,
                    color: theme.accentPrimaryText,
                    border: `1px solid ${theme.accentGold}`,
                  }}
                >
                  {copiedKey === "phys-addr" ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Alamat Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Salin Alamat
                    </>
                  )}
                </button>
              </div>
            ) : null}
          </div>
        </PillArchCard>
      ) : null}

      {/* 9. RSVP & UCAPAN DOA — Deep Velvet Maroon Showcase Crowned with 5-Gonjong Gold (MP4 #1/#3) */}
      <motion.section
        id="wishes"
        initial={{ opacity: 0, y: 42, scale: 0.92, rotateX: 11 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        viewport={{ once: false, amount: 0.01 }}
        transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background: `linear-gradient(180deg, ${theme.accentPrimary} 0%, ${theme.bgSticky} 100%)`,
          border: `1.5px solid ${theme.accentGold}99`,
          color: "#FBF5EA",
          transformPerspective: 1000,
        }}
        className="relative overflow-hidden rounded-3xl px-6 py-8 shadow-2xl"
      >
        <div
          className="pointer-events-none absolute inset-2.5 rounded-2xl"
          style={{ border: `1px solid ${theme.accentGold}44` }}
        />

        <div className="relative z-10 text-center">
          <div className="mb-2 flex justify-center">
            <RumahGadangGoldCrownSVG theme={theme} className="h-11 w-24" />
          </div>
          <p
            className="font-script text-4xl leading-none"
            style={{ color: theme.accentGoldLight }}
          >
            RSVP &amp; Ucapan Doa
          </p>
          <h3 className="mt-1 font-serif text-3xl font-semibold text-white">
            Konfirmasi &amp; Doa Restu
          </h3>
          <p className="mt-1.5 text-xs text-white/75">
            Sampaikan ucapan selamat dan konfirmasi kehadiran Anda
          </p>
        </div>

        <form onSubmit={handleWishSubmit} className="relative z-10 mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/90">
              Nama Tamu
            </label>
            <input
              type="text"
              required
              value={wishName}
              onChange={(e) => setWishName(e.target.value)}
              placeholder="Contoh: Keluarga Bapak Ahmad"
              className="w-full rounded-lg px-3.5 py-2.5 text-xs outline-none transition"
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.accentGold}88`,
                color: theme.textOnCard,
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/90">
                Kehadiran
              </label>
              <select
                value={wishAttendance}
                onChange={(e) =>
                  setWishAttendance(
                    e.target.value as "hadir" | "berhalangan" | "ragu"
                  )
                }
                className="w-full rounded-lg px-3 py-2.5 text-xs outline-none"
                style={{
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.accentGold}88`,
                  color: theme.textOnCard,
                }}
              >
                <option value="hadir">InsyaAllah Hadir</option>
                <option value="ragu">Masih Menyesuaikan</option>
                <option value="berhalangan">Berhalangan Hadir</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/90">
                Jumlah Tamu
              </label>
              <div className="relative flex items-center">
                <Users
                  className="pointer-events-none absolute left-3 h-3.5 w-3.5 opacity-60"
                  style={{ color: theme.textOnCard }}
                />
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={wishGuestCount}
                  onChange={(e) =>
                    setWishGuestCount(Math.max(1, Number(e.target.value) || 1))
                  }
                  className="w-full rounded-lg py-2.5 pl-8 pr-3 text-xs outline-none"
                  style={{
                    backgroundColor: theme.cardBg,
                    border: `1px solid ${theme.accentGold}88`,
                    color: theme.textOnCard,
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-white/90">
              Ucapan &amp; Doa
            </label>
            <textarea
              required
              rows={3}
              value={wishMessage}
              onChange={(e) => setWishMessage(e.target.value)}
              placeholder="Tuliskan doa terbaik untuk kedua mempelai..."
              className="w-full rounded-lg px-3.5 py-2.5 text-xs outline-none"
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.accentGold}88`,
                color: theme.textOnCard,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={wishSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-semibold uppercase tracking-[0.16em] shadow-lg transition hover:scale-[1.01] disabled:opacity-60"
            style={{
              background: `linear-gradient(135deg, ${theme.accentGoldLight}, ${theme.accentGold})`,
              color: "#1B1110",
            }}
          >
            <Send className="h-3.5 w-3.5" />
            {wishSubmitting ? "Mengirim..." : "Kirim Ucapan & Konfirmasi"}
          </button>

          {wishSuccess ? (
            <p className="text-center text-xs font-semibold text-emerald-300">
              Terima kasih! Ucapan dan konfirmasi Anda telah tersimpan.
            </p>
          ) : null}
        </form>

        {/* Frosted Wishes Feed (MP4 #1/#3 Ucapan Doa Bubbles) */}
        <div className="relative z-10 mt-6 max-h-72 space-y-3 overflow-y-auto pr-1">
          {wishes.map((w) => (
            <div
              key={w.id}
              className="rounded-xl p-3.5 backdrop-blur-sm"
              style={{
                backgroundColor: "rgba(252, 249, 243, 0.94)",
                border: `1px solid ${theme.accentGold}77`,
                color: theme.textOnCard,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold">{w.name}</p>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize"
                  style={{
                    backgroundColor:
                      w.attendance === "hadir"
                        ? "#1D6A4322"
                        : w.attendance === "ragu"
                        ? "#C8A25A28"
                        : "#7E1A2422",
                    color:
                      w.attendance === "hadir"
                        ? "#165C39"
                        : theme.accentGoldDark,
                  }}
                >
                  {w.attendance === "hadir"
                    ? `Hadir (${w.guestCount} org)`
                    : w.attendance === "ragu"
                    ? "Menyesuaikan"
                    : "Berhalangan"}
                </span>
              </div>
              <p
                className="mt-1.5 text-xs leading-relaxed"
                style={{ color: theme.textOnCardMuted }}
              >
                {w.message}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 10. CLOSING ARCH PORTRAIT — Terima Kasih + Butterflies above Foreground Rumah Gadang (MP4 #3 00:35) */}
      <motion.section
        initial={{ opacity: 0, y: 36, scale: 0.9, rotateX: 12 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        viewport={{ once: false, amount: 0.01 }}
        transition={{ duration: 0.78 }}
        className="relative overflow-hidden rounded-t-[170px] rounded-b-3xl px-6 pb-14 pt-12 text-center shadow-2xl"
        style={{
          background: theme.isLightBase
            ? `linear-gradient(180deg, ${theme.cardBg} 0%, ${theme.cardBgAlt} 100%)`
            : `radial-gradient(circle at 50% 35%, ${theme.accentPrimary}CC 0%, rgba(18, 5, 7, 0.88) 100%)`,
          border: `1.5px solid ${theme.accentGold}99`,
          color: theme.isLightBase ? theme.textOnCard : "#FBF5EA",
          transformPerspective: 950,
        }}
      >
        <Minang25DBorderFrame theme={theme} />
        <FlutteringButterflies theme={theme} />

        <div className="relative z-10 flex flex-col items-center">
          <div className="mt-2">
            <FramedPortrait
              src={config.cover.coverPhoto}
              alt={coupleTitle}
              frameStyle={config.frameStyle}
              photoMode={config.photoMode}
              theme={theme}
              variant="cover"
            />
          </div>

          <p
            className="mt-5 font-script text-4xl leading-none"
            style={{ color: theme.accentGoldLight }}
          >
            Terima Kasih
          </p>

          <p
            className="mt-3 text-xs leading-relaxed"
            style={{
              color: theme.isLightBase
                ? theme.textOnCardMuted
                : "rgba(251, 245, 234, 0.86)",
            }}
          >
            {config.closing.thankYouText}
          </p>

          <p
            className="mt-3 font-serif text-sm italic"
            style={{ color: theme.accentGoldLight }}
          >
            “{config.closing.closingPantun}”
          </p>

          <PucuakRabuangDividerSVG
            color={theme.accentGold}
            className="mx-auto my-5 h-6 w-48"
          />

          <p className="text-xs font-medium opacity-85">
            {config.closing.familySignature}
          </p>
          <h3 className="mt-2 font-serif text-3xl font-semibold">
            {coupleTitle}
          </h3>
          <p
            className="mt-1 font-display text-[11px] uppercase tracking-[0.22em]"
            style={{ color: theme.accentGoldLight }}
          >
            {config.cover.dateDisplay}
          </p>
          <p
            className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em]"
            style={{ color: theme.accentGold }}
          >
            <Sparkles className="h-3 w-3" />
            Pusako Minangkabau Digital Invitation
          </p>
        </div>
      </motion.section>

      {/* Lightbox Modal */}
      {lightboxUrl ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightboxUrl(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-lg overflow-hidden rounded-2xl border p-2"
            style={{
              borderColor: theme.accentGold,
              backgroundColor: theme.bgSticky,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxUrl(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black"
            >
              <X className="h-4 w-4" />
            </button>
            <img
              src={lightboxUrl}
              alt={lightboxCaption}
              className="max-h-[75vh] w-full rounded-xl object-contain"
            />
            {lightboxCaption ? (
              <p className="py-2 text-center text-xs text-white/90">
                {lightboxCaption}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
