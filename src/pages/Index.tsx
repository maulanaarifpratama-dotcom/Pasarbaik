import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Users, TrendingUp, Briefcase, Building2, Handshake, BarChart3, ShieldCheck, Globe, Leaf, Package, Heart, MapPin } from "lucide-react";
import { useProducts, usePartners, useImpactReports, useSuppliers, usePrograms } from "@/hooks/useSupabaseQuery";

function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-emerald-light opacity-90" />
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&h=1080&fit=crop')", backgroundSize: "cover", backgroundPosition: "center" }} />
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
          menghubungkan UMKM berdampak dengan corporate buyers.
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
    { icon: Building2, title: "CSR / NGO / Government", desc: "Program pembinaan mendaftarkan UMKM binaan ke platform" },
    { icon: Users, title: "UMKM Suppliers", desc: "UMKM mengunggah profil, produk, dan kapasitas produksi" },
    { icon: Handshake, title: "PasarBaik Aggregation", desc: "Verifikasi, standarisasi, impact tracking, dan agregasi supply" },
    { icon: Briefcase, title: "Corporate Buyers", desc: "Procurement terstandar melalui RFQ system dengan impact traceability" },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-semibold text-xs uppercase tracking-widest mb-2">How It Works</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">From Development Programs to Market Access</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="text-center relative">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-secondary flex items-center justify-center">
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

function MarketplacePreview() {
  const { data: products, isLoading } = useProducts();

  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-semibold text-xs uppercase tracking-widest mb-2">Marketplace</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Products from Impact Programs</h2>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-4">
                <Skeleton className="aspect-square mb-4 rounded-lg" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products?.slice(0, 8).map((p) => (
              <Link key={p.id} to={`/products/${p.slug}`} className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="aspect-square bg-secondary overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="text-muted-foreground" size={48} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{(p.suppliers as any)?.name}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {p.impact_tags?.slice(0, 2).map((tag: string) => (
                      <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                  {p.price && <p className="text-sm font-semibold text-foreground mt-2">{p.price}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/products">
            <Button size="lg">View Full Catalog <ArrowRight className="ml-1" size={18} /></Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ImpactMetrics() {
  const { data: reports } = useImpactReports();
  const { data: suppliers } = useSuppliers();
  const { data: programs } = usePrograms();
  const { data: products } = useProducts();

  const latest = reports?.[0];
  const metrics = (latest?.metrics as any) || {};

  const stats = [
    { value: suppliers?.length || 0, label: "UMKM Suppliers", icon: Users },
    { value: programs?.length || 0, label: "Active Programs", icon: Building2 },
    { value: products?.length || 0, label: "Products", icon: Package },
    { value: metrics.jobs_created || 0, label: "Jobs Created", icon: Briefcase },
    { value: metrics.women_workers || 0, label: "Women Workers", icon: Heart },
    { value: metrics.households_supported || 0, label: "Households", icon: BarChart3 },
  ];

  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-semibold text-xs uppercase tracking-widest mb-2">Measurable Impact</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">Transparent & Traceable</h2>
          {metrics.revenue_generated && (
            <p className="text-accent text-xl font-bold mt-3">{metrics.revenue_generated} Revenue Generated</p>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {stats.map((m, i) => (
            <div key={i} className="text-center bg-primary-foreground/5 rounded-xl p-6 backdrop-blur-sm animate-count-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <m.icon className="mx-auto mb-3 text-accent" size={28} />
              <div className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-1">{typeof m.value === 'number' ? m.value.toLocaleString() : m.value}+</div>
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

function ProgramsPreview() {
  const { data: programs, isLoading } = usePrograms();

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-accent font-semibold text-xs uppercase tracking-widest mb-2">Development Programs</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">Powered by Impact Programs</h2>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programs?.slice(0, 6).map((p) => (
              <Link key={p.id} to={`/programs/${p.slug}`} className="group bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="text-primary" size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{p.title}</h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={10} /> {p.location}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
                <div className="flex gap-1 flex-wrap">
                  {p.impact_tags?.slice(0, 2).map((tag: string) => (
                    <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/programs">
            <Button variant="outline" size="lg">View All Programs <ArrowRight className="ml-1" size={18} /></Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function PartnersSection() {
  const { data: partners, isLoading } = usePartners();

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4 text-center">
        <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Trusted Partners</p>
        <h3 className="font-display text-xl font-semibold text-foreground mb-8">Organizations Powering Impact</h3>
        {isLoading ? (
          <div className="flex gap-10 justify-center">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-36 rounded-xl" />)}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-6">
            {partners?.map((p) => (
              <div key={p.id} className="bg-card rounded-xl border border-border px-6 py-4 min-w-[140px]">
                <div className="text-sm font-semibold text-foreground font-display">{p.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.type}</div>
              </div>
            ))}
          </div>
        )}
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
          Hubungi kami untuk kebutuhan procurement berdampak atau daftarkan program pembinaan UMKM Anda.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/rfq"><Button size="lg" className="px-8">Request Quotation</Button></Link>
          <Link to="/programs"><Button variant="outline" size="lg" className="px-8">View Programs</Button></Link>
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
      <MarketplacePreview />
      <ProgramsPreview />
      <ImpactMetrics />
      <PartnersSection />
      <CTASection />
    </main>
  );
}

export default Index;
