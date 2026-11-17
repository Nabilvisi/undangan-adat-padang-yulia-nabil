export type ThemeId =
  | "sirah-gadang"
  | "koto-gadang"
  | "pesisir-gading"
  | "marawa-pusako";

export type PhotoMode = "with-photo" | "illustration";

export type FrameStyle = "gonjong-arch" | "oval-ukiran" | "songket-royal";

export type NameOrder = "bride-first" | "groom-first";

export type MusicTrackId =
  | "urang-minang-baralek"
  | "talempong-baralek"
  | "saluang-bansi"
  | "rabab-pasisia"
  | "sarunai-aleknagari"
  | "badindin-baralek"
  | "minang-romantis"
  | "custom";

export interface PersonProfile {
  nickname: string;
  fullName: string;
  gala: string;
  showGala: boolean;
  roleLabel: string;
  childOrder: string;
  fatherName: string;
  motherName: string;
  suku: string;
  instagram: string;
  photo: string;
}

export interface EventItem {
  id: string;
  enabled: boolean;
  name: string;
  subtitle: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "08:00 WIB"
  endTime: string; // e.g. "10:00 WIB"
  venueName: string;
  address: string;
  city: string;
  mapsUrl: string;
  lat?: number;
  lng?: number;
  landmarkNote?: string;
}

export interface LoveStoryItem {
  id: string;
  year: string;
  title: string;
  description: string;
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface DressCodeSwatch {
  name: string;
  hex: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface WeddingConfig {
  themeId: ThemeId;
  photoMode: PhotoMode;
  frameStyle: FrameStyle;
  nameOrder: NameOrder;
  slug: string;
  cover: {
    subtitle: string;
    title: string;
    coverPhoto: string;
    stickyPhoto: string;
    defaultGuestName: string;
    dateDisplay: string;
  };
  bride: PersonProfile;
  groom: PersonProfile;
  pasambahan: {
    arabicBismillah: string;
    minangPantun: string;
    quoteText: string;
    quoteSource: string;
    invitationIntro: string;
  };
  countdownDate: string; // ISO date string YYYY-MM-DDTHH:mm
  events: EventItem[];
  loveStory: {
    enabled: boolean;
    heading: string;
    items: LoveStoryItem[];
  };
  gallery: {
    enabled: boolean;
    heading: string;
    subtitle: string;
    photos: GalleryPhoto[];
  };
  liveStreaming: {
    enabled: boolean;
    platform: string;
    scheduleNote: string;
    url: string;
    buttonLabel: string;
  };
  dressCode: {
    enabled: boolean;
    note: string;
    menAttire: string;
    womenAttire: string;
    colors: DressCodeSwatch[];
  };
  gifts: {
    enabled: boolean;
    subtitle: string;
    bankAccounts: BankAccount[];
    qrisImage: string;
    physicalGift: {
      enabled: boolean;
      recipient: string;
      phone: string;
      address: string;
    };
  };
  music: {
    enabled: boolean;
    trackId: MusicTrackId;
    customAudioUrl: string;
  };
  closing: {
    thankYouText: string;
    closingPantun: string;
    familySignature: string;
  };
}

export interface WishItem {
  id: string;
  name: string;
  attendance: "hadir" | "berhalangan" | "ragu";
  guestCount: number;
  message: string;
  guestCode?: string;
  createdAt: string;
}

export interface GuestRecord {
  id: string;
  code: string; // Unique QR Code token e.g. "MN-YN-8F3A21"
  name: string;
  category: string; // e.g. "Keluarga", "VIP", "Sahabat", "Kolega"
  phone?: string;
  waSent?: boolean;
  waSentAt?: string;
  rsvpStatus: "belum-konfirmasi" | "hadir" | "berhalangan" | "ragu";
  pax: number;
  checkedIn: boolean;
  checkedInAt?: string;
  message?: string;
  updatedAt: string;
}

export interface TransferRecord {
  id: string;
  referenceCode: string; // e.g. "TRX-MN-90421"
  senderName: string;
  guestCode?: string;
  amount: number;
  method: string; // e.g. "QRIS Instan", "VA Bank Nagari", "VA BCA", "VA Mandiri", "VA BRI"
  vaOrAccountNumber: string;
  message?: string;
  status: "berhasil-konfirmasi" | "terverifikasi";
  createdAt: string;
}
