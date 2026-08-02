import Image from "next/image";
import { ArrowRight, Globe, Shield, Zap } from "lucide-react";

export default function About() {
  return (
    <section className="relative py-20 bg-background" id="about">
      <div className="container mx-auto px-6 max-w-7xl">
        

        <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
          <p className="text-sm font-medium tracking-[0.3em] uppercase text-foreground/50">Our Manifesto</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground leading-tight">
            "Streetwear isn't just about clothes. It's the <span className="font-medium italic">uniform</span> of a generation rewriting the rules."
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          

          <div className="w-full lg:w-1/2 relative">
            <div className="relative h-[500px] w-full bg-muted overflow-hidden group">
              <div className="absolute inset-0 flex flex-col items-center justify-center transition-transform duration-1000 group-hover:scale-105">
                <span className="text-6xl font-light tracking-widest text-foreground/20 uppercase">OSW</span>
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(-45deg, currentColor 0, currentColor 2px, transparent 2px, transparent 10px)" }}></div>
              </div>
            </div>


            <div className="absolute -bottom-10 -right-4 lg:-right-10 bg-background p-6 border border-border shadow-xl flex items-center gap-6">
              <div className="flex flex-col">
                <span className="font-light text-3xl text-foreground">50k+</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/60">Orders Shipped</span>
              </div>
              <div className="w-[1px] h-12 bg-border"></div>
              <div className="flex flex-col">
                <span className="font-light text-3xl text-foreground">100%</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/60">Authentic</span>
              </div>
            </div>
          </div>


          <div className="w-full lg:w-1/2 space-y-10 py-8">
            <div className="space-y-6">
              <h3 className="text-2xl md:text-3xl font-light tracking-tight text-foreground uppercase">
                The Heritage
              </h3>
              <p className="text-base text-foreground/70 leading-relaxed font-light">
                Born from the concrete jungles, Official StreetWear is a movement. We blend high-end fashion aesthetics with raw, unfiltered street culture to create pieces that speak for themselves. Our garments are designed to last, visually and physically.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 pt-6 border-t border-border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-muted border border-border"><Shield className="w-5 h-5 text-foreground" /></div>
                <div>
                  <h4 className="text-sm font-medium uppercase tracking-widest text-foreground">Uncompromising Quality</h4>
                  <p className="text-sm text-foreground/60 font-light mt-1">Handpicked heavyweight cottons and technical fabrics ensuring maximum durability.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-muted border border-border"><Zap className="w-5 h-5 text-foreground" /></div>
                <div>
                  <h4 className="text-sm font-medium uppercase tracking-widest text-foreground">Exclusive Drops</h4>
                  <p className="text-sm text-foreground/60 font-light mt-1">Limited runs ensure your style remains unique. Once it's gone, it's gone.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-muted border border-border"><Globe className="w-5 h-5 text-foreground" /></div>
                <div>
                  <h4 className="text-sm font-medium uppercase tracking-widest text-foreground">Global Community</h4>
                  <p className="text-sm text-foreground/60 font-light mt-1">We ship worldwide, connecting a global community of forward-thinkers.</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
               <a href="#products" className="inline-flex items-center gap-4 text-xs font-medium tracking-[0.2em] uppercase text-foreground hover:text-foreground/70 transition-colors">
                  <span>Explore the collection</span>
                  <ArrowRight className="w-4 h-4" />
               </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
