import { createClient } from "@/lib/supabase/server";
import EmailForm from "./EmailForm";
import PasswordForm from "./PasswordForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <header className="admin-topbar">
        <div>
          <h1>Settings</h1>
          <div className="admin-topbar-sub">Manage your account.</div>
        </div>
      </header>

      <div className="admin-content">
        <div className="a-settings-wrap">
          <EmailForm currentEmail={user?.email ?? ""} />
          <PasswordForm />
        </div>
      </div>
    </>
  );
}
