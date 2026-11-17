"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
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

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

/**
 * QR Code (QRIS) & Real Bank Account Transfer + Instant Confirmation Panel.
 * Uses only QR Code & the couple's actual bank accounts (no fake/dummy VA numbers),
 * and records every guest's transfer confirmation into the couple's Studio dashboard.
 */
export function DirectTransferPanel({
  guestName,
  guestCode,
  coupleTitle,
  bankAccounts,
  qrisImage,
  theme,
}: DirectTransferPanelProps) {
  const [senderName, setSenderName] = useState(
    guestName && guestName !== "Bapak / Ibu / Saudara/i" ? guestName : ""
  );
  const [amount, setAmount] = useState<number>(250000);
  const [selectedMethod, setSelectedMethod] = useState<string>("QR Code (QRIS)");
  const [message, setMessage] = useState("");
  const [qrisDataUrl, setQrisDataUrl] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
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

  const suffixDigits = guestCode
    .replace(/\D/g, "")
    .padEnd(4, "8")
    .slice(0, 4);

  const primaryBank = bankAccounts[0];

  useEffect(() => {
    const qrPayload = JSON.stringify({
      tujuan: `Tanda Kasih Pernikahan ${coupleTitle}`,
      rekening: primaryBank
        ? `${primaryBank.bankName} ${primaryBank.accountNumber} a.n. ${primaryBank.accountHolder}`
        : coupleTitle,
      nominal: amount,
      pengirim: senderName || guestName,
    });
    void QRCode.toDataURL(qrPayload, {
      width: 260,
      margin: 1,
      color: {
        dark: "#1B1110",
        light: "#FFFFFF",
      },
    })
      .then((url) => setQrisDataUrl(url))
      .catch(() => setQrisDataUrl(""));
  }, [amount, senderName, guestName, coupleTitle, primaryBank]);

  const displayQrSrc = qrisImage || qrisDataUrl;

  const handleDownloadQr = () => {
    if (!displayQrSrc) return;
    const a = document.createElement("a");
    a.href = displayQrSrc;
    a.download = `QR-Tanda-Kasih-${coupleTitle.replace(/\s+/g, "-")}.png`;
    a.click();
  };

  const handleCopyAccount = (accNumber: string, id: string) => {
    void navigator.clipboard.writeText(accNumber);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
          method: selectedMethod,
          vaOrAccountNumber: primaryBank
            ? `${primaryBank.bankName} (${primaryBank.accountNumber})`
            : "QRIS",
          message,
        }),
      });
      setReceipt({
        referenceCode: refCode,
        senderName: finalSender,
        amount,
        method: selectedMethod,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const methodOptions = [
    "QR Code (QRIS)",
    ...bankAccounts.map((b) => `Transfer ${b.bankName} (${b.accountHolder})`),
  ];

  return (
    <div
      className="mt-5 rounded-xl p-4 text-left shadow-sm"
      style={{
        backgroundColor: theme.cardBgAlt,
        border: `1.5px solid ${theme.accentGold}88`,
      }}
    >
      <div
        className="flex items-center justify-between border-b pb-3"
        style={{ borderColor: `${theme.accentGold}44` }}
      >
        <div>
          <span
            className="font-display text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: theme.accentGoldDark }}
          >
            Amplop Digital &amp; QR Code
          </span>
          <h4 className="font-serif text-xl font-bold">
            Scan QR / Transfer &amp; Konfirmasi
          </h4>
        </div>
        <ShieldCheck
          className="h-6 w-6 shrink-0"
          style={{ color: theme.accentGoldDark }}
        />
      </div>

      {/* 1. QR Code Box */}
      <div
        className="mt-4 flex flex-col items-center rounded-xl p-4 text-center"
        style={{
          backgroundColor: theme.cardBg,
          border: `1px solid ${theme.accentGold}66`,
        }}
      >
        <div className="flex items-center gap-1.5">
          <QrCode
            className="h-4 w-4"
            style={{ color: theme.accentGoldDark }}
          />
          <span
            className="font-display text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: theme.accentGoldDark }}
          >
            Scan QR Code Tanda Kasih
          </span>
        </div>

        <div className="mt-2.5 rounded-2xl border border-stone-200 bg-white p-3 shadow-md">
          {displayQrSrc ? (
            <img
              src={displayQrSrc}
              alt="QR Code Tanda Kasih"
              className="h-44 w-44 object-contain"
            />
          ) : (
            <div className="flex h-44 w-44 items-center justify-center text-xs text-stone-400">
              Memuat QR...
            </div>
          )}
        </div>

        <p
          className="mt-2 text-xs font-semibold"
          style={{ color: theme.textOnCard }}
        >
          a.n. {coupleTitle}
        </p>
        <p
          className="mt-0.5 text-[10px]"
          style={{ color: theme.textOnCardMuted }}
        >
          Scan langsung atau simpan gambar QR untuk diunggah pada aplikasi
          m-Banking / E-Wallet Anda
        </p>

        <button
          type="button"
          onClick={handleDownloadQr}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-semibold transition hover:opacity-90"
          style={{
            border: `1px solid ${theme.accentGold}`,
            color: theme.textOnCard,
          }}
        >
          <Download className="h-3.5 w-3.5" />
          Simpan Gambar QR Code
        </button>
      </div>

      {/* 2. Real Bank Accounts List */}
      {bankAccounts.length > 0 ? (
        <div className="mt-3 space-y-2">
          {bankAccounts.map((acc) => {
            const isCopied = copiedId === acc.id;
            return (
              <div
                key={acc.id}
                className="flex items-center justify-between gap-3 rounded-xl p-3.5"
                style={{
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.accentGold}55`,
                }}
              >
                <div className="min-w-0">
                  <p
                    className="font-display text-[10px] font-bold uppercase tracking-[0.18em]"
                    style={{ color: theme.accentGoldDark }}
                  >
                    {acc.bankName}
                  </p>
                  <p className="tabular-nums-editorial mt-0.5 text-sm font-bold tracking-wide">
                    {acc.accountNumber}
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: theme.textOnCardMuted }}
                  >
                    a.n. {acc.accountHolder}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyAccount(acc.accountNumber, acc.id)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-white transition"
                  style={{
                    backgroundColor: isCopied ? "#1F6E43" : theme.accentPrimary,
                  }}
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Salin Rekening
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* 3. Confirmation Form (Records into Couple's Studio Transfer Database) */}
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
            Konfirmasi Tanda Kasih Diterima!
          </p>
          <p
            className="mt-1 text-xs"
            style={{ color: theme.textOnCardMuted }}
          >
            Terima kasih <strong>{receipt.senderName}</strong>. Tanda kasih
            sebesar{" "}
            <strong className="tabular-nums-editorial">
              {formatRupiah(receipt.amount)}
            </strong>{" "}
            ({receipt.method}) telah tercatat di rekapan pengantin.
          </p>
          <p className="mt-2 inline-block rounded-full bg-emerald-600/15 px-3 py-1 text-[10px] font-bold text-emerald-700">
            ID Konfirmasi: {receipt.referenceCode}
          </p>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => setReceipt(null)}
              className="text-[11px] font-semibold underline"
              style={{ color: theme.accentGoldDark }}
            >
              Kirim Konfirmasi Lainnya
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleConfirmTransfer}
          className="mt-4 space-y-3 border-t pt-4"
          style={{ borderColor: `${theme.accentGold}44` }}
        >
          <p
            className="text-center font-display text-[10px] font-bold uppercase tracking-[0.18em]"
            style={{ color: theme.accentGoldDark }}
          >
            Konfirmasi Tanda Kasih ke Pengantin
          </p>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider">
              Nominal Tanda Kasih
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {NOMINAL_PRESETS.map((preset) => {
                const active = amount === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className="tabular-nums-editorial rounded-lg py-1.5 text-xs font-bold transition"
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
            <div
              className="mt-2 flex items-center rounded-lg px-3 py-2"
              style={{
                backgroundColor: theme.cardBg,
                border: `1px solid ${theme.accentGold}66`,
              }}
            >
              <span className="mr-2 text-xs font-bold">Rp</span>
              <input
                type="number"
                min={10000}
                step={10000}
                value={amount}
                onChange={(e) =>
                  setAmount(Math.max(0, Number(e.target.value) || 0))
                }
                className="tabular-nums-editorial w-full bg-transparent text-xs font-bold outline-none"
                style={{ color: theme.textOnCard }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider">
                Nama Pengirim
              </label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Nama lengkap Anda..."
                className="w-full rounded-lg px-3 py-2 text-xs outline-none"
                style={{
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.accentGold}66`,
                  color: theme.textOnCard,
                }}
              />
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wider">
                Melalui QR / Bank
              </label>
              <select
                value={selectedMethod}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="w-full rounded-lg px-2.5 py-2 text-xs outline-none"
                style={{
                  backgroundColor: theme.cardBg,
                  border: `1px solid ${theme.accentGold}66`,
                  color: theme.textOnCard,
                }}
              >
                {methodOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Catatan / doa untuk pengantin (opsional)..."
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
        </form>
      )}
    </div>
  );
}
