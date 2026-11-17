import defaultConfig from "@/data/wedding-config.json";
import { mergeWeddingConfig } from "@/lib/config-store";
import { readPersistentJson } from "@/lib/persistent-store";
import { WeddingConfig } from "@/types/wedding";

/**
 * Loads the persisted wedding configuration on the server from /tmp, GitHub API,
 * or local disk src/data/wedding-config.json.
 */
export async function loadServerConfig(): Promise<WeddingConfig> {
  const data = await readPersistentJson<WeddingConfig>(
    "wedding-config.json",
    defaultConfig as WeddingConfig
  );
  return mergeWeddingConfig(data);
}
