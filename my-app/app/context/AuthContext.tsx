"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (fullName: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("sw_token");
    if (!stored) {
      setLoading(false);
      return;
    }

    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${stored}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setUser(json.user);
          setToken(stored);
        } else {
          localStorage.removeItem("sw_token");
        }
      })
      .catch(() => localStorage.removeItem("sw_token"))
      .finally(() => setLoading(false));
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const res = await fetch(`${API}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, fullName }),
    });
    const json = await res.json();

    if (!json.success) return { error: json.message };

    if (json.access_token) {
      localStorage.setItem("sw_token", json.access_token);
      setToken(json.access_token);
      setUser(json.user);
    }

    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();

    if (!json.success) return { error: json.message };

    localStorage.setItem("sw_token", json.access_token);
    setToken(json.access_token);
    setUser(json.user);

    return { error: null };
  };

  const signOut = async () => {
    const stored = localStorage.getItem("sw_token");
    await fetch(`${API}/api/auth/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${stored}` },
    }).catch(() => {});

    localStorage.removeItem("sw_token");
    setToken(null);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    const res = await fetch(`${API}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();

    return { error: json.success ? null : json.message };
  };

  const updateProfile = async (fullName: string) => {
    const stored = localStorage.getItem("sw_token");
    if (!stored) return { error: "Not logged in" };

    const res = await fetch(`${API}/api/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${stored}`,
      },
      body: JSON.stringify({ fullName }),
    });
    const json = await res.json();

    if (json.success && json.user) {
      setUser(json.user);
      return { error: null };
    }

    return { error: json.message || "Failed to update profile" };
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signUp, signIn, signOut, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}
