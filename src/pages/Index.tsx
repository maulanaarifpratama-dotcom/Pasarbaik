import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, TrendingUp, Briefcase, Building2, Handshake, BarChart3, ShieldCheck, Globe, Leaf } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import productGift from "@/assets/product-corporate-gift.jpg";
import productFood from "@/assets/product-food.jpg";
import productEco from "@/assets/product-eco.jpg";
import { aggregateMetrics, organizations } from "@/data/mockData";

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroBg})` }} />
      <div className="absolute inset-0 bg-primary/80" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded-full px-4 py-1.5 mb-6 animate-fade-up">
          <Globe size={14} className="text-accent" />
          <span className="text-accent font-semibold text-xs uppercase tracking-widest">Impact Supply Aggregator Platform</span>
        </div>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Connecting Impact Products<br />
          <span className="text-accent">to Market Access</span>
        </h1>
        <p className="text-primary-foreground/80 text-lg md:text-xl max-w-3xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Platform infrastruktur yang mengagregasi supply dari program CSR, NGO, dan pemerintah — 
          menghubungkan UMKM berdampak dengan corporate buyers melalui procurement yang terstandar dan berdampak.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/products">
            <Button variant="hero" size="lg" className="text-base px-8">
              Explore Products <ArrowRight className="ml-1" size={18} />
            </Button>
          </Link>
          <Link to="/programs">
            <Button variant="hero-outline" size="lg" className="text-base px-8">
              View Programs
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function FlowSection() {
  const steps = [
    { icon: Building2, title: "CSR / NGO / Government", desc: "Program pembinaan mendaftarkan UMKM binaan ke platform", color: "bg-secondary" },
    { icon: Users, title: "UMKM Suppliers", desc: "UMKM mengunggah profil, produk, dan kapasitas produksi", color: "bg-secondary" },
    { icon: Handshake, title: "PasarBaik Aggregation", desc: "Verifikasi, standarisasi, impact tracking, dan agregasi supply", color: "bg-accent/10" },
    { icon: Briefcase, title: "Corporate Buyers", desc: "Procurement terstandar melalui RFQ system dengan impact traceability", color: "bg-secondary" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-semibold text-xs uppercase tracking-widest mb-2">How It Works</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            From Development Programs to Market Access
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto text-sm">
            Setiap produk di PasarBaik berasal dari program pembinaan dan dapat ditelusuri dampaknya — bukan marketplace biasa.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="text-center relative">
              <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl ${step.color} flex items-center justify-center`}>
                <step.icon className="text-primary" size={28} />
              </div>
              <div className="text-xs font-bold text-accent mb-1">Step {i + 1}</div>
              <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-3 top-7 text-muted-foreground/30" size={20} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformPillars() {
  const pillars = [
    { icon: ShieldCheck, title: "Supply Aggregation", desc: "Mengagregasi kapasitas produksi dari berbagai UMKM untuk memenuhi volume order korporat" },
    { icon: BarChart3, title: "Impact Tracking", desc: "Setiap produk dilengkapi metrik dampak sosial yang terukur dan dapat diverifikasi" },
    { icon: Globe, title: "Procurement Matching", desc: "Menghubungkan kebutuhan buyer dengan supply UMKM yang tepat melalui RFQ system" },
    { icon: Leaf, title: "Program Traceability", desc: "Setiap produk dapat ditelusuri ke organisasi, program, supplier, dan dampak komunitas" },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-semibold text-xs uppercase tracking-widest mb-2">Platform Infrastructure</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Not a Marketplace. An Impact Infrastructure.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, i) => (
            <div key={i} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <p.icon className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const categories = [
    { img: productGift, title: "Corporate Gifts", desc: "Handcrafted batik, kerajinan tangan, dan hampers premium dari program pembinaan", badge: "15+ Products" },
    { img: productFood, title: "Specialty Food", desc: "Produk pangan lokal organik dan olahan khas daerah bersertifikat", badge: "12+ Products" },
    { img: productEco, title: "Sustainable Products", desc: "Produk ramah lingkungan dari bahan daur ulang dan alami", badge: "10+ Products" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-semibold text-xs uppercase tracking-widest mb-2">Curated Products</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Products from Impact Programs</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">Setiap produk berasal dari program pembinaan dan dilengkapi impact traceability.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <div key={i} className="group rounded-xl overflow-hidden bg-card shadow-sm hover:shadow-xl transition-shadow border border-border">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">{cat.badge}</div>
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
            <Button variant="default" size="lg">View Full Catalog <ArrowRight className="ml-1" size={18} /></Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ImpactMetrics() {
  const metrics = [
    { value: `${aggregateMetrics.totalUMKM}+`, label: "UMKM Empowered", icon: Users },
    { value: `${aggregateMetrics.totalPrograms}`, label: "Active Programs", icon: Building2 },
    { value: aggregateMetrics.totalTransactions, label: "Total Transactions", icon: TrendingUp },
    { value: `${aggregateMetrics.jobsCreated}+`, label: "Jobs Created", icon: Briefcase },
    { value: `${aggregateMetrics.womenWorkers}+`, label: "Women Workers", icon: Users },
    { value: `${aggregateMetrics.householdsSupported}+`, label: "Households Supported", icon: BarChart3 },
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-semibold text-xs uppercase tracking-widest mb-2">Measurable Impact</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Transparent & Traceable Impact</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {metrics.map((m, i) => (
            <div key={i} className="text-center animate-count-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <m.icon className="mx-auto mb-3 text-accent" size={28} />
              <div className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-1">{m.value}</div>
              <div className="text-primary-foreground/60 text-xs">{m.label}</div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/impact">
            <Button variant="hero-outline" size="lg">View Impact Dashboard <ArrowRight className="ml-1" size={18} /></Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Trusted Partners</p>
        <h3 className="font-display text-xl font-semibold text-foreground mb-8">Organizations Powering Impact</h3>
        <div className="flex flex-wrap justify-center items-center gap-10">
          {organizations.map((org) => (
            <div key={org.id} className="text-center">
              <div className="text-base font-semibold text-foreground/50 font-display">{org.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{org.type}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Source with Impact?</h2>
        <p className="text-muted-foreground mb-8">
          Hubungi kami untuk kebutuhan procurement berdampak atau daftarkan program pembinaan UMKM Anda di PasarBaik.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/rfq"><Button variant="default" size="lg" className="px-8">Request Quotation</Button></Link>
          <Link to="/csr"><Button variant="outline" size="lg" className="px-8">Register Your Program</Button></Link>
        </div>
      </div>
    </section>
  );
}

function Index() {
  return (
    <main>
      <HeroSection />
      <FlowSection />
      <PlatformPillars />
      <FeaturedProducts />
      <ImpactMetrics />
      <PartnersSection />
      <CTASection />
    </main>
  );
}

export default Index;
