"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Camera,
  Check,
  CheckCheck,
  CheckCircle2,
  Copy,
  CreditCard,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  Gift,
  Heart,
  MessageSquareText,
  Monitor,
  Music,
  Palette,
  Phone,
  Play,
  Plus,
  QrCode,
  RotateCcw,
  Save,
  Search,
  Send,
  Shirt,
  SkipForward,
  Smartphone,
  Square,
  Trash2,
  Upload,
  UserCheck,
  Users,
} from "lucide-react";
import { MINANG_THEMES, THEME_LIST } from "@/lib/themes";
import {
  DEFAULT_WEDDING_CONFIG,
  LOCAL_STORAGE_CONFIG_KEY,
  mergeWeddingConfig,
} from "@/lib/config-store";
import { MUSIC_TRACK_OPTIONS, MinangAudioPlayer } from "@/lib/audio";
import {
  DEFAULT_WA_TEMPLATE,
  ParsedGuestEntry,
  buildWhatsAppDirectHref,
  parseDelimitedGuestInput,
  parseSpreadsheetRows,
  renderWhatsAppMessage,
} from "@/lib/whatsapp-guests";
import {
  FrameStyle,
  GuestRecord,
  MusicTrackId,
  PhotoMode,
  ThemeId,
  TransferRecord,
  WeddingConfig,
} from "@/types/wedding";
import { InvitationView } from "@/components/invitation/InvitationView";
import { StudioTabKey } from "@/components/invitation/InvitationSections";
import { formatRupiah } from "@/components/invitation/DirectTransferPanel";

const TABS: {
  id: StudioTabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "tema", label: "Tema & Musik", icon: Palette },
  { id: "mempelai", label: "Mempelai", icon: Users },
  { id: "acara", label: "Acara & 3D Map", icon: Calendar },
  { id: "foto", label: "Foto & Galeri", icon: Camera },
  { id: "database", label: "Database Tamu", icon: Database },
  { id: "transfer", label: "Rekap Transfer", icon: CreditCard },
  { id: "cerita", label: "Pasambahan", icon: Heart },
  { id: "busana", label: "Busana & Live", icon: Shirt },
  { id: "hadiah", label: "Rekening & QR", icon: Gift },
  { id: "tamu", label: "Sebar WA", icon: Send },
];

