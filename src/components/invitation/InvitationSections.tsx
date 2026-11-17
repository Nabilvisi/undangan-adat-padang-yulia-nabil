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
  GonjongRoofSVG,
  PayuangKuniangSVG,
  PucuakRabuangDividerSVG,
  SuntiangCrownSVG,
  UkiranCornerSVG,
} from "@/components/ornaments/MinangOrnaments";
import {
  Floating3DWeddingRings,
  InterlockingBotanicalMonogram,
  Minang25DBorderFrame,
  MinangCardFloralWings,
  Reveal3D,
} from "@/components/ornaments/Minang3DElements";
import { FramedPortrait } from "./FramedPortrait";
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
      viewport={{ once: false, amount: 0.12, margin: "-25px 0px -25px 0px" }}
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
    <div className="space-y-6 pb-24">
      {/* 1. HERO SECTION */}
      <motion.section
        id="hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-2xl px-6 py-10 text-center shadow-2xl"
        style={{
          backgroundColor: theme.isLightBase
            ? theme.cardBg
            : "rgba(18, 6, 8, 0.48)",
          border: `1.5px solid ${theme.accentGold}80`,
          color: theme.isLightBase ? theme.textOnCard : theme.textOnPrimary,
        }}
      >
        {showEditBadges && onEditSection ? (
          <button
            type="button"
            onClick={() => onEditSection("foto")}
            className="absolute right-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold shadow-md transition hover:scale-105"
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
          className="mt-5 font-display text-[10px] uppercase tracking-[0.28em]"
          style={{ color: theme.accentGold }}
        >
          {config.cover.subtitle}
        </p>

        <h2
          className="mt-2 font-serif text-4xl font-semibold tracking-wide"
          style={{
            color: theme.isLightBase ? theme.textOnCard : theme.textOnPrimary,
          }}
        >
          {coupleTitle}
        </h2>

        <p
          className="mt-1.5 text-xs uppercase tracking-[0.2em] font-display"
          style={{
            color: theme.isLightBase
              ? theme.textOnCardMuted
              : theme.textOnPrimaryMuted,
          }}
        >
          {config.cover.dateDisplay}
        </p>

        <div className="mt-6">
          <FramedPortrait
            src={config.cover.coverPhoto}
            alt={coupleTitle}
            frameStyle={config.frameStyle}
            photoMode={config.photoMode}
            theme={theme}
            variant="cover"
          />
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
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

      {/* 2. PASAMBAHAN & AYAT SUCI */}
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
            className="text-sm leading-relaxed"
            style={{ color: theme.textOnCard }}
          >
            “{config.pasambahan.quoteText}”
          </p>
          <p
            className="mt-2 font-display text-[11px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: theme.accentGoldDark }}
          >
            — {config.pasambahan.quoteSource} —
          </p>
        </div>
      </EditorialCard>

      {/* 3. PROFIL MEMPELAI (ANAK DARO & MARAPULAI) */}
      <EditorialCard
        id="couple"
        theme={theme}
        editTab="mempelai"
        editLabel="Edit Mempelai"
        onEditSection={onEditSection}
        showEditBadges={showEditBadges}
      >
        <div className="text-center">
          <p
            className="font-display text-[10px] uppercase tracking-[0.26em]"
            style={{ color: theme.accentGoldDark }}
          >
            Anak Daro & Marapulai
          </p>
          <h3 className="mt-1 font-serif text-3xl font-semibold">
            Mempelai Berbahagia
          </h3>
          <p
            className="mt-3 text-xs leading-relaxed"
            style={{ color: theme.textOnCardMuted }}
          >
            {config.pasambahan.invitationIntro}
          </p>
        </div>

        <div className="mt-8 space-y-8">
          {[first, second].map((person, idx) => {
            const isBride =
              (idx === 0 && firstIsBride) || (idx === 1 && !firstIsBride);
            return (
              <React.Fragment key={person.roleLabel + idx}>
                {idx === 1 && (
                  <div className="flex flex-col items-center justify-center py-1">
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

                  <h4 className="mt-5 font-serif text-2xl font-bold tracking-wide">
                    {person.fullName}
                  </h4>

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
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-medium transition hover:opacity-80"
                      style={{
                        border: `1px solid ${theme.accentGold}77`,
                        color: theme.textOnCard,
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
      </EditorialCard>

      {/* 4. COUNTDOWN & RANGKAIAN ACARA */}
      <EditorialCard
        id="events"
        theme={theme}
        editTab="acara"
        editLabel="Edit Acara"
        onEditSection={onEditSection}
        showEditBadges={showEditBadges}
      >
        <div className="text-center">
          <p
            className="font-display text-[10px] uppercase tracking-[0.26em]"
            style={{ color: theme.accentGoldDark }}
          >
            Save The Date
          </p>
          <h3 className="mt-1 font-serif text-3xl font-semibold">
            Rangkaian Acara
          </h3>
          <p
            className="mt-1 text-xs"
            style={{ color: theme.textOnCardMuted }}
          >
            Menghitung hari menuju momen bahagia
          </p>
        </div>

        <div className="mt-5">
          <CountdownCard targetDate={config.countdownDate} theme={theme} />
        </div>

        <PucuakRabuangDividerSVG
          color={theme.accentGold}
          className="mx-auto my-6 h-6 w-52"
        />

        <div className="space-y-4">
          {activeEvents.map((ev, evIdx) => (
            <Reveal3D
              key={ev.id}
              variant={evIdx % 2 === 0 ? "zoom-down" : "zoom-up"}
              className="rounded-xl p-5 text-center shadow-sm"
            >
              <div
                className="rounded-xl p-1"
                style={{
                  backgroundColor: theme.cardBgAlt,
                  border: `1px solid ${theme.accentGold}55`,
                }}
              >
                <div className="p-4">
                  <p
                    className="font-display text-[10px] uppercase tracking-[0.22em]"
                    style={{ color: theme.accentGoldDark }}
                  >
                    {ev.subtitle}
                  </p>
                  <h4 className="mt-1 font-serif text-2xl font-bold">{ev.name}</h4>

                  <div
                    className="mt-3 space-y-1.5 text-xs"
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
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold transition hover:opacity-80"
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
                        Rute Navigasi Eksternal
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </Reveal3D>
          ))}
        </div>

        {/* UNIQUE QR PASS PER GUEST */}
        <div className="mt-6">
          <GuestQrPass
            guestName={guestName}
            guestCode={resolvedGuestCode}
            coupleTitle={coupleTitle}
            dateDisplay={config.cover.dateDisplay}
            theme={theme}
          />
        </div>
      </EditorialCard>

      {/* 5. LOVE STORY TIMELINE */}
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
              className="font-display text-[10px] uppercase tracking-[0.26em]"
              style={{ color: theme.accentGoldDark }}
            >
              Our Journey
            </p>
            <h3 className="mt-1 font-serif text-3xl font-semibold">
              {config.loveStory.heading}
            </h3>
          </div>

          <div className="relative mt-6 space-y-5 pl-6">
            <div
              className="absolute bottom-2 left-2 top-2 w-px"
              style={{ backgroundColor: `${theme.accentGold}66` }}
            />
            {config.loveStory.items.map((item, idx) => (
              <Reveal3D
                key={item.id}
                variant={idx % 2 === 0 ? "zoom-up" : "slide-right-3d"}
                delay={idx * 0.08}
                className="relative"
              >
                <span
                  className="absolute -left-[22px] top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: theme.cardBg,
                    border: `2px solid ${theme.accentGold}`,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: theme.accentPrimary }}
                  />
                </span>
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
              </Reveal3D>
            ))}
          </div>
        </EditorialCard>
      ) : null}

      {/* 6. GALERI & LIVE STREAMING */}
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
          {config.gallery.enabled && config.gallery.photos.length > 0 ? (
            <>
              <div className="text-center">
                <p
                  className="font-display text-[10px] uppercase tracking-[0.26em]"
                  style={{ color: theme.accentGoldDark }}
                >
                  Portraits &amp; Heritage
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

              {/* 8-Photo Gallery Grid: 4 Columns x 2 Rows with Bidirectional 3D Scroll Reveal */}
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
                    viewport={{ once: false, amount: 0.15 }}
                    transition={{
                      duration: 0.65,
                      delay: (index % 4) * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={() => {
                      setLightboxUrl(photo.url);
                      setLightboxCaption(photo.caption);
                    }}
                    className="group relative aspect-[3/4] overflow-hidden rounded-xl text-left shadow-sm transition hover:scale-[1.03]"
                    style={{
                      border: `1px solid ${theme.accentGold}77`,
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

          {config.liveStreaming.enabled ? (
            <div
              className="mt-6 rounded-xl p-5 text-center"
              style={{
                backgroundColor: theme.cardBgAlt,
                border: `1px solid ${theme.accentGold}55`,
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Radio
                  className="h-4 w-4"
                  style={{ color: theme.accentGoldDark }}
                />
                <span
                  className="font-display text-[10px] font-semibold uppercase tracking-[0.22em]"
                  style={{ color: theme.accentGoldDark }}
                >
                  Live Streaming
                </span>
              </div>
              <p className="mt-1.5 font-serif text-xl font-semibold">
                {config.liveStreaming.platform}
              </p>
              <p
                className="mt-1 text-xs"
                style={{ color: theme.textOnCardMuted }}
              >
                {config.liveStreaming.scheduleNote}
              </p>
              <a
                href={config.liveStreaming.url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold transition hover:opacity-90"
                style={{
                  backgroundColor: theme.accentPrimary,
                  color: theme.accentPrimaryText,
                }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {config.liveStreaming.buttonLabel}
              </a>
            </div>
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

      {/* 8. TANDA KASIH / AMPLOP DIGITAL */}
      {config.gifts.enabled ? (
        <EditorialCard
          id="gifts"
          theme={theme}
          editTab="hadiah"
          editLabel="Edit Hadiah"
          onEditSection={onEditSection}
          showEditBadges={showEditBadges}
        >
          <div className="text-center">
            <div className="flex justify-center">
              <Gift
                className="h-6 w-6"
                style={{ color: theme.accentGoldDark }}
                strokeWidth={1.5}
              />
            </div>
            <p
              className="mt-2 font-display text-[10px] uppercase tracking-[0.26em]"
              style={{ color: theme.accentGoldDark }}
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

          <div className="mt-4 space-y-3">
            {config.gifts.physicalGift.enabled ? (
              <div
                className="rounded-xl p-4 text-center"
                style={{
                  backgroundColor: theme.cardBgAlt,
                  border: `1px solid ${theme.accentGold}44`,
                }}
              >
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
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-semibold"
                  style={{
                    border: `1px solid ${theme.accentGold}`,
                    color: theme.textOnCard,
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
        </EditorialCard>
      ) : null}

      {/* 9. RSVP & DOA RESTU */}
      <EditorialCard id="wishes" theme={theme}>
        <div className="text-center">
          <div className="flex justify-center">
            <Heart
              className="h-6 w-6"
              style={{ color: theme.accentGoldDark }}
              strokeWidth={1.5}
            />
          </div>
          <p
            className="mt-2 font-display text-[10px] uppercase tracking-[0.26em]"
            style={{ color: theme.accentGoldDark }}
          >
            RSVP &amp; Wishes
          </p>
          <h3 className="mt-1 font-serif text-3xl font-semibold">
            Konfirmasi &amp; Doa Restu
          </h3>
          <p
            className="mt-1.5 text-xs"
            style={{ color: theme.textOnCardMuted }}
          >
            Sampaikan ucapan selamat dan konfirmasi kehadiran Anda
          </p>
        </div>

        <form onSubmit={handleWishSubmit} className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider">
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
                backgroundColor: theme.cardBgAlt,
                border: `1px solid ${theme.accentGold}66`,
                color: theme.textOnCard,
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider">
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
                  backgroundColor: theme.cardBgAlt,
                  border: `1px solid ${theme.accentGold}66`,
                  color: theme.textOnCard,
                }}
              >
                <option value="hadir">InsyaAllah Hadir</option>
                <option value="ragu">Masih Menyesuaikan</option>
                <option value="berhalangan">Berhalangan Hadir</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider">
                Jumlah Tamu
              </label>
              <div className="relative flex items-center">
                <Users className="pointer-events-none absolute left-3 h-3.5 w-3.5 opacity-60" />
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
                    backgroundColor: theme.cardBgAlt,
                    border: `1px solid ${theme.accentGold}66`,
                    color: theme.textOnCard,
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider">
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
                backgroundColor: theme.cardBgAlt,
                border: `1px solid ${theme.accentGold}66`,
                color: theme.textOnCard,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={wishSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-semibold uppercase tracking-[0.16em] transition hover:opacity-90 disabled:opacity-60"
            style={{
              backgroundColor: theme.accentPrimary,
              color: theme.accentPrimaryText,
            }}
          >
            <Send className="h-3.5 w-3.5" />
            {wishSubmitting ? "Mengirim..." : "Kirim Ucapan & Konfirmasi"}
          </button>

          {wishSuccess ? (
            <p className="text-center text-xs font-semibold text-emerald-700">
              Terima kasih! Ucapan dan konfirmasi Anda telah tersimpan.
            </p>
          ) : null}
        </form>

        {/* Wishes Feed */}
        <div className="mt-6 max-h-72 space-y-3 overflow-y-auto pr-1">
          {wishes.map((w) => (
            <div
              key={w.id}
              className="rounded-xl p-3.5"
              style={{
                backgroundColor: theme.cardBgAlt,
                border: `1px solid ${theme.accentGold}44`,
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
      </EditorialCard>

      {/* 10. CLOSING CARD */}
      <motion.section
        initial={{ opacity: 0, y: 36, scale: 0.9, rotateX: 12 }}
        whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        viewport={{ once: false, amount: 0.18 }}
        transition={{ duration: 0.78 }}
        className="relative overflow-hidden rounded-2xl px-6 py-10 text-center shadow-2xl"
        style={{
          backgroundColor: theme.isLightBase
            ? theme.cardBg
            : "rgba(18, 6, 8, 0.52)",
          border: `1.5px solid ${theme.accentGold}77`,
          color: theme.isLightBase ? theme.textOnCard : theme.textOnPrimary,
          transformPerspective: 950,
        }}
      >
        <Minang25DBorderFrame theme={theme} />
        <GonjongRoofSVG
          color={theme.accentGold}
          secondaryColor={theme.accentGoldLight}
          className="mx-auto w-44 h-auto opacity-90"
        />

        <p
          className="mt-4 text-xs leading-relaxed"
          style={{
            color: theme.isLightBase
              ? theme.textOnCardMuted
              : theme.textOnPrimaryMuted,
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
          className="mt-4 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em]"
          style={{ color: theme.accentGold }}
        >
          <Sparkles className="h-3 w-3" />
          Pusako Minangkabau Digital Invitation
        </p>
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
