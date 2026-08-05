import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, Database, Globe, Mail } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — OSW.",
  description: "Official StreetWear's Privacy Policy. Learn how we collect, use, and protect your personal data.",
};

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: [
      {
        subtitle: "Information you provide",
        body: "When you create an account, place an order, or contact us, we collect personal details such as your name, email address, shipping address, phone number, and payment information (processed securely via our payment partners — we never store raw card data).",
      },
      {
        subtitle: "Information collected automatically",
        body: "When you visit our site, we automatically collect certain data including your IP address, browser type, device identifiers, pages visited, time spent on pages, and referring URLs. This helps us understand how our platform is used and improve your experience.",
      },
      {
        subtitle: "Cookies & tracking technologies",
        body: "We use cookies, pixels, and similar technologies to maintain your session, remember your cart and preferences, and serve relevant content. You can control cookie settings via your browser at any time.",
      },
    ],
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: [
      {
        subtitle: "Order fulfilment",
        body: "Your personal data is used to process and ship your orders, send order confirmations, handle returns and exchanges, and provide customer support.",
      },
      {
        subtitle: "Account management",
        body: "We use your information to create and manage your account, maintain your wishlist and order history, and communicate important account-related updates.",
      },
      {
        subtitle: "Marketing & communications",
        body: "With your consent, we may send you emails about new drops, exclusive offers, and brand updates. You can unsubscribe at any time via the link in any marketing email or through your account settings.",
      },
      {
        subtitle: "Analytics & improvement",
        body: "Aggregated, anonymised data helps us analyse trends, improve site performance, and develop new features. This data is never linked back to you personally.",
      },
    ],
  },
  {
    icon: Globe,
    title: "Information Sharing",
    content: [
      {
        subtitle: "We do not sell your data",
        body: "We never sell, rent, or trade your personal information to third parties for their own marketing purposes. Full stop.",
      },
      {
        subtitle: "Service providers",
        body: "We share data with trusted partners who assist us in running our business: payment processors (e.g., Stripe), shipping carriers (DHL, FedEx), email platforms, and analytics providers. All partners are contractually obligated to protect your data.",
      },
      {
        subtitle: "Legal obligations",
        body: "We may disclose information if required by law, court order, or government authority, or if we believe disclosure is necessary to protect the rights, property, or safety of OSW, our customers, or others.",
      },
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      {
        subtitle: "How we protect your data",
        body: "All data transmitted between your browser and our servers is encrypted using TLS (HTTPS). Sensitive data at rest is encrypted using AES-256. We conduct regular security audits and penetration tests to identify and address vulnerabilities.",
      },
      {
        subtitle: "Payment security",
        body: "We are PCI-DSS compliant. Card details are handled entirely by our payment processor and never touch our servers. We store only the last four digits and card type for your reference.",
      },
      {
        subtitle: "Data breach response",
        body: "In the event of a data breach that may affect you, we will notify you and relevant authorities within 72 hours as required by applicable law, and take immediate steps to contain and remediate the issue.",
      },
    ],
  },
  {
    icon: Shield,
    title: "Your Rights",
    content: [
      {
        subtitle: "GDPR & CCPA rights",
        body: "Depending on your location, you have the right to access, correct, delete, restrict, or port your personal data. EU residents have rights under GDPR; California residents have rights under CCPA. We honour all such requests regardless of your jurisdiction.",
      },
      {
        subtitle: "How to exercise your rights",
        body: "Submit a data request to privacy@osw.com. We will verify your identity and respond within 30 days. For deletion requests, note that we may retain certain data as required by law or for legitimate business purposes (e.g., order records for tax compliance).",
      },
      {
        subtitle: "Marketing opt-out",
        body: "You can opt out of marketing emails at any time using the unsubscribe link at the bottom of any email, or by updating your communication preferences in your account settings. Transactional emails (order confirmations, shipping updates) cannot be opted out of while you have an active account.",
      },
    ],
  },
  {
    icon: Mail,
    title: "Contact & Updates",
    content: [
      {
        subtitle: "Data controller",
        body: "Official StreetWear (\"OSW\") is the data controller for information collected through osw.com. For privacy-related queries, contact our Data Protection team at privacy@osw.com.",
      },
      {
        subtitle: "Policy updates",
        body: "We may update this Privacy Policy from time to time. If we make material changes, we will notify you via email or a prominent notice on our website at least 14 days before the changes take effect. Continued use of our services after the effective date constitutes acceptance of the revised policy.",
      },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground">

      {/* Hero */}
      <div className="w-full bg-foreground text-background py-20 md:py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 12px)",
          }}
        />
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-background/60 hover:text-background transition-colors mb-10"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Store
          </Link>
          <div className="space-y-4">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-background/50">
              Legal
            </p>
            <h1 className="text-5xl md:text-7xl font-light tracking-tighter uppercase leading-none">
              Privacy <span className="font-medium italic">Policy</span>
            </h1>
            <p className="text-sm font-light text-background/60 max-w-md leading-relaxed pt-2">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="container mx-auto px-6 max-w-4xl py-16 md:py-20">
        <p className="text-base font-light text-foreground/70 leading-relaxed border-l-2 border-foreground pl-6">
          At Official StreetWear (OSW), your privacy is not an afterthought — it is a commitment. This policy explains what personal information we collect, why we collect it, how we use and protect it, and the choices you have. We believe in full transparency, plain language, and earning your trust every day.
        </p>
      </div>

      {/* Sections */}
      <div className="container mx-auto px-6 max-w-4xl pb-24 space-y-0">
        {sections.map((section, si) => {
          const Icon = section.icon;
          return (
            <div key={si} className="border-t border-border py-12 md:py-16">
              <div className="flex items-start gap-6 mb-10">
                <div className="p-3 bg-muted border border-border shrink-0">
                  <Icon className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl md:text-3xl font-light tracking-tight uppercase text-foreground leading-tight">
                  {section.title}
                </h2>
              </div>
              <div className="space-y-8 pl-0 md:pl-16">
                {section.content.map((item, ii) => (
                  <div key={ii} className="space-y-2">
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">
                      {item.subtitle}
                    </h3>
                    <p className="text-sm font-light text-foreground/70 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-border">
        <div className="container mx-auto px-6 max-w-4xl py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">
              Questions about your data?
            </p>
            <p className="text-sm font-light text-foreground/60">
              Email us at{" "}
              <a href="mailto:privacy@osw.com" className="underline underline-offset-4 hover:text-foreground transition-colors">
                privacy@osw.com
              </a>
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium tracking-[0.2em] uppercase">
            <Link href="/terms" className="text-foreground/60 hover:text-foreground transition-colors underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-foreground hover:text-foreground/70 transition-colors">
              Contact Us →
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
