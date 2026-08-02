"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering with", email);
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex bg-background text-foreground">

      <div className="hidden lg:flex w-1/2 bg-muted relative flex-col justify-between p-16 border-r border-border overflow-hidden group">
        <Link href="/" className="z-10 inline-flex items-center gap-3 text-xs font-medium tracking-[0.2em] uppercase hover:text-foreground/60 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        <div className="z-10 max-w-md space-y-6">
          <h1 className="text-8xl font-light tracking-widest uppercase">Join.</h1>
          <p className="text-lg font-light text-foreground/70 leading-relaxed">
            Create an account to track your orders, save your wishlist, and gain early access to our most exclusive drops.
          </p>
        </div>

        <div className="absolute inset-0 opacity-[0.03] transition-transform duration-1000 group-hover:scale-110" style={{ backgroundImage: "repeating-linear-gradient(-45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 10px)" }}></div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 sm:p-16 lg:p-24 relative">
        <div className="max-w-md w-full mx-auto space-y-16">

          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight uppercase">Registration</h2>
            <p className="text-sm font-medium tracking-[0.2em] text-foreground/50 uppercase">Become a Member</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                  placeholder="John Doe"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Email</label>
                <input
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
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full inline-flex items-center justify-between bg-foreground text-background px-6 py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
            >
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </form>

          <div className="pt-8 border-t border-border flex justify-between items-center text-xs font-medium tracking-[0.1em] uppercase">
            <span className="text-foreground/50">Already have an account?</span>
            <Link href="/login" className="text-foreground hover:text-foreground/70 transition-colors underline underline-offset-4 decoration-border hover:decoration-foreground">Sign In</Link>
          </div>

        </div>
      </div>

    </div>
  );
}
