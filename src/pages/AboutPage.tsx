import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePartners } from "@/hooks/useSupabaseQuery";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, ShieldCheck, BarChart3, Leaf, Users, Building2 } from "lucide-react";

function AboutPage() {
  const { data: partners, isLoading } = usePartners();

  const pillars = [
    { icon: ShieldCheck, title: "Supply Aggregation", desc: "Aggregating production capacity from UMKM to meet corporate volume orders." },
    { icon: BarChart3, title: "Impact Tracking", desc: "Every product includes measurable social impact metrics." },
    { icon: Globe, title: "Procurement Matching", desc: "Connecting buyer needs with the right UMKM supply through RFQ." },
    { icon: Leaf, title: "Program Traceability", desc: "Every product traceable to organization, program, supplier, and community impact." },
  ];

  return (
    <main className="pt-16">
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold text-primary-foreground mb-4">About PasarBaik</h1>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            PasarBaik is an Impact Supply Aggregator Platform — not a marketplace. 
            We connect CSR programs, NGOs, and government initiatives with corporate buyers through standardized procurement.
          </p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-foreground">Platform Infrastructure</h2>
            <p className="text-muted-foreground mt-2">Not a marketplace. An impact infrastructure.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p, i) => (
              <div key={i} className="bg-card rounded-xl p-6 border border-border">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <p.icon className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-8">Our Partners</h2>
          {isLoading ? (
            <div className="flex gap-8 justify-center">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-32" />)}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-10">
              {partners?.map((p) => (
                <div key={p.id} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-card border border-border flex items-center justify-center mb-2">
                    <Building2 className="text-primary" size={24} />
                  </div>
                  <p className="font-semibold text-foreground text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">Join the Impact Ecosystem</h2>
          <p className="text-muted-foreground mb-8">Whether you're a corporate buyer, CSR partner, or UMKM supplier — PasarBaik connects you to impact.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/rfq"><Button size="lg">Request Quotation</Button></Link>
            <Link to="/login"><Button variant="outline" size="lg">Create Account</Button></Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
