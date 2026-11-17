import { NextResponse } from "next/server";
import defaultGuests from "@/data/guests.json";
import {
  readPersistentJson,
  writePersistentJson,
} from "@/lib/persistent-store";
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

    // Action 1: Replace full list or bulk add
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

    // Action 3: Add single or bulk guest names
    if (body.action === "add") {
      const names: string[] = Array.isArray(body.names)
        ? body.names
        : [String(body.name || "")];
      const category = String(body.category || "Tamu Undangan");
      const newRecords: GuestRecord[] = [];

      for (const rawName of names) {
        const cleanName = rawName.trim();
        if (!cleanName) continue;
        const already = existing.find(
          (g) => g.name.toLowerCase() === cleanName.toLowerCase()
        );
        if (!already) {
          newRecords.push({
            id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            code: generateGuestCode(cleanName),
            name: cleanName,
            category,
            rsvpStatus: "belum-konfirmasi",
            pax: Number(body.pax) || 2,
            checkedIn: false,
            updatedAt: new Date().toISOString(),
          });
        }
      }

      const updated = [...newRecords, ...existing];
      await writePersistentJson("guests.json", updated, "Tambah daftar tamu");
      return NextResponse.json({ ok: true, guests: updated });
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
