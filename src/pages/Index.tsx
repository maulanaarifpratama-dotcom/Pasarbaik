import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, ShoppingBag, TrendingUp, Briefcase, Building2, Handshake, BarChart3 } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import productGift from "@/assets/product-corporate-gift.jpg";
import productFood from "@/assets/product-food.jpg";
import productEco from "@/assets/product-eco.jpg";

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    />
    <div className="absolute inset-0 bg-primary/75" />
    <div className="relative z-10 container mx-auto px-4 text-center">
      <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4 animate-fade-up">
        Impact Supply Aggregator
      </p>
      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
        Connecting Impact Products<br />
        <span className="text-accent">to Global Markets</span>
      </h1>
      <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
        Platform yang menghubungkan UMKM berdampak dengan corporate buyers melalui supply aggregation yang terstandar.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
        <Link to="/products">
          <Button variant="hero" size="lg" className="text-base px-8">
            Explore Products <ArrowRight className="ml-1" size={18} />
          </Button>
        </Link>
        <Link to="/csr">
          <Button variant="hero-outline" size="lg" className="text-base px-8">
            Become a Partner
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

const HowItWorks = () => {
  const steps = [
    { icon: Building2, title: "CSR / NGO Programs", desc: "Program CSR mendaftarkan UMKM binaan ke platform" },
    { icon: Users, title: "UMKM Suppliers", desc: "UMKM mengunggah produk dan kapasitas produksi" },
    { icon: Handshake, title: "PasarBaik Aggregation", desc: "Verifikasi, standarisasi, dan agregasi supply" },
    { icon: Briefcase, title: "Corporate Buyers", desc: "Buyer melakukan procurement melalui RFQ system" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-2">How It Works</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            From Community to Corporation
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-secondary flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <step.icon className="text-primary" size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2">
                  <ArrowRight className="text-muted-foreground/30" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedProducts = () => {
  const categories = [
    { img: productGift, title: "Corporate Gifts", desc: "Handcrafted batik, kerajinan tangan, dan hampers premium" },
    { img: productFood, title: "Specialty Food", desc: "Produk pangan lokal organik dan olahan khas daerah" },
    { img: productEco, title: "Sustainable Products", desc: "Produk ramah lingkungan dari bahan daur ulang dan alami" },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-2">Featured Products</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Curated Impact Products
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="group rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-xl transition-shadow">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-card-foreground mb-2">{cat.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/products">
            <Button variant="default" size="lg">
              View Full Catalog <ArrowRight className="ml-1" size={18} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

const ImpactMetrics = () => {
  const metrics = [
    { value: "120+", label: "UMKM Empowered", icon: Users },
    { value: "35", label: "Corporate Buyers", icon: Briefcase },
    { value: "Rp 3.2B", label: "Total Transactions", icon: TrendingUp },
    { value: "850+", label: "Jobs Created", icon: ShoppingBag },
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-2">Our Impact</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
            Measurable Social Impact
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((m, i) => (
            <div key={i} className="text-center animate-count-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <m.icon className="mx-auto mb-3 text-accent" size={32} />
              <div className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-1">{m.value}</div>
              <div className="text-primary-foreground/60 text-sm">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PartnersSection = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto px-4 text-center">
      <p className="text-muted-foreground text-sm uppercase tracking-widest mb-8">Trusted By</p>
      <div className="flex flex-wrap justify-center items-center gap-10 opacity-50">
        {["CSR Partner A", "NGO Partner B", "Corporate C", "Foundation D"].map((name) => (
          <div key={name} className="text-lg font-semibold text-foreground/40 font-display">{name}</div>
        ))}
      </div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-20 bg-secondary">
    <div className="container mx-auto px-4 text-center max-w-2xl">
      <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
        Ready to Source with Impact?
      </h2>
      <p className="text-muted-foreground mb-8">
        Hubungi kami untuk kebutuhan procurement Anda atau daftarkan program CSR Anda di PasarBaik.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/rfq">
          <Button variant="default" size="lg" className="px-8">
            Request Quotation
          </Button>
        </Link>
        <Link to="/csr">
          <Button variant="outline" size="lg" className="px-8">
            Partner With Us
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

function Index() {
  return (
    <main>
      <HeroSection />
      <HowItWorks />
      <FeaturedProducts />
      <ImpactMetrics />
      <PartnersSection />
      <CTASection />
    </main>
  );
}

export default Index;
