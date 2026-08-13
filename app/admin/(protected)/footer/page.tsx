import { getFooterSettingsAdmin } from "@/lib/admin/site-settings";
import FooterEditor from "./FooterEditor";

export default async function FooterPage() {
  const settings = await getFooterSettingsAdmin();
  return <FooterEditor initial={settings} />;
}
