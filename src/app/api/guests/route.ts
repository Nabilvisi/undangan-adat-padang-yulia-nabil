import { NextResponse } from "next/server";
import defaultGuests from "@/data/guests.json";
import {
  readPersistentJson,
  writePersistentJson,
} from "@/lib/persistent-store";
import { normalizeWhatsAppPhone } from "@/lib/whatsapp-guests";
import { GuestRecord } from "@/types/wedding";

function generateGuestCode(name: string): string {
  const clean = name
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 4)
    .padEnd(4, "X");
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 9000;
  }
  const num = String(1000 + Math.abs(hash)).slice(0, 4);
  return `MN-${clean}-${num}`;
}

export async function GET() {
  const guests = await readPersistentJson<GuestRecord[]>(
    "guests.json",
    defaultGuests as GuestRecord[]
  );
  return NextResponse.json(guests);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Action 1: Replace full list
    if (body.action === "save-all" && Array.isArray(body.guests)) {
      await writePersistentJson(
        "guests.json",
        body.guests,
        "Update daftar tamu undangan via Studio"
      );
      return NextResponse.json({ ok: true, guests: body.guests });
    }

    const existing = await readPersistentJson<GuestRecord[]>(
      "guests.json",
      defaultGuests as GuestRecord[]
    );

    // Action 2: Check-in by QR Code or Guest ID
    if (body.action === "checkin") {
      const query = String(body.code || body.name || "").trim().toLowerCase();
      const idx = existing.findIndex(
        (g) =>
          g.code.toLowerCase() === query ||
          g.id.toLowerCase() === query ||
          g.name.toLowerCase() === query
      );

      if (idx >= 0) {
        existing[idx] = {
          ...existing[idx],
          checkedIn: true,
          rsvpStatus: "hadir",
          checkedInAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (body.name) {
        const gName = String(body.name).trim();
        existing.unshift({
          id: `guest-${Date.now()}`,
          code: body.code || generateGuestCode(gName),
          name: gName,
          category: "Tamu Check-In Langsung",
          rsvpStatus: "hadir",
          pax: Number(body.pax) || 1,
          checkedIn: true,
          checkedInAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        return NextResponse.json(
          { ok: false, error: "Kode QR tamu tidak ditemukan." },
          { status: 404 }
        );
      }

      await writePersistentJson("guests.json", existing, "Check-in QR tamu");
      return NextResponse.json({ ok: true, guests: existing });
    }

    // Action 3: Mark guest as WA sent / toggle sent state
    if (body.action === "mark-wa-sent") {
      const targetId = String(body.id || "").trim().toLowerCase();
      const targetCode = String(body.code || "").trim().toLowerCase();
      const sentState = body.sent !== false;
      const idx = existing.findIndex(
        (g) =>
          (targetId && g.id.toLowerCase() === targetId) ||
          (targetCode && g.code.toLowerCase() === targetCode)
      );

      if (idx >= 0) {
        existing[idx] = {
          ...existing[idx],
          waSent: sentState,
          waSentAt: sentState ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString(),
        };
        await writePersistentJson(
          "guests.json",
          existing,
          "Update status kirim WhatsApp tamu"
        );
      }
      return NextResponse.json({ ok: true, guests: existing });
    }

    // Action 4: Delete guest row
    if (body.action === "delete") {
      const targetId = String(body.id || "").trim().toLowerCase();
      const filtered = existing.filter(
        (g) => g.id.toLowerCase() !== targetId && g.code.toLowerCase() !== targetId
      );
      await writePersistentJson("guests.json", filtered, "Hapus data tamu");
      return NextResponse.json({ ok: true, guests: filtered });
    }

    // Action 5: Add / Import bulk guests (supports Excel entries with phone & category or plain names)
    if (body.action === "add" || body.action === "import-bulk") {
      const defaultCat = String(body.category || "Tamu Undangan");
      const defaultPax = Number(body.pax) || 2;

      const entries: {
        name: string;
        phone?: string;
        category?: string;
        pax?: number;
      }[] = Array.isArray(body.entries)
        ? body.entries
        : (Array.isArray(body.names) ? body.names : [String(body.name || "")]).map(
            (n: string) => ({ name: n })
          );

      const newRecords: GuestRecord[] = [];
      let updatedCount = 0;

      for (const entry of entries) {
        const cleanName = String(entry.name || "").trim();
        if (!cleanName) continue;

        const normalizedPhone = normalizeWhatsAppPhone(entry.phone);
        const entryCategory = String(entry.category || defaultCat).trim();
        const entryPax = Number(entry.pax) || defaultPax;

        const existingIdx = existing.findIndex(
          (g) => g.name.toLowerCase() === cleanName.toLowerCase()
        );

        if (existingIdx >= 0) {
          // Update phone/category if newly provided from Excel
          existing[existingIdx] = {
            ...existing[existingIdx],
            ...(normalizedPhone ? { phone: normalizedPhone } : {}),
            ...(entry.category ? { category: entryCategory } : {}),
            updatedAt: new Date().toISOString(),
          };
          updatedCount += 1;
        } else {
          newRecords.push({
            id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            code: generateGuestCode(cleanName),
            name: cleanName,
            category: entryCategory,
            ...(normalizedPhone ? { phone: normalizedPhone } : {}),
            waSent: false,
            rsvpStatus: "belum-konfirmasi",
            pax: entryPax,
            checkedIn: false,
            updatedAt: new Date().toISOString(),
          });
        }
      }

      const updated = [...newRecords, ...existing];
      await writePersistentJson(
        "guests.json",
        updated,
        `Import/tambah ${newRecords.length} tamu undangan`
      );
      return NextResponse.json({
        ok: true,
        addedCount: newRecords.length,
        updatedCount,
        guests: updated,
      });
    }

    return NextResponse.json(
      { ok: false, error: "Aksi tidak dikenali." },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Gagal memproses data tamu." },
      { status: 400 }
    );
  }
}
