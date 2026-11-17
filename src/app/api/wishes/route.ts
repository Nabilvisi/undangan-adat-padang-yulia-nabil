import { NextResponse } from "next/server";
import defaultWishes from "@/data/wishes.json";
import defaultGuests from "@/data/guests.json";
import {
  readPersistentJson,
  writePersistentJson,
} from "@/lib/persistent-store";
import { GuestRecord, WishItem } from "@/types/wedding";

export async function GET() {
  const wishes = await readPersistentJson<WishItem[]>(
    "wishes.json",
    defaultWishes as WishItem[]
  );
  return NextResponse.json(wishes);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<WishItem>;
    const name = (body.name || "").trim();
    const message = (body.message || "").trim();

    if (!name || !message) {
      return NextResponse.json(
        { ok: false, error: "Nama dan ucapan wajib diisi." },
        { status: 400 }
      );
    }

    const attendance = body.attendance || "hadir";
    const guestCount = Math.max(1, Math.min(10, Number(body.guestCount) || 1));

    const newWish: WishItem = {
      id: `wish-${Date.now()}`,
      name,
      attendance,
      guestCount,
      message,
      guestCode: body.guestCode,
      createdAt: new Date().toISOString(),
    };

    const existing = await readPersistentJson<WishItem[]>(
      "wishes.json",
      defaultWishes as WishItem[]
    );
    const updated = [newWish, ...existing].slice(0, 200);
    await writePersistentJson("wishes.json", updated, `Ucapan baru dari ${name}`);

    // Automatically sync RSVP status to Guest Database (guests.json)
    const guests = await readPersistentJson<GuestRecord[]>(
      "guests.json",
      defaultGuests as GuestRecord[]
    );
    const normalizedName = name.toLowerCase();
    const matchIdx = guests.findIndex(
      (g) =>
        (body.guestCode && g.code === body.guestCode) ||
        g.name.toLowerCase() === normalizedName
    );

    if (matchIdx >= 0) {
      guests[matchIdx] = {
        ...guests[matchIdx],
        rsvpStatus: attendance,
        pax: guestCount,
        message,
        updatedAt: new Date().toISOString(),
      };
    } else {
      const shortHash = Math.random().toString(36).substring(2, 6).toUpperCase();
      guests.unshift({
        id: `guest-${Date.now()}`,
        code: body.guestCode || `MN-YN-${shortHash}`,
        name,
        category: "Tamu Undangan",
        rsvpStatus: attendance,
        pax: guestCount,
        checkedIn: false,
        message,
        updatedAt: new Date().toISOString(),
      });
    }
    await writePersistentJson(
      "guests.json",
      guests,
      `Update RSVP tamu ${name}`
    );

    return NextResponse.json({ ok: true, wish: newWish, wishes: updated });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Gagal menyimpan ucapan." },
      { status: 400 }
    );
  }
}
