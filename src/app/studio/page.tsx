import { loadServerConfig } from "@/lib/server-config";
import { StudioEditor } from "@/components/studio/StudioEditor";

export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const initialConfig = await loadServerConfig();
  return <StudioEditor initialConfig={initialConfig} />;
}
