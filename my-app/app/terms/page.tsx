import Link from "next/link";
import { ArrowLeft, FileText, ShoppingBag, AlertTriangle, Scale, RefreshCw, Globe } from "lucide-react";

export const metadata = {
  title: "Terms of Service — OSW.",
  description: "Official StreetWear's Terms of Service. Read the rules and policies governing your use of our platform.",
};

const sections = [
  {
    icon: FileText,
    title: "Acceptance of Terms",
    content: [
      {
        subtitle: "Agreement to terms",
        body: "By accessing or using the OSW website, mobile application, or any associated services (collectively, the \"Platform\"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our Platform.",
      },
      {
        subtitle: "Eligibility",
        body: "You must be at least 16 years of age to use our Platform. By using our services, you represent and warrant that you meet this age requirement. If you are under 18, you must have your parent or legal guardian's consent to purchase products.",
      },
      {
        subtitle: "Changes to terms",
        body: "We reserve the right to modify these Terms at any time. We will notify you of material changes via email or a prominent notice on our website at least 14 days in advance. Your continued use of the Platform after changes take effect constitutes acceptance of the updated Terms.",
      },
    ],
  },
  {
    icon: ShoppingBag,
    title: "Orders & Purchases",
    content: [
      {
        subtitle: "Order acceptance",
        body: "Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order at our discretion. An order is confirmed only when you receive an order confirmation email from us. We may cancel orders if a product is out of stock, if pricing errors occur, or if we suspect fraudulent activity.",
      },
      {
        subtitle: "Pricing & availability",
        body: "All prices are displayed in Philippine pesos (₱) unless otherwise stated. We reserve the right to change prices at any time without prior notice. Products are subject to availability and we do not guarantee that items will remain in stock. If a product you ordered becomes unavailable, we will notify you and issue a full refund.",
      },
      {
        subtitle: "Payment",
        body: "You agree to provide accurate and complete payment information. By submitting your payment details, you authorise us to charge the total order amount including any applicable taxes and shipping fees. All payments are processed securely by our PCI-compliant payment partners.",
      },
      {
        subtitle: "Sales tax",
        body: "Applicable sales tax will be calculated and added to your order total at checkout based on your shipping address and applicable tax laws. International customers are responsible for any import duties, customs fees, or local taxes applicable in their jurisdiction.",
      },
    ],
  },
  {
    icon: RefreshCw,
    title: "Returns & Refunds",
    content: [
      {
        subtitle: "Return eligibility",
        body: "We accept returns within 30 days of the delivery date. Items must be unworn, unwashed, undamaged, and in their original packaging with all tags attached. Sale items, limited edition releases, and items marked as final sale are not eligible for return or exchange.",
      },
      {
        subtitle: "Refund processing",
        body: "Once we receive and inspect your return, we will process your refund within 5–7 business days. Refunds are issued to the original payment method. Shipping fees are non-refundable unless the return is due to our error or a defective product.",
      },
      {
        subtitle: "Exchanges",
        body: "Exchanges for different sizes or colours are subject to availability. Initiate an exchange through your account portal. We will ship your replacement item as soon as we receive your return. If the desired item is no longer available, a full refund will be issued.",
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: "Prohibited Conduct",
    content: [
      {
        subtitle: "Prohibited activities",
        body: "You agree not to: use the Platform for any unlawful purpose; attempt to gain unauthorised access to our systems; scrape, harvest, or collect data from the Platform without our written consent; use automated bots or scripts to place orders, create accounts, or interact with the Platform; or engage in any activity that could damage, disable, or impair our infrastructure.",
      },
      {
        subtitle: "Resale restrictions",
        body: "You may not purchase our products for the purpose of commercial resale without our prior written authorisation. We reserve the right to limit quantities per customer and to cancel orders that appear to be placed for commercial resale purposes.",
      },
      {
        subtitle: "Intellectual property",
        body: "All content on the Platform — including but not limited to our logo, product images, copy, graphics, and design — is the exclusive property of Official StreetWear and protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.",
      },
    ],
  },
  {
    icon: Scale,
    title: "Disclaimers & Liability",
    content: [
      {
        subtitle: "As-is basis",
        body: "The Platform and its content are provided on an \"as-is\" and \"as-available\" basis without warranties of any kind, either express or implied. We do not warrant that the Platform will be uninterrupted, error-free, or free of viruses or other harmful components.",
      },
      {
        subtitle: "Limitation of liability",
        body: "To the fullest extent permitted by law, OSW shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including but not limited to loss of profits, data, or goodwill — arising from your use of or inability to use the Platform or our products, even if we have been advised of the possibility of such damages.",
      },
      {
        subtitle: "Indemnification",
        body: "You agree to indemnify, defend, and hold harmless OSW and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses arising from your violation of these Terms or your use of the Platform.",
      },
    ],
  },
  {
    icon: Globe,
    title: "Governing Law & Disputes",
    content: [
      {
        subtitle: "Governing law",
        body: "These Terms are governed by and construed in accordance with the laws of the State of New York, United States, without regard to conflict of law principles.",
      },
      {
        subtitle: "Dispute resolution",
        body: "We encourage you to contact us first at legal@osw.com if you have a dispute. If we cannot resolve it informally, disputes shall be settled through binding arbitration in New York, NY, in accordance with the rules of the American Arbitration Association, except that either party may seek injunctive relief in a court of competent jurisdiction.",
      },
      {
        subtitle: "Class action waiver",
        body: "You agree to resolve disputes with us on an individual basis. You waive any right to bring or participate in a class action lawsuit or class-wide arbitration against OSW.",
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] bg-background text-foreground">

      <div className="w-full bg-foreground text-background py-20 md:py-28 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 12px)",
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
              Terms of <span className="font-medium italic">Service</span>
            </h1>
            <p className="text-sm font-light text-background/60 max-w-md leading-relaxed pt-2">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl py-16 md:py-20">
        <p className="text-base font-light text-foreground/70 leading-relaxed border-l-2 border-foreground pl-6">
          These Terms of Service ("Terms") govern your access to and use of Official StreetWear's website, products, and services. Please read them carefully. These terms contain important information about your legal rights, remedies, and obligations. By accessing or using our Platform, you agree to these Terms.
        </p>
      </div>

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

      <div className="border-t border-border">
        <div className="container mx-auto px-6 max-w-4xl py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">
              Legal questions?
            </p>
            <p className="text-sm font-light text-foreground/60">
              Email us at{" "}
              <a href="mailto:legal@osw.com" className="underline underline-offset-4 hover:text-foreground transition-colors">
                legal@osw.com
              </a>
            </p>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium tracking-[0.2em] uppercase">
            <Link href="/privacy" className="text-foreground/60 hover:text-foreground transition-colors underline underline-offset-4">
              Privacy Policy
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
