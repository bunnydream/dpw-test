import { getNavSettingsAdmin } from "@/lib/admin/site-settings";
import NavEditor from "./NavEditor";

export default async function NavbarPage() {
  const settings = await getNavSettingsAdmin();
  return <NavEditor initial={settings} />;
}
