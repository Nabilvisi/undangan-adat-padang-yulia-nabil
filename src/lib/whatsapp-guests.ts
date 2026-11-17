export interface ParsedGuestEntry {
  name: string;
  phone?: string;
  category?: string;
  pax?: number;
}

export const DEFAULT_WA_TEMPLATE = `Assalamu'alaikum Warahmatullahi Wabarakatuh.

Kepada Yth. *{nama}*,

Tanpa mengurangi rasa hormat, izinkan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami:
*{pasangan}*
Tanggal: {tanggal}

Informasi lengkap acara, Peta Visual 3D, dan Kartu QR Check-In personal Bapak/Ibu dapat dibuka melalui tautan undangan berikut:
{link}

Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

Wassalamu'alaikum Warahmatullahi Wabarakatuh.`;

/**
 * Normalizes Indonesian or international phone strings (including Excel numbers
 * whose leading `0` got stripped) into clean WhatsApp digits (e.g. `6281234567890`).
 */
export function normalizeWhatsAppPhone(raw: unknown): string {
  if (raw === null || raw === undefined) return "";
  let digits = String(raw).trim();
  if (!digits) return "";

  // Handle Excel scientific notation or trailing ".0"
  if (/^\d+(\.0+)?$/.test(digits)) {
    digits = digits.replace(/\.0+$/, "");
  }

  digits = digits.replace(/[^\d+]/g, "").replace(/^\+/, "");
  if (!digits) return "";

  if (digits.startsWith("0")) {
    digits = `62${digits.slice(1)}`;
  } else if (digits.startsWith("8") && digits.length >= 9 && digits.length <= 13) {
    // Common Excel quirk: typing 08123456789 stores number 8123456789
    digits = `62${digits}`;
  }

  return digits.length >= 8 ? digits : "";
}

/**
 * Parses rows pasted from Excel/Google Sheets (`Tab`), CSV (`,` or `;`), `|`,
 * or single-name lines into structured guest entries.
 */
export function parseDelimitedGuestInput(
  rawText: string,
  defaultCategory = "Tamu Undangan"
): ParsedGuestEntry[] {
  const results: ParsedGuestEntry[] = [];
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let cols: string[];
    if (line.includes("\t")) {
      cols = line.split("\t").map((c) => c.trim());
    } else if (line.includes("|")) {
      cols = line.split("|").map((c) => c.trim());
    } else if (line.includes(";")) {
      cols = line.split(";").map((c) => c.trim());
    } else if (line.includes(",")) {
      cols = line.split(",").map((c) => c.trim());
    } else {
      cols = [line];
    }

    const col0 = (cols[0] || "").replace(/^"|"$/g, "").trim();
    if (!col0) continue;

    // Skip obvious header row on first line
    if (
      i === 0 &&
      /^(nama|name|tamu|nama tamu)$/i.test(col0) &&
      cols.length >= 2
    ) {
      continue;
    }

    const phone = cols[1] ? normalizeWhatsAppPhone(cols[1]) : "";
    const category = cols[2]?.replace(/^"|"$/g, "").trim() || defaultCategory;
    const rawPax = cols[3] ? Number(cols[3].replace(/[^\d]/g, "")) : NaN;
    const pax = Number.isFinite(rawPax) && rawPax > 0 ? Math.min(rawPax, 20) : 2;

    results.push({
      name: col0,
      phone: phone || undefined,
      category,
      pax,
    });
  }

  return results;
}

/**
 * Maps spreadsheet object rows parsed via SheetJS (`XLSX.utils.sheet_to_json`)
 * supporting flexible Indonesian/English column headings.
 */
export function parseSpreadsheetRows(
  rows: Record<string, unknown>[],
  defaultCategory = "Tamu Undangan"
): ParsedGuestEntry[] {
  const entries: ParsedGuestEntry[] = [];

  for (const row of rows) {
    let name = "";
    let phone = "";
    let category = "";
    let pax = 2;

    for (const [rawKey, val] of Object.entries(row)) {
      const key = rawKey.trim().toLowerCase();
      const textVal = val === null || val === undefined ? "" : String(val).trim();
      if (!textVal) continue;

      if (
        !name &&
        (key.includes("nama") ||
          key.includes("name") ||
          key.includes("tamu") ||
          key === "kepada")
      ) {
        name = textVal;
      } else if (
        !phone &&
        (key.includes("wa") ||
          key.includes("whatsapp") ||
          key.includes("hp") ||
          key.includes("telp") ||
          key.includes("telepon") ||
          key.includes("phone") ||
          key.includes("nomor") ||
          key === "no")
      ) {
        phone = normalizeWhatsAppPhone(val);
      } else if (
        !category &&
        (key.includes("kategori") ||
          key.includes("category") ||
          key.includes("grup") ||
          key.includes("group"))
      ) {
        category = textVal;
      } else if (key.includes("pax") || key.includes("jumlah")) {
        const parsed = Number(textVal.replace(/[^\d]/g, ""));
        if (Number.isFinite(parsed) && parsed > 0) {
          pax = Math.min(parsed, 20);
        }
      }
    }

    // Fallback to positional columns if headers were unnamed (`__EMPTY`, etc.)
    if (!name) {
      const vals = Object.values(row)
        .map((v) => (v === null || v === undefined ? "" : String(v).trim()))
        .filter(Boolean);
      if (vals[0]) name = vals[0];
      if (!phone && vals[1]) phone = normalizeWhatsAppPhone(vals[1]);
      if (!category && vals[2]) category = vals[2];
    }

    if (name) {
      entries.push({
        name,
        phone: phone || undefined,
        category: category || defaultCategory,
        pax,
      });
    }
  }

  return entries;
}

export function renderWhatsAppMessage(
  template: string,
  vars: {
    name: string;
    link: string;
    coupleLabel: string;
    dateDisplay: string;
    guestCode?: string;
  }
): string {
  return (template || DEFAULT_WA_TEMPLATE)
    .replace(/\{nama\}/gi, vars.name)
    .replace(/\{link\}/gi, vars.link)
    .replace(/\{pasangan\}/gi, vars.coupleLabel)
    .replace(/\{tanggal\}/gi, vars.dateDisplay)
    .replace(/\{kode_qr\}/gi, vars.guestCode || "-");
}

export function buildWhatsAppDirectHref(phone: string | undefined, messageText: string): string {
  const cleanPhone = normalizeWhatsAppPhone(phone);
  const encoded = encodeURIComponent(messageText);
  return cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
}
