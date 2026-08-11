"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

type Mode = "login" | "reset";

export default function Login() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const { signIn, resetPassword } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setResetSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex bg-background text-foreground">

      <div className="hidden lg:flex w-1/2 bg-muted relative flex-col justify-between p-16 border-r border-border overflow-hidden group">
        <Link href="/" className="z-10 inline-flex items-center gap-3 text-xs font-medium tracking-[0.2em] uppercase hover:text-foreground/60 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="z-10 max-w-md space-y-6">
          <h1 className="text-8xl font-light tracking-widest uppercase">OSW.</h1>
          <p className="text-lg font-light text-foreground/70 leading-relaxed">
            Access exclusive drops, track your orders, and join the global streetwear movement.
          </p>
        </div>

        <div className="absolute inset-0 opacity-[0.03] transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: "repeating-linear-gradient(45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 10px)" }}></div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 lg:p-24 relative">
        <div className="max-w-md w-full mx-auto space-y-16">

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight uppercase">
              {mode === "login" ? "Authentication" : "Reset Password"}
            </h2>
            <p className="text-sm font-medium tracking-[0.2em] text-foreground/50 uppercase">
              {mode === "login" ? "Members Only" : "We'll send you a link"}
            </p>
          </div>


          {resetSent ? (
            <div className="space-y-4 border border-foreground/20 p-8">
              <p className="text-sm font-medium tracking-[0.1em] uppercase">Reset link sent</p>
              <p className="text-sm text-foreground/60 font-light leading-relaxed">
                Check your inbox for a password reset link.
              </p>
              <button
                onClick={() => { setMode("login"); setResetSent(false); }}
                className="text-xs font-medium tracking-[0.2em] uppercase underline underline-offset-4 text-foreground/60 hover:text-foreground transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          ) : mode === "login" ? (

            <form onSubmit={handleLogin} className="space-y-10">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                    placeholder="name@example.com"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs font-medium tracking-[0.1em] uppercase text-red-500 border border-red-500/20 bg-red-500/5 px-4 py-3">
                  {error}
                </p>
              )}

              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="group relative w-full inline-flex items-center justify-between bg-foreground text-background px-6 py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{loading ? "Signing In…" : "Sign In"}</span>
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                }
              </button>
            </form>
          ) : (

            <form onSubmit={handleReset} className="space-y-10">
              <div className="space-y-3">
                <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Email</label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                  placeholder="name@example.com"
                />
              </div>

              {error && (
                <p className="text-xs font-medium tracking-[0.1em] uppercase text-red-500 border border-red-500/20 bg-red-500/5 px-4 py-3">
                  {error}
                </p>
              )}

              <button
                id="reset-submit"
                type="submit"
                disabled={loading}
                className="group relative w-full inline-flex items-center justify-between bg-foreground text-background px-6 py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{loading ? "Sending…" : "Send Reset Link"}</span>
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                }
              </button>
            </form>
          )}

          {!resetSent && (
            <div className="pt-8 border-t border-border flex flex-col space-y-6">
              <div className="flex justify-between items-center text-xs font-medium tracking-[0.1em] uppercase">
                <span className="text-foreground/50">Need an account?</span>
                <Link href="/register" className="text-foreground hover:text-foreground/70 transition-colors underline underline-offset-4 decoration-border hover:decoration-foreground">Register</Link>
              </div>
              <div className="flex justify-between items-center text-xs font-medium tracking-[0.1em] uppercase">
                <span className="text-foreground/50">Forgot Password?</span>
                <button
                  id="toggle-reset"
                  onClick={() => { setMode(mode === "login" ? "reset" : "login"); setError(null); }}
                  className="text-foreground hover:text-foreground/70 transition-colors underline underline-offset-4 decoration-border hover:decoration-foreground"
                >
                  {mode === "login" ? "Reset" : "Back to Login"}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}