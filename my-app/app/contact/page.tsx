"use client";

import { ArrowRight, MapPin, Mail, Globe } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "Collaboration",
    message: ""
  });

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Something went wrong");
      }

      alert("Thanks for reaching out! check your email later.");
      setFormData({ name: "", email: "", type: "Collaboration", message: "" });
    } catch (err) {
      console.error(err);
      alert("Couldn't send your message. Please try again.");
    } finally {
      setStatus("idle");
    }
  };
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground flex flex-col md:flex-row">

      <div className="w-full md:w-1/3 bg-muted p-12 lg:p-24 flex flex-col justify-between border-r border-border">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-light tracking-widest uppercase">Contact</h1>
          <p className="text-sm font-light leading-relaxed text-foreground/70">
            Whether you're looking to collaborate, carry our clothing in your store, or simply need support with an order, our team is ready.
          </p>
        </div>

        <div className="space-y-12 mt-16 md:mt-0">
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase">Headquarters</h4>
            <div className="flex items-start gap-4 text-sm font-light text-foreground/70">
              <MapPin className="w-4 h-4 mt-1" />
              <p>Bogo City, Nailon<br />Cebu, 6010<br />Philippines</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase">Inquiries</h4>
            <div className="flex flex-col gap-4 text-sm font-light text-foreground/70">
              <a href="mailto:collab@osw.com" className="flex items-center gap-4 hover:text-foreground transition-colors"><Mail className="w-4 h-4" /> collab@osw.com</a>
              <a href="mailto:wholesale@osw.com" className="flex items-center gap-4 hover:text-foreground transition-colors"><Globe className="w-4 h-4" /> wholesale@osw.com</a>
            </div>
          </div>
        </div>
      </div>


      <div className="w-full md:w-2/3 p-12 lg:p-24 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>

        <div className="w-full max-w-xl relative z-10 space-y-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-light tracking-widest uppercase">Send a Message</h2>
            <p className="text-xs font-medium tracking-[0.2em] text-foreground/50 uppercase">We aim to respond within 24 hours.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                  placeholder="Your Name"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Inquiry Type</label>
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full appearance-none bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors font-light cursor-pointer rounded-none"
                >
                  <option className="bg-background text-foreground">Collaboration / PR</option>
                  <option className="bg-background text-foreground">Wholesale / Delivery</option>
                  <option className="bg-background text-foreground">Customer Support</option>
                  <option className="bg-background text-foreground">General Inquiry</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">Message</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent border-b border-border py-3 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-foreground/20 font-light resize-none"
                placeholder="How can we work together?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="group relative w-full inline-flex items-center justify-between bg-foreground text-background px-6 py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
            >
              <span>{status === "loading" ? "Sending..." : "Submit Inquiry"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
