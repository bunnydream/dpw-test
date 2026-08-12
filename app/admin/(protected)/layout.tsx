import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/admin/Sidebar";
import "../admin.css";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // proxy.ts already redirects unauthenticated requests before they reach here —
  // this is defense in depth in case a Server Function is ever called without it.
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="admin">
      <div className="admin-shell">
        <Sidebar email={user.email ?? ""} />
        <div className="admin-main">{children}</div>
      </div>
    </div>
  );
}
