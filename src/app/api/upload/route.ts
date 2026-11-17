import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "File tidak ditemukan." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext =
      path.extname(file.name).toLowerCase() ||
      (file.type.includes("png")
        ? ".png"
        : file.type.includes("webp")
        ? ".webp"
        : file.type.includes("mpeg") || file.type.includes("mp3")
        ? ".mp3"
        : ".jpg");

    const safeBase = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .toLowerCase()
      .slice(0, 40);

    const fileName = `${Date.now()}-${safeBase || "asset"}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const targetPath = path.join(uploadsDir, fileName);

    try {
      await fs.mkdir(uploadsDir, { recursive: true });
      await fs.writeFile(targetPath, buffer);
      return NextResponse.json({
        ok: true,
        persistedToDisk: true,
        url: `/uploads/${fileName}`,
      });
    } catch {
      // Fallback to base64 data URI if runtime filesystem is read-only
      const base64 = buffer.toString("base64");
      const mime = file.type || "image/jpeg";
      return NextResponse.json({
        ok: true,
        persistedToDisk: false,
        url: `data:${mime};base64,${base64}`,
      });
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Gagal memproses unggahan file." },
      { status: 500 }
    );
  }
}
