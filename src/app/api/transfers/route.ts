import { NextResponse } from "next/server";
import defaultTransfers from "@/data/transfers.json";
import {
  readPersistentJson,
  writePersistentJson,
} from "@/lib/persistent-store";
import { TransferRecord } from "@/types/wedding";

export async function GET() {
  const transfers = await readPersistentJson<TransferRecord[]>(
    "transfers.json",
    defaultTransfers as TransferRecord[]
  );
  return NextResponse.json(transfers);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const existing = await readPersistentJson<TransferRecord[]>(
      "transfers.json",
      defaultTransfers as TransferRecord[]
    );

    if (body.action === "verify" && body.id) {
      const updated = existing.map((t) =>
        t.id === body.id ? { ...t, status: "terverifikasi" as const } : t
      );
      await writePersistentJson(
        "transfers.json",
        updated,
        "Verifikasi transfer tanda kasih"
      );
      return NextResponse.json({ ok: true, transfers: updated });
    }

    if (body.action === "delete" && body.id) {
      const updated = existing.filter((t) => t.id !== body.id);
      await writePersistentJson(
        "transfers.json",
        updated,
        "Hapus data transfer"
      );
      return NextResponse.json({ ok: true, transfers: updated });
    }

    const senderName = String(body.senderName || "").trim();
    const amount = Number(body.amount) || 0;
    const method = String(body.method || "QRIS Instan").trim();

    if (!senderName || amount <= 0) {
      return NextResponse.json(
        { ok: false, error: "Nama pengirim dan nominal wajib diisi." },
        { status: 400 }
      );
    }

    const newTransfer: TransferRecord = {
      id: `trx-${Date.now()}`,
      referenceCode:
        body.referenceCode ||
        `TRX-MN-${Math.floor(10000 + Math.random() * 90000)}`,
      senderName,
      guestCode: body.guestCode,
      amount,
      method,
      vaOrAccountNumber: String(body.vaOrAccountNumber || "-"),
      message: String(body.message || "").trim(),
      status: "berhasil-konfirmasi",
      createdAt: new Date().toISOString(),
    };

    const updated = [newTransfer, ...existing];
    await writePersistentJson(
      "transfers.json",
      updated,
      `Konfirmasi tanda kasih dari ${senderName}`
    );

    return NextResponse.json({
      ok: true,
      transfer: newTransfer,
      transfers: updated,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Gagal menyimpan konfirmasi transfer." },
      { status: 400 }
    );
  }
}
