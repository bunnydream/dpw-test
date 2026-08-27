import { getSeoSettingsAdmin } from "@/lib/admin/site-settings";
import SeoEditor from "./SeoEditor";

export default async function SeoPage() {
  const settings = await getSeoSettingsAdmin();
  return <SeoEditor initial={settings} />;
}
