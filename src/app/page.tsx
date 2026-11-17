import { loadServerConfig } from "@/lib/server-config";
import { MINANG_THEMES } from "@/lib/themes";
import { InvitationView } from "@/components/invitation/InvitationView";
import { ThemeId } from "@/types/wedding";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{
    to?: string;
    tamu?: string;
    code?: string;
    qr?: string;
    theme?: string;
    guest?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const baseConfig = await loadServerConfig();

  const themeParam = resolvedParams.theme as ThemeId | undefined;
  const initialConfig =
    themeParam && MINANG_THEMES[themeParam]
      ? { ...baseConfig, themeId: themeParam }
      : baseConfig;

  const initialGuestName = resolvedParams.to || resolvedParams.tamu;
  const initialGuestCode = resolvedParams.code || resolvedParams.qr;
  const initialGuestMode =
    resolvedParams.guest === "1" || resolvedParams.guest === "true";

  return (
    <InvitationView
      initialConfig={initialConfig}
      initialGuestName={initialGuestName}
      initialGuestCode={initialGuestCode}
      initialGuestMode={initialGuestMode}
    />
  );
}
