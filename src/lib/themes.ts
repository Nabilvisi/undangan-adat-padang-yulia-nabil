import { ThemeId } from "@/types/wedding";

export interface MinangThemePalette {
  id: ThemeId;
  name: string;
  tagline: string;
  description: string;
  isLightBase: boolean;
  /** Primary atmospheric background */
  bgPrimary: string;
  bgPrimaryGradient: string;
  /** Desktop sticky showcase panel background */
  bgSticky: string;
  /** Card surface (warm editorial ivory/parchment or velvet dark) */
  cardBg: string;
  cardBgAlt: string;
  cardBorder: string;
  /** Text colors on primary dark/light canvas */
  textOnPrimary: string;
  textOnPrimaryMuted: string;
  /** Text colors inside content cards */
  textOnCard: string;
  textOnCardMuted: string;
  /** Metallic / editorial foil accents */
  accentGold: string;
  accentGoldLight: string;
  accentGoldDark: string;
  /** Accent crimson / emerald for badges & buttons */
  accentPrimary: string;
  accentPrimaryText: string;
  /** Songket pattern stroke color & opacity */
  songketStroke: string;
  songketOpacity: number;
  /** Preview swatch dots */
  swatches: [string, string, string];
}

export const MINANG_THEMES: Record<ThemeId, MinangThemePalette> = {
  "sirah-gadang": {
    id: "sirah-gadang",
    name: "Sirah Baralek Gadang",
    tagline: "Klasik Marun & Ameh Kuno",
    description:
      "Nuansa agung merah marun Songket Pandai Sikek dipadukan kertas gading hangat dan ukiran emas foil antik.",
    isLightBase: false,
    bgPrimary: "#3B0D11",
    bgPrimaryGradient:
      "linear-gradient(180deg, #2D080B 0%, #441016 50%, #2B070A 100%)",
    bgSticky: "#210609",
    cardBg: "#F7F1E5",
    cardBgAlt: "#EFE5D4",
    cardBorder: "#D9C39E",
    textOnPrimary: "#FBF5EA",
    textOnPrimaryMuted: "#DFC9A6",
    textOnCard: "#231715",
    textOnCardMuted: "#6B5244",
    accentGold: "#C8A25A",
    accentGoldLight: "#E8CD93",
    accentGoldDark: "#8B6826",
    accentPrimary: "#5C151D",
    accentPrimaryText: "#FBF5EA",
    songketStroke: "#E5C687",
    songketOpacity: 0.08,
    swatches: ["#3B0D11", "#C8A25A", "#F7F1E5"],
  },
  "koto-gadang": {
    id: "koto-gadang",
    name: "Koto Gadang Royal",
    tagline: "Zamrud Hitam & Emas Champagne",
    description:
      "Terinspirasi busana adat Koto Gadang: hijau zamrud gelap yang teduh dan berwibawa dengan sentuhan emas champagne.",
    isLightBase: false,
    bgPrimary: "#0F221C",
    bgPrimaryGradient:
      "linear-gradient(180deg, #091713 0%, #152E26 50%, #0A1813 100%)",
    bgSticky: "#07120E",
    cardBg: "#F6F3EB",
    cardBgAlt: "#ECE7D9",
    cardBorder: "#CFC2A4",
    textOnPrimary: "#F7F4EC",
    textOnPrimaryMuted: "#C9D3C8",
    textOnCard: "#17221E",
    textOnCardMuted: "#516159",
    accentGold: "#D0B276",
    accentGoldLight: "#EDE0C2",
    accentGoldDark: "#8F733D",
    accentPrimary: "#16382E",
    accentPrimaryText: "#F7F4EC",
    songketStroke: "#DFC896",
    songketOpacity: 0.075,
    swatches: ["#0F221C", "#D0B276", "#F6F3EB"],
  },
  "pesisir-gading": {
    id: "pesisir-gading",
    name: "Pesisir Gading",
    tagline: "Krem Songket, Marun & Emas",
    description:
      "Versi terang bergaya editorial majalah pernikahan: latar tenun krem gading berpadu aksen marun dan emas.",
    isLightBase: true,
    bgPrimary: "#EFE5D6",
    bgPrimaryGradient:
      "linear-gradient(180deg, #F5EDE1 0%, #EAE0CF 50%, #F3EADF 100%)",
    bgSticky: "#421015",
    cardBg: "#FCF9F3",
    cardBgAlt: "#F2E9DA",
    cardBorder: "#D7C19D",
    textOnPrimary: "#2A1816",
    textOnPrimaryMuted: "#6F5347",
    textOnCard: "#261614",
    textOnCardMuted: "#6C5246",
    accentGold: "#B5893D",
    accentGoldLight: "#D7B26A",
    accentGoldDark: "#835F21",
    accentPrimary: "#681822",
    accentPrimaryText: "#FCF9F3",
    songketStroke: "#8B5E2B",
    songketOpacity: 0.07,
    swatches: ["#EFE5D6", "#681822", "#B5893D"],
  },
  "marawa-pusako": {
    id: "marawa-pusako",
    name: "Marawa Pusako",
    tagline: "Hitam Beludru, Sirah & Emas Murni",
    description:
      "Terinspirasi Marawa Minangkabau (Hitam, Merah, Kuning): tampil dramatis, modern-sakral, dan sangat kontras.",
    isLightBase: false,
    bgPrimary: "#141013",
    bgPrimaryGradient:
      "linear-gradient(180deg, #0D0A0C 0%, #1D1519 52%, #0E0B0D 100%)",
    bgSticky: "#0A080A",
    cardBg: "#1F171B",
    cardBgAlt: "#281D22",
    cardBorder: "#6F5328",
    textOnPrimary: "#F8F1E3",
    textOnPrimaryMuted: "#CEBC9E",
    textOnCard: "#F7F0E2",
    textOnCardMuted: "#CBB89A",
    accentGold: "#DBB363",
    accentGoldLight: "#F3D797",
    accentGoldDark: "#9A722B",
    accentPrimary: "#7E1A24",
    accentPrimaryText: "#FBF4E7",
    songketStroke: "#E0B96B",
    songketOpacity: 0.07,
    swatches: ["#141013", "#7E1A24", "#DBB363"],
  },
};

export const THEME_LIST: MinangThemePalette[] = Object.values(MINANG_THEMES);
