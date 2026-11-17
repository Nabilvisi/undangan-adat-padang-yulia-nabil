"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  QrCode,
  Send,
  ShieldCheck,
} from "lucide-react";
import { MinangThemePalette } from "@/lib/themes";
import { BankAccount } from "@/types/wedding";

interface DirectTransferPanelProps {
  guestName: string;
  guestCode: string;
  coupleTitle: string;
  bankAccounts: BankAccount[];
  qrisImage?: string;
  theme: MinangThemePalette;
}

const NOMINAL_PRESETS = [100000, 250000, 500000, 1000000];

const PAYMENT_CHANNELS = [
  {
    id: "qris",
    label: "QRIS Instan (Semua Bank / E-Wallet)",
    prefix: "QRIS-YN-",
    type: "qris" as const,
  },
  {
    id: "va-nagari",
    label: "Virtual Account Bank Nagari",
    prefix: "77012100",
    type: "va" as const,
  },
  {
    id: "va-bca",
    label: "Virtual Account BCA",
    prefix: "39010812",
    type: "va" as const,
  },
  {
    id: "va-mandiri",
    label: "Virtual Account Bank Mandiri",
    prefix: "89022026",
    type: "va" as const,
  },
  {
    id: "va-bsi",
    label: "Virtual Account BSI / BRI",
    prefix: "90041220",
    type: "va" as const,
  },
];

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function DirectTransferPanel({
  guestName,
  guestCode,
  coupleTitle,
  qrisImage,
  theme,
}: DirectTransferPanelProps) {
  const [senderName, setSenderName] = useState(
    guestName && guestName !== "Bapak / Ibu / Saudara/i" ? guestName : ""
  );
  const [amount, setAmount] = useState<number>(250000);
  const [selectedChannel, setSelectedChannel] = useState(PAYMENT_CHANNELS[0]);
  const [message, setMessage] = useState("");
  const [qrisDataUrl, setQrisDataUrl] = useState<string>("");
  const [copiedVa, setCopiedVa] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<{
    referenceCode: string;
    senderName: string;
    amount: number;
    method: string;
  } | null>(null);

  useEffect(() => {
    if (
      guestName &&
      guestName !== "Bapak / Ibu / Saudara/i" &&
      !senderName
    ) {
      setSenderName(guestName);
    }
  }, [guestName, senderName]);

  // Deterministic digits from guestCode for VA & Reference
  const suffixDigits = guestCode
    .replace(/\D/g, "")
    .padEnd(4, "8")
    .slice(0, 4);

  const generatedVaOrRef =
    selectedChannel.type === "qris"
      ? `${selectedChannel.prefix}${suffixDigits}`
      : `${selectedChannel.prefix}${suffixDigits}${String(amount).slice(0, 3)}`;

  useEffect(() => {
    const qrisPayload = JSON.stringify({
      merchant: `TANDA KASIH ${coupleTitle.toUpperCase()}`,
      ref: generatedVaOrRef,
      amount,
      sender: senderName || guestName,
    });
    void QRCode.toDataURL(qrisPayload, {
      width: 240,
      margin: 1,
      color: {
        dark: "#1B1110",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrisDataUrl(url))
      .catch(() => setQrisDataUrl(""));
  }, [generatedVaOrRef, amount, senderName, guestName, coupleTitle]);

  const handleCopyVa = () => {
    void navigator.clipboard.writeText(generatedVaOrRef);
    setCopiedVa(true);
    setTimeout(() => setCopiedVa(false), 2000);
  };

  const handleConfirmTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSender = (senderName || guestName || "Tamu Kehormatan").trim();
    if (!finalSender || amount <= 0) return;

    setSubmitting(true);
    const refCode = `TRX-MN-${suffixDigits}-${Math.floor(100 + Math.random() * 899)}`;
    try {
      await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceCode: refCode,
          senderName: finalSender,
          guestCode,
          amount,
          method: selectedChannel.label,
          vaOrAccountNumber: generatedVaOrRef,
          message,
        }),
      });
      setReceipt({
        referenceCode: refCode,
        senderName: finalSender,
        amount,
        method: selectedChannel.label,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="mt-5 rounded-xl p-4 text-left shadow-sm"
      style={{
        backgroundColor: theme.cardBgAlt,
        border: `1.5px solid ${theme.accentGold}88`,
      }}
    >
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: `${theme.accentGold}44` }}>
        <div>
          <span
            className="font-display text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: theme.accentGoldDark }}
          >
            Transfer Langsung di Website
          </span>
          <h4 className="font-serif text-xl font-bold">
            QRIS Dinamis &amp; Virtual Account
          </h4>
        </div>
        <ShieldCheck
          className="h-6 w-6 shrink-0"
          style={{ color: theme.accentGoldDark }}
        />
      </div>

      {receipt ? (
        <div
          className="mt-4 rounded-xl p-4 text-center"
          style={{
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.accentGold}`,
          }}
        >
          <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-600" />
          <p className="mt-2 font-serif text-xl font-bold">
            Tanda Kasih Tercatat!
          </p>
          <p
            className="mt-1 text-xs"
            style={{ color: theme.textOnCardMuted }}
          >
            Terima kasih <strong>{receipt.senderName}</strong>. Konfirmasi
            tanda kasih sebesar{" "}
            <strong className="tabular-nums-editorial">
              {formatRupiah(receipt.amount)}
            </strong>{" "}
            melalui <strong>{receipt.method}</strong> telah diterima di
            dashboard pengantin.
          </p>
          <p className="mt-2 inline-block rounded-full bg-emerald-600/15 px-3 py-1 text-[10px] font-bold text-emerald-700">
            Kode Ref: {receipt.referenceCode}
          </p>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setReceipt(null)}
              className="text-[11px] font-semibold underline"
              style={{ color: theme.accentGoldDark }}
            >
              Kirim Tanda Kasih Lainnya
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleConfirmTransfer} className="mt-4 space-y-3.5">
          {/* 1. Nominal Selector */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider">
              1. Pilih atau Masukkan Nominal Tanda Kasih
            </label>
            <div className="grid grid-cols-2 gap-2">
              {NOMINAL_PRESETS.map((preset) => {
                const active = amount === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className="tabular-nums-editorial rounded-lg py-2 text-xs font-bold transition"
                    style={{
                      backgroundColor: active
                        ? theme.accentPrimary
                        : theme.cardBg,
                      color: active
                        ? theme.accentPrimaryText
                        : theme.textOnCard,
                      border: `1px solid ${
                        active ? theme.accentGold : `${theme.accentGold}55`
                      }`,
                    }}
                  >
                    {formatRupiah(preset)}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 flex items-center rounded-lg px-3 py-2" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.accentGold}66` }}>
              <span className="mr-2 text-xs font-bold">Rp</span>
              <input
                type="number"
                min={10000}
                step={10000}
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                className="tabular-nums-editorial w-full bg-transparent text-xs font-bold outline-none"
                style={{ color: theme.textOnCard }}
              />
            </div>
          </div>

          {/* 2. Payment Channel Selector */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider">
              2. Pilih Metode Transfer (QRIS / Kode VA)
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {PAYMENT_CHANNELS.map((ch) => {
                const active = selectedChannel.id === ch.id;
                return (
                  <button
                    key={ch.id}
                    type="button"
                    onClick={() => setSelectedChannel(ch)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition"
                    style={{
                      backgroundColor: active
                        ? `${theme.accentGold}2E`
                        : theme.cardBg,
                      border: `1px solid ${
                        active ? theme.accentGold : `${theme.accentGold}44`
                      }`,
                      color: theme.textOnCard,
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {ch.type === "qris" ? (
                        <QrCode className="h-3.5 w-3.5" style={{ color: theme.accentGoldDark }} />
                      ) : (
                        <CreditCard className="h-3.5 w-3.5" style={{ color: theme.accentGoldDark }} />
                      )}
                      {ch.label}
                    </span>
                    {active ? (
                      <span className="rounded-full bg-[#C8A25A] px-2 py-0.5 text-[9px] font-bold text-[#1B1110]">
                        Dipilih
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic QRIS or VA Display Box */}
          <div
            className="rounded-xl p-3.5 text-center"
            style={{
              backgroundColor: theme.cardBg,
              border: `1px dashed ${theme.accentGold}`,
            }}
          >
            {selectedChannel.type === "qris" ? (
              <div className="flex flex-col items-center">
                <p
                  className="font-display text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: theme.accentGoldDark }}
                >
                  Scan QRIS Nominal {formatRupiah(amount)}
                </p>
                <div className="mt-2 rounded-xl border border-stone-200 bg-white p-2.5 shadow-sm">
                  <img
                    src={qrisImage || qrisDataUrl}
                    alt="QRIS Transfer Langsung"
                    className="h-36 w-36 object-contain"
                  />
                </div>
                <p
                  className="mt-1.5 text-[10px]"
                  style={{ color: theme.textOnCardMuted }}
                >
                  Mendukung Mobile Banking, GoPay, DANA, OVO, ShopeePay &amp; LinkAja
                </p>
              </div>
            ) : (
              <div>
                <p
                  className="font-display text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: theme.accentGoldDark }}
                >
                  Nomor Kode {selectedChannel.label}
                </p>
                <p className="tabular-nums-editorial mt-1.5 text-lg font-extrabold tracking-widest">
                  {generatedVaOrRef}
                </p>
                <p
                  className="mt-0.5 text-[11px]"
                  style={{ color: theme.textOnCardMuted }}
                >
                  Nominal Tagihan:{" "}
                  <strong className="tabular-nums-editorial">
                    {formatRupiah(amount)}
                  </strong>
                </p>
                <button
                  type="button"
                  onClick={handleCopyVa}
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-semibold text-white"
                  style={{
                    backgroundColor: copiedVa ? "#1B6B42" : theme.accentPrimary,
                  }}
                >
                  {copiedVa ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Kode VA Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Salin Kode VA
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* 3. Sender Name & Confirmation */}
          <div className="space-y-2.5 pt-1">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider">
                3. Nama Pengirim (Agar Tercatat di Rekapan Pengantin)
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Nama lengkap Anda / Keluarga..."
                className="w-full rounded-lg px-3 py-2 text-xs outline-none"
                style={{
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.accentGold}66`,
                  color: theme.textOnCard,
                }}
              />
            </div>

            <div>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Catatan / pesan tanda kasih (opsional)..."
                className="w-full rounded-lg px-3 py-2 text-xs outline-none"
                style={{
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.accentGold}66`,
                  color: theme.textOnCard,
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-bold uppercase tracking-[0.16em] shadow-md transition hover:opacity-90 disabled:opacity-60"
              style={{
                backgroundColor: theme.accentPrimary,
                color: theme.accentPrimaryText,
              }}
            >
              <Send className="h-3.5 w-3.5" />
              {submitting
                ? "Mencatat Konfirmasi..."
                : "Konfirmasi Sudah Transfer"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
