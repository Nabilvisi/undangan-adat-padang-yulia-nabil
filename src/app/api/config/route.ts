import { NextResponse } from "next/server";
import defaultConfig from "@/data/wedding-config.json";
import { mergeWeddingConfig } from "@/lib/config-store";
import {
  readPersistentJson,
  writePersistentJson,
} from "@/lib/persistent-store";
import { WeddingConfig } from "@/types/wedding";

export async function GET() {
  const data = await readPersistentJson<WeddingConfig>(
    "wedding-config.json",
    defaultConfig as WeddingConfig
  );
  return NextResponse.json(mergeWeddingConfig(data));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const merged = mergeWeddingConfig(body);
    const status = await writePersistentJson(
      "wedding-config.json",
      merged,
      "Update konfigurasi undangan via Studio"
    );

    return NextResponse.json({
      ok: true,
      ...status,
      config: merged,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Format konfigurasi tidak valid." },
      { status: 400 }
    );
  }
}
