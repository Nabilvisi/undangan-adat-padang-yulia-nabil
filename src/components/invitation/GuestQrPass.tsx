"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { CheckCircle2, Download, QrCode, Sparkles, UserCheck } from "lucide-react";
import { MinangThemePalette } from "@/lib/themes";

interface GuestQrPassProps {
  guestName: string;
  guestCode?: string;
  coupleTitle: string;
  dateDisplay: string;
  theme: MinangThemePalette;
}

export function deriveDeterministicGuestCode(
  guestName: string,
  explicitCode?: string
): string {
  if (explicitCode && explicitCode.trim()) return explicitCode.trim().toUpperCase();
  const clean = (guestName || "TAMU")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, "X");
  let hash = 0;
  for (let i = 0; i < guestName.length; i++) {
    hash = (hash * 31 + guestName.charCodeAt(i)) % 9000;
  }
  const num = String(1000 + Math.abs(hash)).slice(0, 4);
  return `MN-${clean}-${num}`;
}

export function GuestQrPass({
  guestName,
  guestCode,
  coupleTitle,
  dateDisplay,
  theme,
}: GuestQrPassProps) {
  const resolvedCode = deriveDeterministicGuestCode(guestName, guestCode);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    const payload = JSON.stringify({
      type: "BARALEK_GADANG_PASS",
      code: resolvedCode,
      guest: guestName,
      wedding: coupleTitle,
    });

    void QRCode.toDataURL(payload, {
      width: 260,
      margin: 1,
      color: {
        dark: "#1B1110",
        light: "#FBF6EC",
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => setQrDataUrl(""));
  }, [resolvedCode, guestName, coupleTitle]);

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `QR-Pass-${resolvedCode}.png`;
    a.click();
  };

  const handleSelfCheckIn = async () => {
    setCheckingIn(true);
    try {
      const res = await fetch("/api/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "checkin",
          code: resolvedCode,
          name: guestName,
          pax: 2,
        }),
      });
      if (res.ok) {
        setCheckedIn(true);
      }
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl p-5 text-center shadow-md"
      style={{
        backgroundColor: theme.cardBgAlt,
        border: `1.5px solid ${theme.accentGold}88`,
      }}
    >
      <div className="flex items-center justify-center gap-1.5">
        <QrCode
          className="h-4 w-4"
          style={{ color: theme.accentGoldDark }}
        />
        <span
          className="font-display text-[10px] font-bold uppercase tracking-[0.22em]"
          style={{ color: theme.accentGoldDark }}
        >
          QR Penerima Tamu • Akses Personal
        </span>
      </div>

      <h4 className="mt-1 font-serif text-2xl font-bold">
        Kartu Akses Baralek Gadang
      </h4>
      <p
        className="mt-1 text-xs"
        style={{ color: theme.textOnCardMuted }}
      >
        Tunjukkan QR Code unik ini pada meja penerima tamu saat tiba di lokasi acara
      </p>

      {/* QR Code Badge */}
      <div className="my-4 flex flex-col items-center">
        <div
          className="relative inline-block rounded-2xl p-3 shadow-lg"
          style={{
            backgroundColor: "#FBF6EC",
            border: `2px solid ${theme.accentGold}`,
          }}
        >
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Pass ${guestName}`}
              className="h-40 w-40 rounded-lg object-contain"
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center text-xs text-stone-500">
              Membuat QR...
            </div>
          )}
        </div>

        <div
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[11px] font-bold tracking-widest tabular-nums-editorial"
          style={{
            backgroundColor: `${theme.accentGold}28`,
            color: theme.textOnCard,
            border: `1px solid ${theme.accentGold}77`,
          }}
        >
          <Sparkles className="h-3 w-3" style={{ color: theme.accentGoldDark }} />
          ID TAMU: {resolvedCode}
        </div>
      </div>

      {/* Guest Info Ticket Footer */}
      <div
        className="rounded-lg px-3.5 py-2.5 text-xs"
        style={{
          backgroundColor: theme.cardBg,
          border: `1px dashed ${theme.accentGold}66`,
        }}
      >
        <p
          className="text-[10px] uppercase tracking-[0.16em]"
          style={{ color: theme.textOnCardMuted }}
        >
          Tamu Undangan
        </p>
        <p className="mt-0.5 font-serif text-lg font-bold">{guestName}</p>
        <p
          className="mt-0.5 text-[11px]"
          style={{ color: theme.textOnCardMuted }}
        >
          {coupleTitle} • {dateDisplay}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleDownloadQr}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold transition hover:opacity-90"
          style={{
            border: `1px solid ${theme.accentGold}`,
            color: theme.textOnCard,
          }}
        >
          <Download className="h-3.5 w-3.5" />
          Simpan QR Code
        </button>

        <button
          type="button"
          onClick={handleSelfCheckIn}
          disabled={checkedIn || checkingIn}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-semibold transition hover:opacity-90 disabled:opacity-75"
          style={{
            backgroundColor: checkedIn ? "#1B6B42" : theme.accentPrimary,
            color: "#FFFFFF",
          }}
        >
          {checkedIn ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Tercatat Hadir (Checked-In)
            </>
          ) : (
            <>
              <UserCheck className="h-3.5 w-3.5" />
              {checkingIn ? "Memproses..." : "Check-In Kehadiran"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
