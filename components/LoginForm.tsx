"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Music2, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ConcertBackground } from "@/components/ConcertBackground";
import { ThemeSelector } from "@/components/ThemeSelector";

export function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Account created! You can log in now (check your email if confirmation is required).",
        });
        setMode("login");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }

    setLoading(false);
  }

  return (
    <ConcertBackground variant="login" className="flex flex-col">
      <div className="flex justify-end p-4">
        <ThemeSelector compact />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 pb-12">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-primary-content shadow-lg mb-4">
              <Music2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Concert Cost Tracker</h1>
            <p className="mt-3 text-base-content/70 max-w-md mx-auto flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 shrink-0 text-secondary" />
              Remember the music, the money, and the memories — all in one place.
            </p>
          </div>

          <div className="card bg-base-100/95 backdrop-blur-sm shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title text-lg">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-base-content/60 -mt-1">
                {mode === "login"
                  ? "Log in to see your concerts and dashboard."
                  : "Sign up to start tracking your concert adventures."}
              </p>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="form-label-fixed">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    className="input input-bordered w-full"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="form-label-fixed">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    className="input input-bordered w-full"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                  />
                  <p className="helper">At least 6 characters</p>
                </div>

                {message && (
                  <div
                    role="alert"
                    className={`alert text-sm ${message.type === "error" ? "alert-error" : "alert-success"}`}
                  >
                    <span>{message.text}</span>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : mode === "login" ? (
                    "Log in"
                  ) : (
                    "Sign up"
                  )}
                </button>
              </form>

              <div className="divider text-xs">or</div>

              <button
                type="button"
                className="btn btn-ghost btn-sm w-full"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setMessage(null);
                }}
              >
                {mode === "login"
                  ? "New here? Create an account"
                  : "Already have an account? Log in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ConcertBackground>
  );
}


