import { getNavSettingsAdmin } from "@/lib/admin/site-settings";
import { listPagesWithMeta } from "@/lib/admin/pages";
import NavEditor from "./NavEditor";

export default async function NavbarPage() {
  const [settings, pages] = await Promise.all([getNavSettingsAdmin(), listPagesWithMeta()]);
  return <NavEditor initial={settings} pages={pages} />;
}
