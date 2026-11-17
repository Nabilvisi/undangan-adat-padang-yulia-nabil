import defaultConfig from "@/data/wedding-config.json";
import { EventItem, WeddingConfig } from "@/types/wedding";

export const DEFAULT_WEDDING_CONFIG: WeddingConfig =
  defaultConfig as WeddingConfig;

export const LOCAL_STORAGE_CONFIG_KEY = "pusako_minang_wedding_config_v1";
export const LOCAL_STORAGE_WISHES_KEY = "pusako_minang_wishes_v1";

export function getCoupleOrder(config: WeddingConfig) {
  if (config.nameOrder === "groom-first") {
    return {
      first: config.groom,
      second: config.bride,
      firstIsBride: false,
    };
  }
  return {
    first: config.bride,
    second: config.groom,
    firstIsBride: true,
  };
}

export function getCoupleTitle(config: WeddingConfig): string {
  const { first, second } = getCoupleOrder(config);
  return `${first.nickname} & ${second.nickname}`;
}

export function getCoupleInitials(config: WeddingConfig): string {
  const { first, second } = getCoupleOrder(config);
  const f = (first.nickname || "Y").trim().charAt(0).toUpperCase();
  const s = (second.nickname || "N").trim().charAt(0).toUpperCase();
  return `${f} & ${s}`;
}

const INDONESIAN_DAYS = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function formatIndonesianDate(dateStr: string): string {
  if (!dateStr) return "Tanggal Dapat Diedit";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return dateStr;
  const year = Number(match[1]);
  const monthIdx = Number(match[2]) - 1;
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, monthIdx, day));
  if (Number.isNaN(utcDate.getTime())) return dateStr;
  const dayName = INDONESIAN_DAYS[utcDate.getUTCDay()];
  const month = INDONESIAN_MONTHS[utcDate.getUTCMonth()];
  return `${dayName}, ${day} ${month} ${year}`;
}

export function buildGoogleCalendarUrl(
  event: EventItem,
  coupleTitle: string
): string {
  const cleanDate = event.date.replace(/-/g, "");
  const startDigits = (event.startTime || "09:00").replace(/\D/g, "").padEnd(4, "0").slice(0, 4);
  const endDigits = (event.endTime || "12:00").replace(/\D/g, "").padEnd(4, "0").slice(0, 4);
  const dates = cleanDate
    ? `${cleanDate}T${startDigits}00/${cleanDate}T${endDigits}00`
    : "";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${event.name} — Pernikahan ${coupleTitle}`,
    details: `${event.subtitle}\n${event.venueName}\n${event.address}`,
    location: `${event.venueName}, ${event.address}, ${event.city}`,
  });
  if (dates) {
    params.set("dates", dates);
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function mergeWeddingConfig(
  partial: Partial<WeddingConfig> | null | undefined
): WeddingConfig {
  if (!partial) return DEFAULT_WEDDING_CONFIG;
  return {
    ...DEFAULT_WEDDING_CONFIG,
    ...partial,
    cover: { ...DEFAULT_WEDDING_CONFIG.cover, ...partial.cover },
    bride: { ...DEFAULT_WEDDING_CONFIG.bride, ...partial.bride },
    groom: { ...DEFAULT_WEDDING_CONFIG.groom, ...partial.groom },
    pasambahan: {
      ...DEFAULT_WEDDING_CONFIG.pasambahan,
      ...partial.pasambahan,
    },
    events:
      Array.isArray(partial.events) && partial.events.length > 0
        ? partial.events
        : DEFAULT_WEDDING_CONFIG.events,
    loveStory: {
      ...DEFAULT_WEDDING_CONFIG.loveStory,
      ...partial.loveStory,
      items:
        partial.loveStory?.items ?? DEFAULT_WEDDING_CONFIG.loveStory.items,
    },
    gallery: {
      ...DEFAULT_WEDDING_CONFIG.gallery,
      ...partial.gallery,
      photos: partial.gallery?.photos ?? DEFAULT_WEDDING_CONFIG.gallery.photos,
    },
    liveStreaming: {
      ...DEFAULT_WEDDING_CONFIG.liveStreaming,
      ...partial.liveStreaming,
    },
    dressCode: {
      ...DEFAULT_WEDDING_CONFIG.dressCode,
      ...partial.dressCode,
      colors:
        partial.dressCode?.colors ?? DEFAULT_WEDDING_CONFIG.dressCode.colors,
    },
    gifts: {
      ...DEFAULT_WEDDING_CONFIG.gifts,
      ...partial.gifts,
      bankAccounts:
        partial.gifts?.bankAccounts ??
        DEFAULT_WEDDING_CONFIG.gifts.bankAccounts,
      physicalGift: {
        ...DEFAULT_WEDDING_CONFIG.gifts.physicalGift,
        ...partial.gifts?.physicalGift,
      },
    },
    music: { ...DEFAULT_WEDDING_CONFIG.music, ...partial.music },
    closing: { ...DEFAULT_WEDDING_CONFIG.closing, ...partial.closing },
  };
}
