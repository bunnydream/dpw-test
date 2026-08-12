import type { Metadata } from "next";
import ResetPasswordForm from "./ResetPasswordForm";
import "../../admin.css";

export const metadata: Metadata = {
  title: "Reset password — DPW Site Manager",
};

export default function ResetPasswordPage() {
  return (
    <div className="admin">
      <div className="a-login-wrap">
        <div className="a-login-card">
          <div className="a-login-logo">
            <img src="/logo/stacked-light-mono.svg" alt="Digital Public Works" />
          </div>

          <h1>Set a new password</h1>

          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
}
