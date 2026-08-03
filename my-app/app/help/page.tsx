"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Package,
  RefreshCw,
  CreditCard,
  ShieldCheck,
  Truck,
  User,
  ArrowRight,
  Mail,
} from "lucide-react";


const CATEGORIES = [
  { id: "orders", label: "Orders & Tracking", icon: Package },
  { id: "shipping", label: "Shipping & Delivery", icon: Truck },
  { id: "returns", label: "Returns & Exchanges", icon: RefreshCw },
  { id: "payment", label: "Payment & Billing", icon: CreditCard },
  { id: "account", label: "Account & Security", icon: User },
  { id: "authenticity", label: "Authenticity", icon: ShieldCheck },
];

const FAQS: Record<string, { q: string; a: string }[]> = {
  orders: [
    {
      q: "How do I track my order?",
      a: "Once your order ships, you will receive a tracking email with your carrier and tracking number. You can also log in to your account and visit the Orders section for real-time updates. Orders typically ship within 1–2 business days.",
    },
    {
      q: "Can I modify or cancel my order after placing it?",
      a: "We begin processing orders immediately to ensure fast dispatch. If you need to cancel or modify, contact us within 1 hour of placing your order at support@osw.com. After that window, we cannot guarantee changes but will do our best to help.",
    },
    {
      q: "My order says delivered but I haven't received it. What do I do?",
      a: "Check with neighbours or your building's reception first. If it's still missing after 48 hours of the delivery notification, contact our support team and we will open a carrier investigation and arrange a replacement or refund.",
    },
    {
      q: "Do you offer pre-orders?",
      a: "Yes — limited drops are occasionally available for pre-order. Pre-order items are clearly labelled on the product page. Estimated ship dates are listed, and your card is charged at the time of purchase.",
    },
  ],
  shipping: [
    {
      q: "Where do you ship to?",
      a: "We ship worldwide. International shipping is available to over 120 countries via our logistics partners DHL and FedEx. Some remote regions may have limited service — check out at checkout to see if your address qualifies.",
    },
    {
      q: "How long does delivery take?",
      a: "Domestic (US): 2–5 business days standard, 1–2 days express. International: 5–14 business days depending on customs. All orders over $150 qualify for free standard worldwide shipping.",
    },
    {
      q: "Will I be charged customs and import duties?",
      a: "International orders may be subject to customs duties and import taxes depending on your country. These charges are the responsibility of the customer and are not included in our shipping fees. We recommend checking your local regulations before ordering.",
    },
    {
      q: "Do you ship to PO Boxes?",
      a: "Unfortunately we do not ship to PO Boxes or APO/FPO addresses at this time due to carrier restrictions. Please use a physical street address at checkout.",
    },
  ],
  returns: [
    {
      q: "What is your return policy?",
      a: "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in their original packaging with all tags attached. Sale and limited-edition items are final sale and cannot be returned.",
    },
    {
      q: "How do I start a return?",
      a: "Log in to your account, navigate to your order, and click 'Request Return'. Select the items and reason, and we will email you a prepaid return label within 24 hours. Once we receive and inspect your return, a refund or exchange will be processed within 5–7 business days.",
    },
    {
      q: "Can I exchange for a different size or colour?",
      a: "Yes — exchanges are free and we prioritise them. Initiate an exchange the same way as a return through your account. If the item you want is in stock, we will ship it as soon as your return is received. If out of stock, we'll issue a refund.",
    },
    {
      q: "What if I receive a damaged or incorrect item?",
      a: "We sincerely apologise for any fulfilment errors. Email us at support@osw.com with your order number and photos of the issue within 7 days of delivery. We will send a replacement immediately with no return required.",
    },
  ],
  payment: [
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, and Klarna for buy-now-pay-later. All transactions are encrypted and processed securely.",
    },
    {
      q: "When will I be charged?",
      a: "Your card is charged at the time of purchase, not at dispatch. For pre-orders, you are also charged immediately. If an item becomes unavailable after payment, you will receive a full refund.",
    },
    {
      q: "Can I use multiple payment methods?",
      a: "You can apply a gift card or store credit in combination with any other payment method. However, we do not currently support splitting charges across two credit cards.",
    },
    {
      q: "I see an unfamiliar charge from OSW. What is it?",
      a: "This could be a pending authorisation from a failed order attempt that was not completed. These typically disappear within 3–5 business days. If the charge persists, email us with the amount and date and we will investigate immediately.",
    },
  ],
  account: [
    {
      q: "How do I create an account?",
      a: "Click the person icon in the top navigation or visit /register. An account lets you track orders, manage your wishlist, and gain early access to exclusive drops.",
    },
    {
      q: "I forgot my password. How do I reset it?",
      a: "On the login page, click 'Reset' next to 'Forgot Password?'. Enter your email address and we'll send a secure password reset link. The link expires in 1 hour for your security.",
    },
    {
      q: "How do I update my shipping address or email?",
      a: "Log in to your account and go to the Account Settings page. From there you can update your personal details, saved addresses, and communication preferences at any time.",
    },
    {
      q: "Is my personal data secure?",
      a: "Absolutely. We comply with GDPR and CCPA regulations. Your data is encrypted at rest and in transit, and we never sell personal information to third parties. Read our full Privacy Policy for details.",
    },
  ],
  authenticity: [
    {
      q: "Are all OSW products authentic?",
      a: "100%. Every item sold on OSW.com is produced by us directly. We do not operate through third-party resellers or marketplaces. If you see OSW products being sold elsewhere, they may be counterfeit.",
    },
    {
      q: "How do I verify the authenticity of my purchase?",
      a: "Each garment includes a unique NFC-enabled authenticity tag sewn into the label. Scan it with your phone to confirm the item's legitimacy and unlock its digital product passport.",
    },
    {
      q: "What should I do if I suspect a counterfeit?",
      a: "Please report it to anti-counterfeit@osw.com with as many details as possible. We take intellectual property seriously and work with legal authorities to remove fake listings.",
    },
  ],
};


function AccordionItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        id={`faq-item-${index}`}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-6 py-6 text-left group"
      >
        <span className="text-sm font-medium uppercase tracking-[0.15em] text-foreground group-hover:text-foreground/70 transition-colors leading-relaxed">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-foreground/40 mt-0.5 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={1.5}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          open ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0 pb-0"
        }`}
      >
        <p className="text-sm font-light text-foreground/70 leading-relaxed">
          {a}
        </p>
      </div>
    </div>
  );
}


export default function Help() {
  const [activeCategory, setActiveCategory] = useState("orders");

  const activeFaqs = FAQS[activeCategory] ?? [];
  const activeMeta = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground">

      <div className="w-full bg-foreground text-background py-20 md:py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 12px)",
          }}
        />
        <div className="container mx-auto px-6 max-w-7xl relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-4">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-background/50">
              Support Centre
            </p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter uppercase leading-none">
              Help &amp; <span className="font-medium italic">FAQ</span>
            </h1>
          </div>
          <p className="text-sm font-light text-background/60 max-w-sm leading-relaxed">
            Can&apos;t find your answer here? Our team responds within 24 hours.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-7xl py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-16">

          <aside className="w-full lg:w-64 shrink-0 mb-10 lg:mb-0">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40 mb-4 px-1">
              Topics
            </p>
            <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 no-scrollbar" aria-label="Help topics">
              {CATEGORIES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  id={`help-category-${id}`}
                  onClick={() => setActiveCategory(id)}
                  className={`flex items-center gap-3 px-4 py-3 text-left text-xs font-medium tracking-[0.15em] uppercase whitespace-nowrap transition-all duration-200 border ${
                    activeCategory === id
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground/60 border-transparent hover:border-border hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" strokeWidth={1.5} />
                  {label}
                </button>
              ))}
            </nav>

            <div className="hidden lg:block mt-12 border border-border p-6 space-y-4">
              <Mail className="w-5 h-5 text-foreground/40" strokeWidth={1} />
              <div className="space-y-1">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">
                  Still stuck?
                </p>
                <p className="text-xs font-light text-foreground/60 leading-relaxed">
                  Our team is online Mon–Fri, 9am–6pm EST.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-foreground hover:text-foreground/60 transition-colors"
              >
                Contact Us <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="pb-8 mb-2 border-b border-border flex items-center gap-4">
              {activeMeta && (
                <div className="p-3 bg-muted border border-border">
                  <activeMeta.icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                </div>
              )}
              <div>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight uppercase text-foreground">
                  {activeMeta?.label}
                </h2>
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-foreground/40 mt-1">
                  {activeFaqs.length} questions
                </p>
              </div>
            </div>

            <div>
              {activeFaqs.map((item, i) => (
                <AccordionItem key={i} index={i} q={item.q} a={item.a} />
              ))}
            </div>

            <div className="mt-16 bg-muted border border-border p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2">
                <p className="text-xs font-bold tracking-[0.3em] uppercase text-foreground/50">
                  Need more help?
                </p>
                <h3 className="text-xl md:text-2xl font-light tracking-tight uppercase text-foreground">
                  Talk to our team directly
                </h3>
                <p className="text-sm font-light text-foreground/60">
                  We respond to every inquiry within 24 hours, guaranteed.
                </p>
              </div>
              <Link
                href="/contact"
                id="help-contact-cta"
                className="group inline-flex items-center justify-between gap-8 bg-foreground text-background px-8 py-5 text-xs font-medium tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Get In Touch</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
