'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function handleSignIn(e) {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    // Demo: any credentials go through — Supabase auth will replace this
    router.push('/admin');
  }

  return (
    <div className="login-page">
      <div className="login-top-bar">
        <Image src="/logo/extended-dark/Duo-copper.svg" alt="Digital Public Works" width={140} height={18} />
      </div>
      <div className="login-card">
        <div className="admin-badge">Admin Portal</div>
        <h1>Sign in</h1>
        <p className="login-subtitle">Access the Digital Public Works content management system.</p>
        {error && <div className="login-error show">{error}</div>}
        <form onSubmit={handleSignIn}>
          <div className="login-field">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="you@digitalpublicworks.org"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-signin">Sign in</button>
        </form>
        <div className="login-notice">
          This portal is for Digital Public Works staff only. If you need access, contact your administrator.
        </div>
      </div>
      <p className="login-back"><a href="/">&larr; Back to website</a></p>
    </div>
  );
}
