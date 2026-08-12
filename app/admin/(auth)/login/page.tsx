import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import "../../admin.css";

export const metadata: Metadata = {
  title: "Log in — DPW Site Manager",
};

export default function AdminLoginPage() {
  return (
    <div className="admin">
      <div className="a-login-wrap">
        <div className="a-login-card">
          <div className="a-login-logo">
            <img src="/logo/stacked-light-mono.svg" alt="Digital Public Works" />
          </div>

          <h1>Welcome back</h1>

          <LoginForm />
        </div>
      </div>

      <p className="a-login-footnote" style={{ color: "var(--light-al)", marginTop: "-8px" }}>
        Trouble logging in? Contact your site administrator.
      </p>
    </div>
  );
}
