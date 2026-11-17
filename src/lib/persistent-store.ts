import { execSync } from "child_process";
import fs from "fs/promises";
import os from "os";
import path from "path";

const DEFAULT_GITHUB_REPO = "Nabilvisi/undangan-adat-padang-yulia-nabil";
const memoryCache = new Map<string, unknown>();
let cachedLocalGhToken: string | null | undefined = undefined;

function getRepoFilePath(fileName: string): string {
  return path.join(process.cwd(), "src", "data", fileName);
}

function getTmpFilePath(fileName: string): string {
  return path.join(os.tmpdir(), `pusako_minang_${fileName}`);
}

function resolveGitHubCredentials(): { token: string | null; repo: string } {
  const repo = process.env.GITHUB_REPO || DEFAULT_GITHUB_REPO;
  if (process.env.GITHUB_TOKEN) {
    return { token: process.env.GITHUB_TOKEN, repo };
  }
  if (cachedLocalGhToken !== undefined) {
    return { token: cachedLocalGhToken, repo };
  }
  if (process.env.VERCEL) {
    cachedLocalGhToken = null;
    return { token: null, repo };
  }
  try {
    const token = execSync("gh auth token", {
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 2500,
    }).trim();
    cachedLocalGhToken = token || null;
  } catch {
    cachedLocalGhToken = null;
  }
  return { token: cachedLocalGhToken, repo };
}

async function fetchFromGitHub<T>(
  repo: string,
  fileName: string,
  token: string | null
): Promise<T | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(
      `https://api.github.com/repos/${repo}/contents/src/data/${fileName}`,
      {
        headers,
        cache: "no-store",
      }
    );
    if (res.ok) {
      const meta = (await res.json()) as { content?: string };
      if (meta.content) {
        const decoded = Buffer.from(meta.content, "base64").toString("utf-8");
        return JSON.parse(decoded) as T;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Reads JSON data seamlessly across both Local and Vercel environments:
 * - On Vercel: checks /tmp first (for instant in-instance edits), then fetches
 *   live from GitHub (so any edit pushed from Studio is live immediately without rebuild),
 *   then falls back to the bundled file.
 * - On Local: reads from src/data/<fileName> directly.
 */
export async function readPersistentJson<T>(
  fileName: string,
  fallback: T
): Promise<T> {
  const isVercel = Boolean(process.env.VERCEL);
  const { token, repo } = resolveGitHubCredentials();

  if (isVercel) {
    // 1. Check /tmp first (if edited directly on this Vercel instance)
    try {
      const tmpRaw = await fs.readFile(getTmpFilePath(fileName), "utf-8");
      const parsed = JSON.parse(tmpRaw) as T;
      memoryCache.set(fileName, parsed);
      return parsed;
    } catch {
      // continue
    }

    // 2. Fetch live from GitHub repository so local Studio edits are immediately live on Vercel
    if (repo) {
      const fromGh = await fetchFromGitHub<T>(repo, fileName, token);
      if (fromGh !== null) {
        memoryCache.set(fileName, fromGh);
        return fromGh;
      }
    }
  }

  // 3. Read local disk src/data/<fileName>
  try {
    const raw = await fs.readFile(getRepoFilePath(fileName), "utf-8");
    const parsed = JSON.parse(raw) as T;
    memoryCache.set(fileName, parsed);
    return parsed;
  } catch {
    // fallback
  }

  if (memoryCache.has(fileName)) {
    return memoryCache.get(fileName) as T;
  }

  return fallback;
}

/**
 * Writes JSON data to:
 * 1. Local disk src/data/<fileName> (when writable, e.g. local dev/start)
 * 2. /tmp/pusako_minang_<fileName> + in-memory cache (always writable on Vercel)
 * 3. GitHub Repository via REST API (using GITHUB_TOKEN or local `gh auth token`)
 */
export async function writePersistentJson<T>(
  fileName: string,
  data: T,
  commitMessage = `Update ${fileName} via Studio Undangan`
): Promise<{
  persistedToDisk: boolean;
  persistedToTmp: boolean;
  persistedToGitHub: boolean;
}> {
  const serialized = JSON.stringify(data, null, 2);
  memoryCache.set(fileName, data);

  let persistedToDisk = false;
  let persistedToTmp = false;
  let persistedToGitHub = false;

  // 1. Write to local repo src/data/<fileName>
  try {
    await fs.writeFile(getRepoFilePath(fileName), serialized, "utf-8");
    persistedToDisk = true;
  } catch {
    persistedToDisk = false;
  }

  // 2. Write to /tmp so serverless warm instances immediately serve updated data
  try {
    await fs.writeFile(getTmpFilePath(fileName), serialized, "utf-8");
    persistedToTmp = true;
  } catch {
    persistedToTmp = false;
  }

  // 3. Auto-commit to GitHub repository (Nabilvisi/undangan-adat-padang-yulia-nabil)
  const { token, repo } = resolveGitHubCredentials();
  if (token && repo) {
    try {
      const apiUrl = `https://api.github.com/repos/${repo}/contents/src/data/${fileName}`;
      const getRes = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
      });
      let sha: string | undefined;
      if (getRes.ok) {
        const existing = (await getRes.json()) as { sha?: string };
        sha = existing.sha;
      }

      const putRes = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: commitMessage,
          content: Buffer.from(serialized, "utf-8").toString("base64"),
          ...(sha ? { sha } : {}),
        }),
      });
      if (putRes.ok) {
        persistedToGitHub = true;
      }
    } catch {
      persistedToGitHub = false;
    }
  }

  return { persistedToDisk, persistedToTmp, persistedToGitHub };
}