export function StudioEditor({
  initialConfig = DEFAULT_WEDDING_CONFIG,
}: {
  initialConfig?: WeddingConfig;
}) {
  const [config, setConfig] = useState<WeddingConfig>(initialConfig);
  const [activeTab, setActiveTab] = useState<StudioTabKey>("tema");
  const [previewViewport, setPreviewViewport] = useState<"mobile" | "desktop">(
    "mobile"
  );
  const [showEditBadges, setShowEditBadges] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  // Audio preview in Studio
  const studioAudioRef = useRef<MinangAudioPlayer | null>(null);
  const [previewingTrack, setPreviewingTrack] = useState<MusicTrackId | null>(
    null
  );

  // Guest Database state
  const [guests, setGuests] = useState<GuestRecord[]>([]);
  const [newGuestNames, setNewGuestNames] = useState("");
  const [newGuestCategory, setNewGuestCategory] = useState("Keluarga / VIP");
  const [checkInInput, setCheckInInput] = useState("");
  const [guestSearch, setGuestSearch] = useState("");
  const [copiedGuestCode, setCopiedGuestCode] = useState<string | null>(null);

  // Transfer Database state
  const [transfers, setTransfers] = useState<TransferRecord[]>([]);

  // Guest link generator, Excel import & WhatsApp Blast Queue state
  const [guestBulkText, setGuestBulkText] = useState("");
  const [waTemplate, setWaTemplate] = useState(DEFAULT_WA_TEMPLATE);
  const [includeQrCodeInWa, setIncludeQrCodeInWa] = useState(true);
  const [waFilter, setWaFilter] = useState<"all" | "unsent" | "sent">("all");
  const [waSearch, setWaSearch] = useState("");
  const [copiedAllLinks, setCopiedAllLinks] = useState(false);
  const [copiedWaMsgId, setCopiedWaMsgId] = useState<string | null>(null);
  const [excelImporting, setExcelImporting] = useState(false);
  const [excelImportSummary, setExcelImportSummary] = useState<string | null>(
    null
  );
  const [originUrl, setOriginUrl] = useState(
    "https://undangan-adat-padang-yulia-nabil.vercel.app"
  );
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [copiedPublicLink, setCopiedPublicLink] = useState(false);

  const importInputRef = useRef<HTMLInputElement | null>(null);
  const excelUploadInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setOriginUrl(window.location.origin);
    try {
      const savedTpl = window.localStorage.getItem("pusako_wa_template_v1");
      if (savedTpl) setWaTemplate(savedTpl);
    } catch {
      // ignore
    }
    const host = window.location.hostname;
    const params = new URLSearchParams(window.location.search);
    const pinParam = (params.get("pin") || "").trim().toLowerCase();
    const savedUnlock =
      window.sessionStorage.getItem("pusako_studio_unlocked") === "1";

    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      savedUnlock ||
      pinParam === "yulianabil" ||
      pinParam === "201226"
    ) {
      setIsUnlocked(true);
      if (pinParam) {
        window.sessionStorage.setItem("pusako_studio_unlocked", "1");
      }
    } else {
      setIsUnlocked(false);
    }

    const loadAll = async () => {
      let resolved = initialConfig;
      let loadedFromServer = false;
      try {
        const res = await fetch("/api/config", { cache: "no-store" });
        if (res.ok) {
          resolved = mergeWeddingConfig(await res.json());
          loadedFromServer = true;
        }
      } catch {
        // ignore
      }
      if (!loadedFromServer) {
        try {
          const localRaw = window.localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
          if (localRaw) {
            resolved = mergeWeddingConfig(JSON.parse(localRaw));
          }
        } catch {
          // ignore
        }
      }
      setConfig(resolved);

      try {
        const gRes = await fetch("/api/guests", { cache: "no-store" });
        if (gRes.ok) setGuests((await gRes.json()) as GuestRecord[]);
      } catch {
        // ignore
      }

      try {
        const tRes = await fetch("/api/transfers", { cache: "no-store" });
        if (tRes.ok) setTransfers((await tRes.json()) as TransferRecord[]);
      } catch {
        // ignore
      }
    };
    void loadAll();

    return () => {
      studioAudioRef.current?.stop();
    };
  }, [initialConfig]);

  const refreshDatabases = async () => {
    try {
      const [gRes, tRes] = await Promise.all([
        fetch("/api/guests", { cache: "no-store" }),
        fetch("/api/transfers", { cache: "no-store" }),
      ]);
      if (gRes.ok) setGuests((await gRes.json()) as GuestRecord[]);
      if (tRes.ok) setTransfers((await tRes.json()) as TransferRecord[]);
    } catch {
      // ignore
    }
  };

  const updateLocalCache = (next: WeddingConfig) => {
    setConfig(next);
    try {
      window.localStorage.setItem(
        LOCAL_STORAGE_CONFIG_KEY,
        JSON.stringify(next)
      );
    } catch {
      // ignore
    }
  };

  const handleToggleStudioAudio = (trackId: MusicTrackId) => {
    if (!studioAudioRef.current) {
      studioAudioRef.current = new MinangAudioPlayer();
    }
    if (previewingTrack === trackId && studioAudioRef.current.isPlaying()) {
      studioAudioRef.current.stop();
      setPreviewingTrack(null);
      return;
    }
    studioAudioRef.current.stop();
    studioAudioRef.current.configure(trackId, config.music.customAudioUrl);
    studioAudioRef.current.play();
    setPreviewingTrack(trackId);
  };

  const handleSavePermanent = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      window.localStorage.setItem(
        LOCAL_STORAGE_CONFIG_KEY,
        JSON.stringify(config)
      );
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.persistedToGitHub) {
          setSaveMessage(
            "Berhasil disimpan & langsung di-publish ke GitHub + Live Vercel!"
          );
        } else if (data.persistedToDisk) {
          setSaveMessage(
            "Tersimpan permanen ke project & siap live untuk semua tamu!"
          );
        } else if (data.persistedToTmp) {
          setSaveMessage(
            "Perubahan telah aktif di server live! (Hubungkan GITHUB_TOKEN di Vercel untuk auto-commit permanen)."
          );
        } else {
          setSaveMessage("Tersimpan di browser.");
        }
      } else {
        setSaveMessage("Tersimpan di browser lokal.");
      }
    } catch {
      setSaveMessage("Tersimpan di browser lokal.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const handleResetDefault = () => {
    updateLocalCache(DEFAULT_WEDDING_CONFIG);
    setSaveMessage("Konfigurasi dikembalikan ke default awal.");
    setTimeout(() => setSaveMessage(null), 3500);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        updateLocalCache(mergeWeddingConfig(parsed));
        setSaveMessage("File konfigurasi berhasil dimuat!");
      } catch {
        setSaveMessage("Format file JSON tidak valid.");
      }
      setTimeout(() => setSaveMessage(null), 3500);
    };
    reader.readAsText(file);
  };

  const uploadAsset = async (
    file: File,
    fieldKey: string,
    onDone: (url: string) => void
  ) => {
    setUploadingField(fieldKey);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          onDone(data.url);
          return;
        }
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onDone(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingField(null);
    }
  };

  // Guest Database actions
  const handleAddGuestsToDb = async () => {
    const lines = newGuestNames
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    const res = await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add",
        names: lines,
        category: newGuestCategory,
        pax: 2,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.guests) setGuests(data.guests);
      setNewGuestNames("");
      setSaveMessage(
        `${lines.length} tamu berhasil ditambahkan beserta kode QR uniknya!`
      );
      setTimeout(() => setSaveMessage(null), 3500);
    }
  };

  const handleCheckInGuest = async (codeOrName: string) => {
    if (!codeOrName.trim()) return;
    const res = await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "checkin",
        code: codeOrName.trim(),
        name: codeOrName.trim(),
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.guests) setGuests(data.guests);
      setCheckInInput("");
      setSaveMessage(`Check-in QR berhasil untuk: ${codeOrName}`);
      setTimeout(() => setSaveMessage(null), 3500);
    }
  };

  const handleExportGuestsCsv = () => {
    const headers = [
      "Kode QR",
      "Nama Tamu",
      "Nomor WhatsApp",
      "Kategori",
      "Status Kirim WA",
      "Status RSVP",
      "Jumlah Pax",
      "Sudah Check-In",
      "Waktu Check-In",
      "Ucapan",
    ];
    const rows = guests.map((g) => [
      g.code,
      `"${g.name.replace(/"/g, '""')}"`,
      g.phone || "-",
      `"${g.category}"`,
      g.waSent ? "TERKIRIM" : "BELUM",
      g.rsvpStatus,
      g.pax,
      g.checkedIn ? "SUDAH" : "BELUM",
      g.checkedInAt || "-",
      `"${(g.message || "").replace(/"/g, '""')}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "database-tamu-undangan.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Excel & WhatsApp Bulk Import / Queue Helpers
  const syncEntriesToGuestDb = async (
    entries: ParsedGuestEntry[],
    sourceLabel: string
  ) => {
    if (entries.length === 0) return;
    setExcelImporting(true);
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "import-bulk",
          entries,
          category: newGuestCategory,
          pax: 2,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.guests) setGuests(data.guests);
        const msg = `${sourceLabel}: ${data.addedCount ?? entries.length} tamu ditambahkan${
          data.updatedCount ? `, ${data.updatedCount} diperbarui` : ""
        } beserta nomor WA & kode QR!`;
        setExcelImportSummary(msg);
        setSaveMessage(msg);
        setTimeout(() => setSaveMessage(null), 4000);
      }
    } finally {
      setExcelImporting(false);
    }
  };

  const handleDownloadExcelTemplate = async () => {
    const XLSX = await import("xlsx");
    const sampleRows = [
      {
        "Nama Tamu": "Keluarga Bapak H. Ahmad & Ibu",
        "Nomor WhatsApp": "081234567890",
        Kategori: "Keluarga / VIP",
        Pax: 2,
      },
      {
        "Nama Tamu": "Datuak Rajo Alam & Istri",
        "Nomor WhatsApp": "+62 813-9876-5432",
        Kategori: "Ninik Mamak",
        Pax: 2,
      },
      {
        "Nama Tamu": "Rizki Pratama & Partner",
        "Nomor WhatsApp": "6285211223344",
        Kategori: "Sahabat",
        Pax: 2,
      },
    ];
    const ws = XLSX.utils.json_to_sheet(sampleRows);
    ws["!cols"] = [{ wch: 32 }, { wch: 20 }, { wch: 18 }, { wch: 8 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Daftar Tamu");
    XLSX.writeFile(wb, "template-daftar-tamu-undangan.xlsx");
  };

  const handleImportExcelFile = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelImporting(true);
    try {
      const XLSX = await import("xlsx");
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: "array" });
      const firstSheet = wb.SheetNames[0];
      if (!firstSheet) return;
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
        wb.Sheets[firstSheet],
        { defval: "" }
      );
      const parsed = parseSpreadsheetRows(rows, newGuestCategory);
      if (parsed.length === 0) {
        setExcelImportSummary(
          "Tidak ditemukan kolom Nama Tamu yang valid di file Excel/CSV."
        );
        return;
      }
      await syncEntriesToGuestDb(parsed, `Import ${file.name}`);
    } catch {
      setExcelImportSummary("Gagal membaca file Excel/CSV. Pastikan format benar.");
    } finally {
      setExcelImporting(false);
      e.target.value = "";
    }
  };

  const handleImportPastedGuests = async () => {
    const entries = parseDelimitedGuestInput(guestBulkText, newGuestCategory);
    if (entries.length === 0) return;
    await syncEntriesToGuestDb(entries, "Paste Excel / Daftar Cepat");
    setGuestBulkText("");
  };

  const handleToggleGuestWaSent = async (guest: GuestRecord, nextSent: boolean) => {
    setGuests((prev) =>
      prev.map((g) =>
        g.id === guest.id
          ? { ...g, waSent: nextSent, waSentAt: nextSent ? new Date().toISOString() : undefined }
          : g
      )
    );
    await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "mark-wa-sent",
        id: guest.id,
        code: guest.code,
        sent: nextSent,
      }),
    });
  };

  const handleDeleteGuest = async (guest: GuestRecord) => {
    setGuests((prev) => prev.filter((g) => g.id !== guest.id));
    await fetch("/api/guests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id: guest.id }),
    });
  };

  const updateWaTemplate = (next: string) => {
    setWaTemplate(next);
    try {
      window.localStorage.setItem("pusako_wa_template_v1", next);
    } catch {
      // ignore
    }
  };

  // Transfer Database actions
  const handleVerifyTransfer = async (id: string) => {
    const res = await fetch("/api/transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "verify", id }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.transfers) setTransfers(data.transfers);
    }
  };

  const handleDeleteTransfer = async (id: string) => {
    const res = await fetch("/api/transfers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.transfers) setTransfers(data.transfers);
    }
  };

  const handleExportTransfersCsv = () => {
    const headers = [
      "Kode Referensi",
      "Nama Pengirim",
      "Nominal (Rp)",
      "Metode Transfer",
      "Kode VA / Rekening",
      "Status",
      "Pesan",
      "Waktu",
    ];
    const rows = transfers.map((t) => [
      t.referenceCode,
      `"${t.senderName.replace(/"/g, '""')}"`,
      t.amount,
      `"${t.method}"`,
      t.vaOrAccountNumber,
      t.status,
      `"${(t.message || "").replace(/"/g, '""')}"`,
      t.createdAt,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rekapan-transfer-pengantin.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const activeTheme =
    MINANG_THEMES[config.themeId] || MINANG_THEMES["sirah-gadang"];

  const coupleLabel =
    config.nameOrder === "groom-first"
      ? `${config.groom.nickname} & ${config.bride.nickname}`
      : `${config.bride.nickname} & ${config.groom.nickname}`;

  const pastedPreviewEntries = parseDelimitedGuestInput(
    guestBulkText,
    newGuestCategory
  );

  const buildGuestUrl = (name: string, code?: string) => {
    const params = new URLSearchParams();
    params.set("to", name);
    if (code) params.set("code", code);
    return `${originUrl}/?${params.toString()}`;
  };

  const buildGuestMessage = (name: string, code?: string) => {
    const useCode = includeQrCodeInWa ? code : undefined;
    const url = buildGuestUrl(name, useCode);
    return renderWhatsAppMessage(waTemplate, {
      name,
      link: url,
      coupleLabel,
      dateDisplay: config.cover.dateDisplay,
      guestCode: useCode,
    });
  };

  const buildWhatsAppHref = (name: string, code?: string, phone?: string) => {
    const text = buildGuestMessage(name, code);
    return buildWhatsAppDirectHref(phone, text);
  };

  const handleSendGuestWa = (guest: GuestRecord) => {
    const href = buildWhatsAppHref(guest.name, guest.code, guest.phone);
    window.open(href, "_blank", "noopener,noreferrer");
    void handleToggleGuestWaSent(guest, true);
  };

  const waSentCount = guests.filter((g) => g.waSent).length;
  const waUnsentCount = guests.length - waSentCount;
  const nextUnsentGuest = guests.find((g) => !g.waSent) || null;

  const waQueueGuests = guests.filter((g) => {
    if (waFilter === "unsent" && g.waSent) return false;
    if (waFilter === "sent" && !g.waSent) return false;
    if (!waSearch.trim()) return true;
    const q = waSearch.toLowerCase();
    return (
      g.name.toLowerCase().includes(q) ||
      (g.phone || "").toLowerCase().includes(q) ||
      g.code.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q)
    );
  });

  const handleCopyAllGuestLinks = () => {
    const lines = waQueueGuests.map(
      (g, i) =>
        `${i + 1}. ${g.name}${g.phone ? ` (+${g.phone})` : ""} — ${buildGuestUrl(
          g.name,
          includeQrCodeInWa ? g.code : undefined
        )}`
    );
    void navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAllLinks(true);
    setTimeout(() => setCopiedAllLinks(false), 2500);
  };

  // Computed stats
  const totalHadirPax = guests
    .filter((g) => g.rsvpStatus === "hadir")
    .reduce((acc, g) => acc + (g.pax || 1), 0);
  const totalCheckedIn = guests.filter((g) => g.checkedIn).length;
  const totalTransferAmount = transfers.reduce((acc, t) => acc + t.amount, 0);

  const filteredGuests = guests.filter(
    (g) =>
      !guestSearch.trim() ||
      g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      (g.phone || "").toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.code.toLowerCase().includes(guestSearch.toLowerCase())
  );

  const handleUnlockStudio = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = pinInput.trim().toLowerCase();
    if (cleaned === "yulianabil" || cleaned === "201226") {
      setIsUnlocked(true);
      setPinError(false);
      try {
        window.sessionStorage.setItem("pusako_studio_unlocked", "1");
      } catch {
        // ignore
      }
    } else {
      setPinError(true);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#140A0C] px-4 text-[#F5EFE6]">
        <div className="w-full max-w-md rounded-2xl border border-[#C8A25A]/50 bg-[#1F1215] p-7 text-center shadow-2xl">
          <p className="font-display text-[10px] uppercase tracking-[0.26em] text-[#E8CD93]">
            Akses Khusus Pengantin
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold text-white">
            Studio &amp; Dashboard
          </h1>
          <p className="mt-1.5 text-xs text-white/65">
            Halaman ini dikunci agar tamu undangan tidak dapat mengubah isi undangan secara sembarangan.
          </p>

          <form onSubmit={handleUnlockStudio} className="mt-5 space-y-3">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Masukkan Kode Akses Pengantin..."
              className="w-full rounded-xl border border-[#C8A25A]/50 bg-black/40 px-4 py-3 text-center text-sm text-white outline-none"
            />
            {pinError ? (
              <p className="text-xs font-semibold text-red-400">
                Kode akses tidak sesuai.
              </p>
            ) : null}
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-[#E8CD93] to-[#C8A25A] py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#1B1110] shadow-lg"
            >
              Buka Studio Pengantin
            </button>
          </form>

          <div className="mt-5 border-t border-white/10 pt-4">
            <Link
              href="/"
              className="text-xs text-[#E8CD93] hover:underline"
            >
              ← Kembali ke Halaman Undangan Tamu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#141012] text-[#F5EFE6]">
      {/* TOP STUDIO TOOLBAR */}
      <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#1B1316]/95 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85 hover:bg-white/10"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Lihat Tampilan Tamu
          </Link>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(`${originUrl}/`);
              setCopiedPublicLink(true);
              setTimeout(() => setCopiedPublicLink(false), 2500);
            }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#C8A25A]/60 bg-[#C8A25A]/15 px-3 py-1.5 text-xs font-semibold text-[#E8CD93] hover:bg-[#C8A25A]/25"
          >
            {copiedPublicLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                Link Tamu Tersalin!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Salin Link Tamu
              </>
            )}
          </button>
          <div>
            <p className="font-serif text-base font-semibold text-[#E8CD93]">
              Studio &amp; Dashboard Pengantin — Pusako Minang
            </p>
            <p className="text-[11px] text-white/60">
              {config.bride.fullName} &amp; {config.groom.fullName}
            </p>
          </div>
        </div>

        {/* Center Viewport & Theme Quick Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-full border border-white/15 bg-black/30 p-0.5">
            <button
              type="button"
              onClick={() => setPreviewViewport("mobile")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition ${
                previewViewport === "mobile"
                  ? "bg-[#C8A25A] text-[#1B1110]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile
            </button>
            <button
              type="button"
              onClick={() => setPreviewViewport("desktop")}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition ${
                previewViewport === "desktop"
                  ? "bg-[#C8A25A] text-[#1B1110]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              Desktop
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowEditBadges((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
              showEditBadges
                ? "border-[#C8A25A] bg-[#C8A25A]/15 text-[#E8CD93]"
                : "border-white/15 bg-white/5 text-white/70"
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Klik-Edit: {showEditBadges ? "Aktif" : "Mati"}
          </button>
        </div>

        {/* Right Save & Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            title="Download file wedding-config.json"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85 hover:bg-white/10"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            title="Import file wedding-config.json"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/85 hover:bg-white/10"
          >
            <Upload className="h-3.5 w-3.5" />
            Import
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJson}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleResetDefault}
            title="Reset ke pengaturan awal"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/75 hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={handleSavePermanent}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E8CD93] to-[#C8A25A] px-4 py-1.5 text-xs font-bold text-[#1B1110] shadow-lg transition hover:brightness-105 disabled:opacity-60"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Menyimpan..." : "Simpan & Buat Live"}
          </button>
        </div>
      </header>

      {saveMessage ? (
        <div className="border-b border-emerald-500/30 bg-emerald-950/70 px-4 py-2 text-center text-xs font-medium text-emerald-200">
          {saveMessage}
        </div>
      ) : null}

      {/* WORKSPACE: LIVE PREVIEW (LEFT) + EDITOR SIDEBAR (RIGHT) */}
      <div className="flex flex-1 flex-col lg:flex-row">
        {/* LIVE PREVIEW PANEL */}
        <section className="flex-1 overflow-y-auto bg-[#0D0A0B] p-4 lg:p-6">
          <div className="mb-3 flex items-center justify-between text-xs text-white/60">
            <span>
              Pratinjau Langsung — Versi:{" "}
              <strong className="text-[#E8CD93]">{activeTheme.name}</strong>
            </span>
            <Link
              href={`/?theme=${config.themeId}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-[#E8CD93] hover:underline"
            >
              Buka di Tab Penuh <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div
            className={`mx-auto overflow-hidden rounded-2xl border border-white/15 shadow-2xl transition-all duration-300 ${
              previewViewport === "mobile"
                ? "max-w-[430px] max-h-[82vh] overflow-y-auto"
                : "w-full max-h-[82vh] overflow-y-auto"
            }`}
          >
            <InvitationView
              overrideConfig={config}
              forceOpened
              isEmbeddedPreview
              forceMobileLayout={previewViewport === "mobile"}
              showEditBadges={showEditBadges}
              onEditSection={(tab) => setActiveTab(tab)}
              onThemeQuickChange={(themeId) =>
                updateLocalCache({ ...config, themeId })
              }
            />
          </div>
        </section>

        {/* RIGHT EDITOR SIDEBAR */}
        <aside className="flex w-full flex-col border-t border-white/10 bg-[#1B1417] lg:w-[490px] lg:shrink-0 lg:border-l lg:border-t-0">
          {/* Tab Navigation Pills (5x2 Grid) */}
          <div className="grid grid-cols-5 gap-1.5 border-b border-white/10 p-3">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (tab.id === "database" || tab.id === "transfer") {
                      void refreshDatabases();
                    }
                  }}
                  className={`flex flex-col items-center gap-1 rounded-xl px-1.5 py-2 text-[10px] font-semibold transition ${
                    active
                      ? "bg-[#C8A25A] text-[#1B1110] shadow-sm"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="truncate w-full text-center">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Form Content */}
          <div className="flex-1 space-y-5 overflow-y-auto p-5 lg:max-h-[calc(100vh-145px)]">
            {/* TAB 1: TEMA & 5 INSTRUMEN MUSIK MINANG */}
            {activeTab === "tema" ? (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-semibold text-[#E8CD93]">
                    Pilih Versi Warna Adat Padang
                  </h2>
                  <p className="mt-1 text-xs text-white/65">
                    Bandingkan 4 versi palet warna Minangkabau lengkap dengan animasi Rumah Gadang Bagonjong &amp; Marawa.
                  </p>

                  <div className="mt-3 space-y-2.5">
                    {THEME_LIST.map((t) => {
                      const active = config.themeId === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() =>
                            updateLocalCache({
                              ...config,
                              themeId: t.id as ThemeId,
                            })
                          }
                          className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition ${
                            active
                              ? "border-[#E8CD93] bg-[#C8A25A]/15"
                              : "border-white/10 bg-white/5 hover:border-white/25"
                          }`}
                        >
                          <div className="mt-0.5 flex -space-x-1.5">
                            {t.swatches.map((hex, i) => (
                              <span
                                key={i}
                                className="h-5 w-5 rounded-full border border-white/40 shadow-sm"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-bold text-white">
                                {t.name}
                              </p>
                              {active ? (
                                <span className="rounded-full bg-[#E8CD93] px-2 py-0.5 text-[10px] font-bold text-[#1B1110]">
                                  Aktif
                                </span>
                              ) : null}
                            </div>
                            <p className="text-[11px] font-medium text-[#E8CD93]">
                              {t.tagline}
                            </p>
                            <p className="mt-1 text-[11px] leading-relaxed text-white/65">
                              {t.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Locked Background Song: Urang Minang Baralek Gadang */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4 text-[#E8CD93]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#E8CD93]">
                        Musik Latar Undangan
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.music.enabled}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          music: {
                            ...config.music,
                            enabled: e.target.checked,
                            trackId: "urang-minang-baralek",
                          },
                        })
                      }
                      className="h-4 w-4 accent-[#C8A25A]"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E8CD93] bg-[#C8A25A]/15 p-3">
                    <div>
                      <p className="text-xs font-bold text-white">
                        Urang Minang Baralek Gadang
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#E8CD93]">
                        Randy Chow Feat. Yeyen Zymra (Sarai Sarumpun Official)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleStudioAudio("urang-minang-baralek")
                      }
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold transition ${
                        previewingTrack === "urang-minang-baralek"
                          ? "bg-emerald-500 text-black"
                          : "bg-[#C8A25A] text-[#1B1110]"
                      }`}
                    >
                      {previewingTrack === "urang-minang-baralek" ? (
                        <>
                          <Square className="h-3 w-3" /> Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3" /> Dengar Lagu
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Photo Mode & Frame Style */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/80">
                      Mode Foto
                    </label>
                    <div className="mt-1.5 flex flex-col gap-1.5">
                      {(
                        [
                          { id: "with-photo", label: "Dengan Foto" },
                          { id: "illustration", label: "Ilustrasi Adat" },
                        ] as { id: PhotoMode; label: string }[]
                      ).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() =>
                            updateLocalCache({ ...config, photoMode: m.id })
                          }
                          className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                            config.photoMode === m.id
                              ? "border-[#E8CD93] bg-[#C8A25A]/20 text-[#E8CD93]"
                              : "border-white/10 bg-white/5 text-white/70"
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/80">
                      Bingkai Foto
                    </label>
                    <div className="mt-1.5 flex flex-col gap-1.5">
                      {(
                        [
                          { id: "gonjong-arch", label: "Gonjong Arch" },
                          { id: "oval-ukiran", label: "Oval Ukiran" },
                          { id: "songket-royal", label: "Songket Royal" },
                        ] as { id: FrameStyle; label: string }[]
                      ).map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() =>
                            updateLocalCache({ ...config, frameStyle: f.id })
                          }
                          className={`rounded-lg border px-2.5 py-1.5 text-[11px] font-semibold transition ${
                            config.frameStyle === f.id
                              ? "border-[#E8CD93] bg-[#C8A25A]/20 text-[#E8CD93]"
                              : "border-white/10 bg-white/5 text-white/70"
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* TAB 2: MEMPELAI */}
            {activeTab === "mempelai" ? (
              <div className="space-y-5">
                <h2 className="font-serif text-xl font-semibold text-[#E8CD93]">
                  Data Mempelai &amp; Sampul
                </h2>

                <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <label className="block text-xs font-semibold text-white/80">
                    Urutan Penyebutan Nama
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateLocalCache({
                          ...config,
                          nameOrder: "bride-first",
                        })
                      }
                      className={`rounded-lg border py-2 text-xs font-semibold ${
                        config.nameOrder === "bride-first"
                          ? "border-[#E8CD93] bg-[#C8A25A]/20 text-[#E8CD93]"
                          : "border-white/10 bg-black/20 text-white/70"
                      }`}
                    >
                      Yulia &amp; Nabil (CPW Dulu)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        updateLocalCache({
                          ...config,
                          nameOrder: "groom-first",
                        })
                      }
                      className={`rounded-lg border py-2 text-xs font-semibold ${
                        config.nameOrder === "groom-first"
                          ? "border-[#E8CD93] bg-[#C8A25A]/20 text-[#E8CD93]"
                          : "border-white/10 bg-black/20 text-white/70"
                      }`}
                    >
                      Nabil &amp; Yulia (CPP Dulu)
                    </button>
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] text-white/70">
                      Teks Tanggal di Sampul
                    </label>
                    <input
                      type="text"
                      value={config.cover.dateDisplay}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          cover: {
                            ...config.cover,
                            dateDisplay: e.target.value,
                          },
                        })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-white/70">
                      Judul Adat Sampul
                    </label>
                    <input
                      type="text"
                      value={config.cover.subtitle}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          cover: { ...config.cover, subtitle: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* CPW (Anak Daro) */}
                <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-display text-xs font-bold uppercase tracking-wider text-[#E8CD93]">
                    Mempelai Wanita (Anak Daro)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-[11px] text-white/70">
                        Nama Panggilan
                      </label>
                      <input
                        type="text"
                        value={config.bride.nickname}
                        onChange={(e) =>
                          updateLocalCache({
                            ...config,
                            bride: {
                              ...config.bride,
                              nickname: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-white/70">
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={config.bride.instagram}
                        onChange={(e) =>
                          updateLocalCache({
                            ...config,
                            bride: {
                              ...config.bride,
                              instagram: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-white/70">
                      Nama Lengkap CPW
                    </label>
                    <input
                      type="text"
                      value={config.bride.fullName}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          bride: { ...config.bride, fullName: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-[11px] text-white/70">
                        Nama Ayah
                      </label>
                      <input
                        type="text"
                        value={config.bride.fatherName}
                        onChange={(e) =>
                          updateLocalCache({
                            ...config,
                            bride: {
                              ...config.bride,
                              fatherName: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-white/70">
                        Nama Ibu
                      </label>
                      <input
                        type="text"
                        value={config.bride.motherName}
                        onChange={(e) =>
                          updateLocalCache({
                            ...config,
                            bride: {
                              ...config.bride,
                              motherName: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-white/70">
                      Suku / Asal Daerah
                    </label>
                    <input
                      type="text"
                      value={config.bride.suku}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          bride: { ...config.bride, suku: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* CPP (Marapulai) */}
                <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-display text-xs font-bold uppercase tracking-wider text-[#E8CD93]">
                    Mempelai Pria (Marapulai)
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-[11px] text-white/70">
                        Nama Panggilan
                      </label>
                      <input
                        type="text"
                        value={config.groom.nickname}
                        onChange={(e) =>
                          updateLocalCache({
                            ...config,
                            groom: {
                              ...config.groom,
                              nickname: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-white/70">
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={config.groom.instagram}
                        onChange={(e) =>
                          updateLocalCache({
                            ...config,
                            groom: {
                              ...config.groom,
                              instagram: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-white/70">
                      Nama Lengkap CPP
                    </label>
                    <input
                      type="text"
                      value={config.groom.fullName}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          groom: { ...config.groom, fullName: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] text-white/80">
                      <input
                        type="checkbox"
                        checked={config.groom.showGala}
                        onChange={(e) =>
                          updateLocalCache({
                            ...config,
                            groom: {
                              ...config.groom,
                              showGala: e.target.checked,
                            },
                          })
                        }
                        className="accent-[#C8A25A]"
                      />
                      Tampilkan Gelar Adat (Gala)
                    </label>
                    {config.groom.showGala ? (
                      <input
                        type="text"
                        value={config.groom.gala}
                        onChange={(e) =>
                          updateLocalCache({
                            ...config,
                            groom: { ...config.groom, gala: e.target.value },
                          })
                        }
                        placeholder="Contoh: Bergelar Sutan Rajo Mudo"
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                      />
                    ) : null}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-[11px] text-white/70">
                        Nama Ayah
                      </label>
                      <input
                        type="text"
                        value={config.groom.fatherName}
                        onChange={(e) =>
                          updateLocalCache({
                            ...config,
                            groom: {
                              ...config.groom,
                              fatherName: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] text-white/70">
                        Nama Ibu
                      </label>
                      <input
                        type="text"
                        value={config.groom.motherName}
                        onChange={(e) =>
                          updateLocalCache({
                            ...config,
                            groom: {
                              ...config.groom,
                              motherName: e.target.value,
                            },
                          })
                        }
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-white/70">
                      Suku / Asal Daerah
                    </label>
                    <input
                      type="text"
                      value={config.groom.suku}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          groom: { ...config.groom, suku: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {/* TAB 3: ACARA & PETA 3D */}
            {activeTab === "acara" ? (
              <div className="space-y-5">
                <h2 className="font-serif text-xl font-semibold text-[#E8CD93]">
                  Tanggal, Lokasi &amp; Peta Visual 3D
                </h2>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <label className="mb-1 block text-xs font-semibold text-white/80">
                    Target Tanggal Hitung Mundur (Countdown)
                  </label>
                  <input
                    type="datetime-local"
                    value={config.countdownDate}
                    onChange={(e) =>
                      updateLocalCache({
                        ...config,
                        countdownDate: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                  />
                </div>

                <div className="space-y-4">
                  {config.events.map((ev, idx) => (
                    <div
                      key={ev.id}
                      className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 text-xs font-bold text-[#E8CD93]">
                          <input
                            type="checkbox"
                            checked={ev.enabled}
                            onChange={(e) => {
                              const nextEvents = [...config.events];
                              nextEvents[idx] = {
                                ...ev,
                                enabled: e.target.checked,
                              };
                              updateLocalCache({
                                ...config,
                                events: nextEvents,
                              });
                            }}
                            className="accent-[#C8A25A]"
                          />
                          {ev.name}
                        </label>
                        {config.events.length > 1 ? (
                          <button
                            type="button"
                            onClick={() =>
                              updateLocalCache({
                                ...config,
                                events: config.events.filter(
                                  (_, i) => i !== idx
                                ),
                              })
                            }
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-[11px] text-white/70">
                            Nama Acara
                          </label>
                          <input
                            type="text"
                            value={ev.name}
                            onChange={(e) => {
                              const nextEvents = [...config.events];
                              nextEvents[idx] = { ...ev, name: e.target.value };
                              updateLocalCache({
                                ...config,
                                events: nextEvents,
                              });
                            }}
                            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] text-white/70">
                            Subjudul
                          </label>
                          <input
                            type="text"
                            value={ev.subtitle}
                            onChange={(e) => {
                              const nextEvents = [...config.events];
                              nextEvents[idx] = {
                                ...ev,
                                subtitle: e.target.value,
                              };
                              updateLocalCache({
                                ...config,
                                events: nextEvents,
                              });
                            }}
                            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="mb-1 block text-[11px] text-white/70">
                            Tanggal
                          </label>
                          <input
                            type="date"
                            value={ev.date}
                            onChange={(e) => {
                              const nextEvents = [...config.events];
                              nextEvents[idx] = { ...ev, date: e.target.value };
                              updateLocalCache({
                                ...config,
                                events: nextEvents,
                              });
                            }}
                            className="w-full rounded-lg border border-white/15 bg-black/30 px-2 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] text-white/70">
                            Mulai
                          </label>
                          <input
                            type="text"
                            value={ev.startTime}
                            onChange={(e) => {
                              const nextEvents = [...config.events];
                              nextEvents[idx] = {
                                ...ev,
                                startTime: e.target.value,
                              };
                              updateLocalCache({
                                ...config,
                                events: nextEvents,
                              });
                            }}
                            className="w-full rounded-lg border border-white/15 bg-black/30 px-2.5 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] text-white/70">
                            Selesai
                          </label>
                          <input
                            type="text"
                            value={ev.endTime}
                            onChange={(e) => {
                              const nextEvents = [...config.events];
                              nextEvents[idx] = {
                                ...ev,
                                endTime: e.target.value,
                              };
                              updateLocalCache({
                                ...config,
                                events: nextEvents,
                              });
                            }}
                            className="w-full rounded-lg border border-white/15 bg-black/30 px-2.5 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] text-white/70">
                          Nama Gedung / Masjid / Lokasi (Tampil di Pin 3D)
                        </label>
                        <input
                          type="text"
                          value={ev.venueName}
                          onChange={(e) => {
                            const nextEvents = [...config.events];
                            nextEvents[idx] = {
                              ...ev,
                              venueName: e.target.value,
                            };
                            updateLocalCache({ ...config, events: nextEvents });
                          }}
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] text-white/70">
                          Alamat Lengkap (Otomatis Mengarahkan Peta di Website)
                        </label>
                        <textarea
                          rows={2}
                          value={ev.address}
                          onChange={(e) => {
                            const nextEvents = [...config.events];
                            nextEvents[idx] = {
                              ...ev,
                              address: e.target.value,
                            };
                            updateLocalCache({ ...config, events: nextEvents });
                          }}
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-[11px] text-white/70">
                            Kota / Daerah
                          </label>
                          <input
                            type="text"
                            value={ev.city}
                            onChange={(e) => {
                              const nextEvents = [...config.events];
                              nextEvents[idx] = { ...ev, city: e.target.value };
                              updateLocalCache({
                                ...config,
                                events: nextEvents,
                              });
                            }}
                            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] text-white/70">
                            Patokan Lokasi (Landmark 3D)
                          </label>
                          <input
                            type="text"
                            value={ev.landmarkNote || ""}
                            onChange={(e) => {
                              const nextEvents = [...config.events];
                              nextEvents[idx] = {
                                ...ev,
                                landmarkNote: e.target.value,
                              };
                              updateLocalCache({
                                ...config,
                                events: nextEvents,
                              });
                            }}
                            placeholder="Contoh: 5 Menit dari Masjid Raya"
                            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="mb-1 block text-[11px] text-white/70">
                            Latitude (Opsional)
                          </label>
                          <input
                            type="number"
                            step="0.0001"
                            value={ev.lat ?? ""}
                            onChange={(e) => {
                              const nextEvents = [...config.events];
                              nextEvents[idx] = {
                                ...ev,
                                lat: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              };
                              updateLocalCache({
                                ...config,
                                events: nextEvents,
                              });
                            }}
                            placeholder="-0.9242"
                            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-[11px] text-white/70">
                            Longitude (Opsional)
                          </label>
                          <input
                            type="number"
                            step="0.0001"
                            value={ev.lng ?? ""}
                            onChange={(e) => {
                              const nextEvents = [...config.events];
                              nextEvents[idx] = {
                                ...ev,
                                lng: e.target.value
                                  ? Number(e.target.value)
                                  : undefined,
                              };
                              updateLocalCache({
                                ...config,
                                events: nextEvents,
                              });
                            }}
                            placeholder="100.3624"
                            className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* TAB 4: FOTO & GALERI */}
            {activeTab === "foto" ? (
              <div className="space-y-5">
                <h2 className="font-serif text-xl font-semibold text-[#E8CD93]">
                  Kelola Foto &amp; Galeri
                </h2>

                {[
                  {
                    key: "cover",
                    label: "Foto Sampul Utama (Cover & Gate)",
                    value: config.cover.coverPhoto,
                    onChange: (url: string) =>
                      updateLocalCache({
                        ...config,
                        cover: {
                          ...config.cover,
                          coverPhoto: url,
                          stickyPhoto: url,
                        },
                      }),
                  },
                  {
                    key: "bride",
                    label: `Foto Anak Daro (${config.bride.nickname})`,
                    value: config.bride.photo,
                    onChange: (url: string) =>
                      updateLocalCache({
                        ...config,
                        bride: { ...config.bride, photo: url },
                      }),
                  },
                  {
                    key: "groom",
                    label: `Foto Marapulai (${config.groom.nickname})`,
                    value: config.groom.photo,
                    onChange: (url: string) =>
                      updateLocalCache({
                        ...config,
                        groom: { ...config.groom, photo: url },
                      }),
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="space-y-2.5 rounded-xl border border-white/10 bg-white/5 p-3.5"
                  >
                    <p className="text-xs font-bold text-[#E8CD93]">
                      {item.label}
                    </p>
                    <div className="flex items-center gap-3">
                      <img
                        src={item.value}
                        alt={item.label}
                        className="h-16 w-16 shrink-0 rounded-lg border border-white/20 object-cover"
                      />
                      <div className="flex-1 space-y-2">
                        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#C8A25A] px-3 py-1.5 text-[11px] font-bold text-[#1B1110]">
                          <Upload className="h-3.5 w-3.5" />
                          {uploadingField === item.key
                            ? "Mengunggah..."
                            : "Upload Foto"}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                void uploadAsset(file, item.key, item.onChange);
                              }
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => item.onChange(e.target.value)}
                          placeholder="Atau tempel URL foto..."
                          className="w-full rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-[11px] text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Gallery Section */}
                <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E8CD93]">
                      Galeri Foto Momen
                    </span>
                    <input
                      type="checkbox"
                      checked={config.gallery.enabled}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          gallery: {
                            ...config.gallery,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4 accent-[#C8A25A]"
                    />
                  </div>

                  <div className="space-y-2.5">
                    {config.gallery.photos.map((photo, idx) => (
                      <div
                        key={photo.id}
                        className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-black/25 p-2"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="h-12 w-12 shrink-0 rounded object-cover"
                        />
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={photo.caption}
                            onChange={(e) => {
                              const nextPhotos = [...config.gallery.photos];
                              nextPhotos[idx] = {
                                ...photo,
                                caption: e.target.value,
                              };
                              updateLocalCache({
                                ...config,
                                gallery: {
                                  ...config.gallery,
                                  photos: nextPhotos,
                                },
                              });
                            }}
                            placeholder="Keterangan foto..."
                            className="w-full rounded border border-white/10 bg-black/30 px-2 py-1 text-[11px] text-white"
                          />
                          <input
                            type="text"
                            value={photo.url}
                            onChange={(e) => {
                              const nextPhotos = [...config.gallery.photos];
                              nextPhotos[idx] = {
                                ...photo,
                                url: e.target.value,
                              };
                              updateLocalCache({
                                ...config,
                                gallery: {
                                  ...config.gallery,
                                  photos: nextPhotos,
                                },
                              });
                            }}
                            className="w-full rounded border border-white/10 bg-black/30 px-2 py-1 text-[10px] text-white/75"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateLocalCache({
                              ...config,
                              gallery: {
                                ...config.gallery,
                                photos: config.gallery.photos.filter(
                                  (_, i) => i !== idx
                                ),
                              },
                            })
                          }
                          className="p-1 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#C8A25A]/60 py-2.5 text-xs font-semibold text-[#E8CD93] hover:bg-[#C8A25A]/10">
                    <Plus className="h-4 w-4" />
                    Tambah Foto ke Galeri
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          void uploadAsset(file, "gallery", (url) =>
                            updateLocalCache({
                              ...config,
                              gallery: {
                                ...config.gallery,
                                photos: [
                                  ...config.gallery.photos,
                                  {
                                    id: `gal-${Date.now()}`,
                                    url,
                                    caption: "Momen Bahagia",
                                  },
                                ],
                              },
                            })
                          );
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            ) : null}

            {/* TAB 5: DATABASE KEHADIRAN TAMU & CHECK-IN QR */}
            {activeTab === "database" ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#E8CD93]">
                      Database Kehadiran Tamu &amp; QR
                    </h2>
                    <p className="text-[11px] text-white/60">
                      Pantau siapa saja yang hadir, status RSVP, &amp; verifikasi QR Code
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setActiveTab("tamu")}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-500/45 bg-emerald-950/50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300 hover:bg-emerald-900/60"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5" />
                      Import Excel
                    </button>
                    <button
                      type="button"
                      onClick={handleExportGuestsCsv}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#C8A25A] bg-[#C8A25A]/15 px-3 py-1.5 text-[11px] font-bold text-[#E8CD93]"
                    >
                      <Download className="h-3.5 w-3.5" />
                      CSV
                    </button>
                  </div>
                </div>

                {/* Summary Stat Cards */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
                    <p className="tabular-nums-editorial text-xl font-bold text-white">
                      {guests.length}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-white/60">
                      Total Undangan
                    </p>
                  </div>
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-center">
                    <p className="tabular-nums-editorial text-xl font-bold text-emerald-300">
                      {totalHadirPax}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-emerald-200/70">
                      Estimasi Pax Hadir
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#C8A25A]/40 bg-[#C8A25A]/15 p-3 text-center">
                    <p className="tabular-nums-editorial text-xl font-bold text-[#E8CD93]">
                      {totalCheckedIn}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-[#E8CD93]/80">
                      Sudah Check-In QR
                    </p>
                  </div>
                </div>

                {/* Live QR Verification / Check-in Box */}
                <div className="space-y-2 rounded-xl border border-[#C8A25A]/40 bg-[#C8A25A]/10 p-3.5">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-[#E8CD93]">
                    <QrCode className="h-4 w-4" />
                    Verifikasi / Scan Kode QR Tamu di Meja Penerima Tamu
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={checkInInput}
                      onChange={(e) => setCheckInInput(e.target.value)}
                      placeholder="Masukkan Kode QR (misal: MN-YN-A801) atau Nama..."
                      className="flex-1 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-xs text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleCheckInGuest(checkInInput)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-500"
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      Check-In
                    </button>
                  </div>
                </div>

                {/* Add New Guests with Unique QR */}
                <div className="space-y-2.5 rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <p className="text-xs font-bold text-[#E8CD93]">
                    + Tambah Tamu &amp; Buat Kode QR Unik Otomatis
                  </p>
                  <textarea
                    rows={3}
                    value={newGuestNames}
                    onChange={(e) => setNewGuestNames(e.target.value)}
                    placeholder="Ketik daftar nama tamu (1 nama per baris)..."
                    className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGuestCategory}
                      onChange={(e) => setNewGuestCategory(e.target.value)}
                      placeholder="Kategori (Keluarga / VIP / Sahabat)"
                      className="flex-1 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddGuestsToDb}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#C8A25A] px-4 py-2 text-xs font-bold text-[#1B1110]"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Simpan &amp; Buat QR
                    </button>
                  </div>
                </div>

                {/* Guest List Search & Table */}
                <div className="space-y-2.5">
                  <div className="relative flex items-center">
                    <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-white/50" />
                    <input
                      type="text"
                      value={guestSearch}
                      onChange={(e) => setGuestSearch(e.target.value)}
                      placeholder="Cari nama tamu atau kode QR..."
                      className="w-full rounded-lg border border-white/15 bg-black/30 py-2 pl-8 pr-3 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    {filteredGuests.map((g) => (
                      <div
                        key={g.id}
                        className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-bold text-white">
                                {g.name}
                              </span>
                              <span className="rounded bg-[#C8A25A]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[#E8CD93]">
                                {g.code}
                              </span>
                              {g.phone ? (
                                <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[9px] text-emerald-300">
                                  <Phone className="h-2.5 w-2.5" />+{g.phone}
                                </span>
                              ) : null}
                              {g.waSent ? (
                                <span className="inline-flex items-center gap-0.5 rounded bg-sky-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-sky-300">
                                  <CheckCheck className="h-2.5 w-2.5" />
                                  Terkirim WA
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-0.5 text-[10px] text-white/60">
                              {g.category} • RSVP:{" "}
                              <strong className="uppercase text-white/85">
                                {g.rsvpStatus} ({g.pax} org)
                              </strong>
                            </p>
                          </div>

                          {g.checkedIn ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" />
                              Hadir di Lokasi
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleCheckInGuest(g.code)}
                              className="rounded-full border border-emerald-500/50 bg-emerald-950/50 px-2.5 py-1 text-[10px] font-semibold text-emerald-300 hover:bg-emerald-900"
                            >
                              Tandai Check-In
                            </button>
                          )}
                        </div>

                        {g.message ? (
                          <p className="mt-1.5 rounded bg-black/25 px-2.5 py-1.5 text-[11px] italic text-white/75">
                            “{g.message}”
                          </p>
                        ) : null}

                        <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2">
                          <span className="truncate text-[10px] text-white/45 max-w-[210px]">
                            {buildGuestUrl(g.name, g.code)}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                void navigator.clipboard.writeText(
                                  buildGuestUrl(g.name, g.code)
                                );
                                setCopiedGuestCode(g.code);
                                setTimeout(() => setCopiedGuestCode(null), 2000);
                              }}
                              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-white/20"
                            >
                              {copiedGuestCode === g.code ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                              Link QR
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendGuestWa(g)}
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-emerald-500"
                            >
                              Kirim WA
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {/* TAB 6: REKAPAN TRANSFER TANDA KASIH PENGANTIN */}
            {activeTab === "transfer" ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#E8CD93]">
                      Rekapan Transfer Tanda Kasih
                    </h2>
                    <p className="text-[11px] text-white/60">
                      Daftar tamu yang melakukan transfer QRIS / VA langsung di website
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportTransfersCsv}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#C8A25A] bg-[#C8A25A]/15 px-3 py-1.5 text-[11px] font-bold text-[#E8CD93]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    CSV
                  </button>
                </div>

                {/* Total Nominal Card */}
                <div className="rounded-2xl border border-[#C8A25A]/50 bg-gradient-to-br from-[#2B1218] to-[#160A0D] p-4 shadow-lg">
                  <p className="font-display text-[10px] uppercase tracking-[0.2em] text-[#E8CD93]">
                    Total Tanda Kasih Tercatat
                  </p>
                  <p className="tabular-nums-editorial mt-1 font-serif text-3xl font-bold text-white">
                    {formatRupiah(totalTransferAmount)}
                  </p>
                  <p className="mt-1 text-xs text-white/65">
                    Dari <strong>{transfers.length}</strong> transaksi konfirmasi
                    transfer tamu
                  </p>
                </div>

                {/* Transfer Records List */}
                <div className="space-y-2.5">
                  {transfers.map((trx) => (
                    <div
                      key={trx.id}
                      className="rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-white">
                            {trx.senderName}
                          </p>
                          <p className="tabular-nums-editorial mt-0.5 text-base font-extrabold text-[#E8CD93]">
                            {formatRupiah(trx.amount)}
                          </p>
                          <p className="mt-0.5 text-[11px] text-white/65">
                            Metode: <strong>{trx.method}</strong> • Ref:{" "}
                            <span className="font-mono">
                              {trx.referenceCode}
                            </span>
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          {trx.status === "terverifikasi" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                              <CheckCircle2 className="h-3 w-3" />
                              Terverifikasi
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleVerifyTransfer(trx.id)}
                              className="rounded-full bg-[#C8A25A] px-2.5 py-1 text-[10px] font-bold text-[#1B1110]"
                            >
                              Verifikasi Diterima
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteTransfer(trx.id)}
                            className="text-[10px] text-red-400 hover:underline"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>

                      {trx.message ? (
                        <p className="mt-2 rounded bg-black/25 px-2.5 py-1.5 text-[11px] italic text-white/75">
                          “{trx.message}”
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* TAB 7: PASAMBAHAN & CERITA */}
            {activeTab === "cerita" ? (
              <div className="space-y-5">
                <h2 className="font-serif text-xl font-semibold text-[#E8CD93]">
                  Pasambahan, Ayat &amp; Kisah Cinta
                </h2>

                <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <label className="mb-1 block text-[11px] text-white/70">
                      Pepatah / Pasambahan Minang
                    </label>
                    <textarea
                      rows={2}
                      value={config.pasambahan.minangPantun}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          pasambahan: {
                            ...config.pasambahan,
                            minangPantun: e.target.value,
                          },
                        })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-white/70">
                      Kutipan Ayat / Doa
                    </label>
                    <textarea
                      rows={3}
                      value={config.pasambahan.quoteText}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          pasambahan: {
                            ...config.pasambahan,
                            quoteText: e.target.value,
                          },
                        })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-white/70">
                      Sumber Ayat
                    </label>
                    <input
                      type="text"
                      value={config.pasambahan.quoteSource}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          pasambahan: {
                            ...config.pasambahan,
                            quoteSource: e.target.value,
                          },
                        })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* Love Story */}
                <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E8CD93]">
                      Kisah Cinta (Love Story)
                    </span>
                    <input
                      type="checkbox"
                      checked={config.loveStory.enabled}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          loveStory: {
                            ...config.loveStory,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4 accent-[#C8A25A]"
                    />
                  </div>

                  {config.loveStory.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="space-y-2 rounded-lg border border-white/10 bg-black/25 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => {
                            const nextItems = [...config.loveStory.items];
                            nextItems[idx] = { ...item, year: e.target.value };
                            updateLocalCache({
                              ...config,
                              loveStory: {
                                ...config.loveStory,
                                items: nextItems,
                              },
                            });
                          }}
                          className="w-1/3 rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-[#E8CD93]"
                        />
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const nextItems = [...config.loveStory.items];
                            nextItems[idx] = { ...item, title: e.target.value };
                            updateLocalCache({
                              ...config,
                              loveStory: {
                                ...config.loveStory,
                                items: nextItems,
                              },
                            });
                          }}
                          className="flex-1 rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-white"
                        />
                      </div>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => {
                          const nextItems = [...config.loveStory.items];
                          nextItems[idx] = {
                            ...item,
                            description: e.target.value,
                          };
                          updateLocalCache({
                            ...config,
                            loveStory: {
                              ...config.loveStory,
                              items: nextItems,
                            },
                          });
                        }}
                        className="w-full rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-white/80"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* TAB 8: BUSANA & LIVE STREAMING */}
            {activeTab === "busana" ? (
              <div className="space-y-5">
                <h2 className="font-serif text-xl font-semibold text-[#E8CD93]">
                  Panduan Busana &amp; Live Streaming
                </h2>

                <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E8CD93]">
                      Panduan Busana (Dress Code)
                    </span>
                    <input
                      type="checkbox"
                      checked={config.dressCode.enabled}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          dressCode: {
                            ...config.dressCode,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4 accent-[#C8A25A]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-white/70">
                      Busana Wanita
                    </label>
                    <input
                      type="text"
                      value={config.dressCode.womenAttire}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          dressCode: {
                            ...config.dressCode,
                            womenAttire: e.target.value,
                          },
                        })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-white/70">
                      Busana Pria
                    </label>
                    <input
                      type="text"
                      value={config.dressCode.menAttire}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          dressCode: {
                            ...config.dressCode,
                            menAttire: e.target.value,
                          },
                        })
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E8CD93]">
                      Siaran Langsung (Live Streaming)
                    </span>
                    <input
                      type="checkbox"
                      checked={config.liveStreaming.enabled}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          liveStreaming: {
                            ...config.liveStreaming,
                            enabled: e.target.checked,
                          },
                        })
                      }
                      className="h-4 w-4 accent-[#C8A25A]"
                    />
                  </div>
                  <input
                    type="text"
                    value={config.liveStreaming.platform}
                    onChange={(e) =>
                      updateLocalCache({
                        ...config,
                        liveStreaming: {
                          ...config.liveStreaming,
                          platform: e.target.value,
                        },
                      })
                    }
                    placeholder="Platform (Instagram / YouTube)"
                    className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={config.liveStreaming.url}
                    onChange={(e) =>
                      updateLocalCache({
                        ...config,
                        liveStreaming: {
                          ...config.liveStreaming,
                          url: e.target.value,
                        },
                      })
                    }
                    placeholder="https://..."
                    className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            ) : null}

            {/* TAB 9: REKENING & QRIS */}
            {activeTab === "hadiah" ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-xl font-semibold text-[#E8CD93]">
                    Pengaturan Rekening &amp; QRIS
                  </h2>
                  <input
                    type="checkbox"
                    checked={config.gifts.enabled}
                    onChange={(e) =>
                      updateLocalCache({
                        ...config,
                        gifts: { ...config.gifts, enabled: e.target.checked },
                      })
                    }
                    className="h-4 w-4 accent-[#C8A25A]"
                  />
                </div>

                {/* Upload Custom Static QRIS */}
                <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <p className="text-xs font-bold text-[#E8CD93]">
                    Gambar QRIS Bank / Merchant (Opsional)
                  </p>
                  <p className="text-[11px] text-white/60">
                    Jika dikosongkan, website otomatis menampilkan QRIS dinamis berdasarkan nominal tamu.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#C8A25A] px-3 py-1.5 text-[11px] font-bold text-[#1B1110]">
                      <Upload className="h-3.5 w-3.5" />
                      Upload QRIS
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            void uploadAsset(file, "qris", (url) =>
                              updateLocalCache({
                                ...config,
                                gifts: { ...config.gifts, qrisImage: url },
                              })
                            );
                          }
                        }}
                      />
                    </label>
                    <input
                      type="text"
                      value={config.gifts.qrisImage}
                      onChange={(e) =>
                        updateLocalCache({
                          ...config,
                          gifts: { ...config.gifts, qrisImage: e.target.value },
                        })
                      }
                      placeholder="Atau URL gambar QRIS..."
                      className="flex-1 rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {config.gifts.bankAccounts.map((acc, idx) => (
                    <div
                      key={acc.id}
                      className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#E8CD93]">
                          Rekening #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateLocalCache({
                              ...config,
                              gifts: {
                                ...config.gifts,
                                bankAccounts: config.gifts.bankAccounts.filter(
                                  (_, i) => i !== idx
                                ),
                              },
                            })
                          }
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={acc.bankName}
                        onChange={(e) => {
                          const next = [...config.gifts.bankAccounts];
                          next[idx] = { ...acc, bankName: e.target.value };
                          updateLocalCache({
                            ...config,
                            gifts: { ...config.gifts, bankAccounts: next },
                          });
                        }}
                        placeholder="Nama Bank / E-Wallet"
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={acc.accountNumber}
                        onChange={(e) => {
                          const next = [...config.gifts.bankAccounts];
                          next[idx] = { ...acc, accountNumber: e.target.value };
                          updateLocalCache({
                            ...config,
                            gifts: { ...config.gifts, bankAccounts: next },
                          });
                        }}
                        placeholder="Nomor Rekening"
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={acc.accountHolder}
                        onChange={(e) => {
                          const next = [...config.gifts.bankAccounts];
                          next[idx] = { ...acc, accountHolder: e.target.value };
                          updateLocalCache({
                            ...config,
                            gifts: { ...config.gifts, bankAccounts: next },
                          });
                        }}
                        placeholder="Atas Nama"
                        className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* TAB 10: IMPORT EXCEL & GENERATOR ANTREAN SEBAR WA MASSAL */}
            {activeTab === "tamu" ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="font-serif text-xl font-semibold text-[#E8CD93]">
                      Import Excel &amp; Sebar WA Cepat
                    </h2>
                    <p className="text-[11px] text-white/60">
                      Unggah Excel (.xlsx/.csv) atau paste kolom Excel -&gt; antrean kirim 1-klik langsung ke chat WA tamu.
                    </p>
                  </div>
                </div>

                {/* LANGKAH 1: IMPORT EXCEL / CSV / PASTE EXCEL */}
                <div className="space-y-3 rounded-xl border border-[#C8A25A]/35 bg-[#C8A25A]/10 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#E8CD93]">
                      <FileSpreadsheet className="h-4 w-4" />
                      1. Import Daftar Tamu &amp; Nomor WA
                    </span>
                    <button
                      type="button"
                      onClick={() => void handleDownloadExcelTemplate()}
                      className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-white/20"
                    >
                      <Download className="h-3 w-3" />
                      Template Excel
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      ref={excelUploadInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv,.ods"
                      onChange={handleImportExcelFile}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={excelImporting}
                      onClick={() => excelUploadInputRef.current?.click()}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#C8A25A] px-3 py-2 text-xs font-bold text-[#1B1110] shadow-md transition hover:brightness-105 disabled:opacity-60"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {excelImporting
                        ? "Mengimpor Excel..."
                        : "Upload File Excel (.xlsx / .csv)"}
                    </button>
                  </div>

                  {excelImportSummary ? (
                    <p className="rounded-lg border border-emerald-500/35 bg-emerald-950/50 px-3 py-2 text-[11px] font-medium text-emerald-300">
                      {excelImportSummary}
                    </p>
                  ) : null}

                  <div className="border-t border-white/10 pt-2.5">
                    <label className="mb-1 block text-[11px] font-semibold text-white/80">
                      Atau Paste Langsung dari Excel / Ketik Cepat (Nama [Tab/Koma] No. WA [Tab/Koma] Kategori)
                    </label>
                    <textarea
                      rows={3}
                      value={guestBulkText}
                      onChange={(e) => setGuestBulkText(e.target.value)}
                      placeholder={
                        "Contoh paste 2-3 kolom Excel atau ketik cepat:\nBapak H. Ahmad\t081234567890\tKeluarga\nDatuak Rajo Alam, +6281398765432, Ninik Mamak\nSahabat Kampus"
                      }
                      className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-xs text-white placeholder:text-white/35"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={newGuestCategory}
                        onChange={(e) => setNewGuestCategory(e.target.value)}
                        placeholder="Kategori default"
                        className="w-36 rounded-lg border border-white/15 bg-black/35 px-2.5 py-1.5 text-xs text-white"
                      />
                      <button
                        type="button"
                        disabled={
                          excelImporting || pastedPreviewEntries.length === 0
                        }
                        onClick={() => void handleImportPastedGuests()}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Masukkan ke Daftar Kirim ({pastedPreviewEntries.length})
                      </button>
                    </div>
                  </div>
                </div>

                {/* LANGKAH 2: TEMPLATE PESAN WHATSAPP */}
                <div className="space-y-2 rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#E8CD93]">
                      <MessageSquareText className="h-4 w-4" />
                      2. Template Pesan Pengantar WhatsApp
                    </span>
                    <button
                      type="button"
                      onClick={() => updateWaTemplate(DEFAULT_WA_TEMPLATE)}
                      className="inline-flex items-center gap-1 text-[10px] text-white/65 hover:text-white"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={waTemplate}
                    onChange={(e) => updateWaTemplate(e.target.value)}
                    className="w-full rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-[11px] leading-relaxed text-white"
                  />

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-1">
                      {["{nama}", "{link}", "{pasangan}", "{tanggal}", "{kode_qr}"].map(
                        (token) => (
                          <button
                            key={token}
                            type="button"
                            onClick={() =>
                              updateWaTemplate(`${waTemplate} ${token}`)
                            }
                            className="rounded border border-white/15 bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-[#E8CD93] hover:bg-white/20"
                          >
                            {token}
                          </button>
                        )
                      )}
                    </div>
                    <label className="flex items-center gap-1.5 text-[10px] text-white/80">
                      <input
                        type="checkbox"
                        checked={includeQrCodeInWa}
                        onChange={(e) => setIncludeQrCodeInWa(e.target.checked)}
                        className="accent-[#C8A25A]"
                      />
                      Sertakan Kode QR Tamu
                    </label>
                  </div>
                </div>

                {/* LANGKAH 3: ANTREAN KIRIM 1-KLIK & DAFTAR LINK */}
                <div className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#E8CD93]">
                      3. Antrean Sebar WhatsApp ({waSentCount}/{guests.length}{" "}
                      Terkirim)
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAllGuestLinks}
                      className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-white/20"
                    >
                      {copiedAllLinks ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          Semua Disalin!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Salin Semua Link ({waQueueGuests.length})
                        </>
                      )}
                    </button>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/40">
                    <div
                      className="h-full bg-gradient-to-r from-[#C8A25A] to-emerald-400 transition-all duration-300"
                      style={{
                        width: `${
                          guests.length > 0
                            ? Math.round((waSentCount / guests.length) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  {/* Giant 1-Click Send Next Guest Button */}
                  {nextUnsentGuest ? (
                    <button
                      type="button"
                      onClick={() => handleSendGuestWa(nextUnsentGuest)}
                      className="flex w-full items-center justify-between gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2.5 text-left text-xs font-bold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99]"
                    >
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-emerald-100">
                          Kirim Cepat Berikutnya ({waUnsentCount} tersisa)
                        </p>
                        <p className="truncate text-sm font-bold">
                          {nextUnsentGuest.name}{" "}
                          {nextUnsentGuest.phone
                            ? `(+${nextUnsentGuest.phone})`
                            : "(Pilih Kontak di WA)"}
                        </p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black/25 px-3 py-1 text-[11px]">
                        Buka WA
                        <SkipForward className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  ) : guests.length > 0 ? (
                    <div className="rounded-xl border border-emerald-500/35 bg-emerald-950/40 px-3 py-2 text-center text-xs font-semibold text-emerald-300">
                      Seluruh {guests.length} tamu sudah ditandai Terkirim WA!
                    </div>
                  ) : null}

                  {/* Filter Tabs & Search */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(
                      [
                        { id: "all", label: `Semua (${guests.length})` },
                        { id: "unsent", label: `Belum (${waUnsentCount})` },
                        { id: "sent", label: `Terkirim (${waSentCount})` },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setWaFilter(f.id)}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold transition ${
                          waFilter === f.id
                            ? "bg-[#C8A25A] text-[#1B1110]"
                            : "bg-white/10 text-white/75 hover:bg-white/20"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative flex items-center">
                    <Search className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-white/50" />
                    <input
                      type="text"
                      value={waSearch}
                      onChange={(e) => setWaSearch(e.target.value)}
                      placeholder="Cari nama tamu, nomor WA, kategori..."
                      className="w-full rounded-lg border border-white/15 bg-black/30 py-1.5 pl-8 pr-3 text-xs text-white outline-none"
                    />
                  </div>

                  {/* Queue Guest Cards */}
                  <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
                    {waQueueGuests.map((g) => {
                      const guestUrl = buildGuestUrl(
                        g.name,
                        includeQrCodeInWa ? g.code : undefined
                      );
                      const isNext = nextUnsentGuest?.id === g.id;
                      return (
                        <div
                          key={g.id}
                          className={`rounded-lg border p-2.5 transition ${
                            isNext
                              ? "border-emerald-400/70 bg-emerald-950/25"
                              : g.waSent
                              ? "border-white/10 bg-black/20 opacity-80"
                              : "border-white/15 bg-black/30"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <p className="truncate text-xs font-bold text-white">
                                  {g.name}
                                </p>
                                {g.phone ? (
                                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] text-emerald-300">
                                    +{g.phone}
                                  </span>
                                ) : (
                                  <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] text-amber-300">
                                    Tanpa No. WA
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 truncate text-[10px] text-white/50">
                                {g.category} • {guestUrl}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                void handleToggleGuestWaSent(g, !g.waSent)
                              }
                              title="Ubah status kirim WA"
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold transition ${
                                g.waSent
                                  ? "bg-sky-500/25 text-sky-200 hover:bg-sky-500/40"
                                  : "border border-white/20 bg-white/5 text-white/65 hover:bg-white/15"
                              }`}
                            >
                              {g.waSent ? "✓ Terkirim" : "Belum Kirim"}
                            </button>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center justify-end gap-1.5 border-t border-white/10 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                void navigator.clipboard.writeText(guestUrl);
                                setCopiedGuestCode(g.code);
                                setTimeout(() => setCopiedGuestCode(null), 2000);
                              }}
                              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-white/20"
                            >
                              {copiedGuestCode === g.code ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                              Link
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                void navigator.clipboard.writeText(
                                  buildGuestMessage(g.name, g.code)
                                );
                                setCopiedWaMsgId(g.id);
                                setTimeout(() => setCopiedWaMsgId(null), 2000);
                              }}
                              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-white/20"
                            >
                              {copiedWaMsgId === g.id ? (
                                <Check className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                              Pesan
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSendGuestWa(g)}
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold text-white hover:bg-emerald-500"
                            >
                              <Send className="h-2.5 w-2.5" />
                              {g.phone ? "Kirim ke WA" : "Pilih Kontak WA"}
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteGuest(g)}
                              aria-label={`Hapus ${g.name}`}
                              className="rounded-full p-1 text-red-400/75 hover:bg-red-500/15 hover:text-red-300"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-[10px] leading-relaxed text-white/60">
                    <strong className="text-white/85">Catatan Keamanan WA:</strong>{" "}
                    Tombol kirim di atas membuka chat WhatsApp langsung ke nomor tujuan (`wa.me/628...`) sehingga gratis &amp; aman dari pemblokiran akun. Untuk pengiriman otomatis tanpa klik di background, sistem memerlukan API berbayar pihak ketiga (WhatsApp Business Gateway).
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
