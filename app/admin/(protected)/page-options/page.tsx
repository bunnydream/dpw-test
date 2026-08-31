import { listPagesWithMeta } from "@/lib/admin/pages";
import PageOptionsEditor from "./PageOptionsEditor";

export default async function PageOptionsPage() {
  const pages = await listPagesWithMeta();
  return <PageOptionsEditor pages={pages} />;
}
