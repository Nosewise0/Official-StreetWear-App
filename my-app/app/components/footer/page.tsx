import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-foreground text-background py-16 md:py-24 border-t border-border mt-auto">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-4xl font-light tracking-widest uppercase">OSW.</h2>
            <p className="text-sm font-light text-background/70 leading-relaxed max-w-sm">
              Defining modern streetwear. Exclusive drops, global community, uncompromising aesthetic.
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-background/50 transition-colors"><FaInstagram /></a>
              <a href="#" className="hover:text-background/50 transition-colors"><FaTiktok /></a>
              <a href="#" className="hover:text-background/50 transition-colors"><FaFacebook /></a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase">Shop</h4>
            <div className="flex flex-col space-y-4 text-sm font-light text-background/70">
              <Link href="/products" className="hover:text-background transition-colors">New Arrivals</Link>
              <Link href="/products" className="hover:text-background transition-colors">Menswear</Link>
              <Link href="/products" className="hover:text-background transition-colors">Womenswear</Link>
              <Link href="/products" className="hover:text-background transition-colors">Accessories</Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase">Support</h4>
            <div className="flex flex-col space-y-4 text-sm font-light text-background/70">
              <Link href="/contact" className="hover:text-background transition-colors">Contact Us</Link>
              <Link href="/help" className="hover:text-background transition-colors">Help Center</Link>
              <Link href="#" className="hover:text-background transition-colors">Shipping & Returns</Link>
              <Link href="/help" className="hover:text-background transition-colors">FAQ</Link>
              <Link href="#" className="hover:text-background transition-colors">Track Order</Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase">Newsletter</h4>
            <p className="text-sm font-light text-background/70">Join for early access to drops.</p>
            <form className="relative flex items-center">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="w-full bg-transparent border-b border-background/30 py-3 text-xs tracking-widest uppercase focus:outline-none focus:border-background transition-colors placeholder:text-background/30 font-light"
              />
              <button type="button" className="absolute right-0 p-2 hover:text-background/50 transition-colors">
                <ArrowRight className="w-4 h-4" strokeWidth={1} />
              </button>
            </form>
          </div>

        </div>

        <div className="pt-8 border-t border-background/20 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-medium tracking-[0.2em] uppercase text-background/50">
          <p>&copy; {new Date().getFullYear()} Official StreetWear. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-background transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-background transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
