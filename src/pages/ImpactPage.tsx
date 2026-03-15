import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Package, Briefcase, TrendingUp, BarChart3, Globe, Heart, Leaf, DollarSign } from "lucide-react";
import { useImpactReports, useSuppliers, usePrograms, useProducts } from "@/hooks/useSupabaseQuery";

function ImpactPage() {
  const { data: reports, isLoading } = useImpactReports();
  const { data: suppliers } = useSuppliers();
  const { data: programs } = usePrograms();
  const { data: products } = useProducts();

  const latest = reports?.[0];
  const metrics = (latest?.metrics as any) || {};

  const cards = [
    { label: "UMKM Suppliers", value: suppliers?.length || 0, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Active Programs", value: programs?.length || 0, icon: Building2, color: "bg-accent/10 text-accent" },
    { label: "Products Listed", value: products?.length || 0, icon: Package, color: "bg-primary/10 text-primary" },
    { label: "Beneficiaries", value: latest?.beneficiaries || 0, icon: Heart, color: "bg-destructive/10 text-destructive" },
    { label: "Jobs Created", value: metrics.jobs_created || 0, icon: Briefcase, color: "bg-accent/10 text-accent" },
    { label: "Women Workers", value: metrics.women_workers || 0, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Villages Reached", value: metrics.villages_reached || 0, icon: Globe, color: "bg-accent/10 text-accent" },
    { label: "Households Supported", value: metrics.households_supported || 0, icon: BarChart3, color: "bg-primary/10 text-primary" },
  ];

  return (
    <main className="pt-16">
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-primary-foreground">Impact Dashboard</h1>
          <p className="text-primary-foreground/60 mt-2">Measurable social impact from all programs</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {cards.map((c, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-5 text-center hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${c.color}`}>
                    <c.icon size={24} />
                  </div>
                  <div className="font-display text-2xl font-bold text-foreground">{c.value.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
                </div>
              ))}
            </div>

            {metrics.revenue_generated && (
              <div className="bg-primary rounded-xl p-8 text-center mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                    <TrendingUp className="text-accent" size={28} />
                  </div>
                </div>
                <div className="font-display text-3xl font-bold text-primary-foreground">{metrics.revenue_generated}</div>
                <div className="text-primary-foreground/60 text-sm mt-1">Total Revenue Generated for UMKM</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 max-w-lg mx-auto">
                  {metrics.products_sold && (
                    <div className="bg-primary-foreground/10 rounded-lg p-3">
                      <div className="font-bold text-primary-foreground text-lg">{metrics.products_sold?.toLocaleString()}</div>
                      <div className="text-primary-foreground/60 text-xs">Products Sold</div>
                    </div>
                  )}
                  {metrics.carbon_offset_tons && (
                    <div className="bg-primary-foreground/10 rounded-lg p-3">
                      <div className="font-bold text-primary-foreground text-lg">{metrics.carbon_offset_tons}</div>
                      <div className="text-primary-foreground/60 text-xs">CO₂ Offset (tons)</div>
                    </div>
                  )}
                  <div className="bg-primary-foreground/10 rounded-lg p-3">
                    <div className="font-bold text-primary-foreground text-lg">{reports?.length || 0}</div>
                    <div className="text-primary-foreground/60 text-xs">Reports Published</div>
                  </div>
                </div>
              </div>
            )}

            {latest?.sdg_tags && (
              <div className="bg-card rounded-xl border border-border p-6 mb-8">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Leaf className="text-primary" size={20} /> SDG Alignment
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {latest.sdg_tags.map((tag: string) => (
                    <Badge key={tag} className="bg-primary/10 text-primary border-primary/20 px-3 py-1">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Impact Reports</h2>
            <div className="space-y-4">
              {reports?.map((r) => {
                const rm = (r.metrics as any) || {};
                return (
                  <div key={r.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground text-lg">{r.title}</h3>
                      <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">{r.date}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="bg-muted rounded-lg p-3 text-center">
                        <div className="font-bold text-foreground">{r.beneficiaries?.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Beneficiaries</div>
                      </div>
                      {rm.jobs_created && (
                        <div className="bg-muted rounded-lg p-3 text-center">
                          <div className="font-bold text-foreground">{rm.jobs_created?.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Jobs Created</div>
                        </div>
                      )}
                      {rm.women_workers && (
                        <div className="bg-muted rounded-lg p-3 text-center">
                          <div className="font-bold text-foreground">{rm.women_workers?.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Women Workers</div>
                        </div>
                      )}
                      {rm.villages_reached && (
                        <div className="bg-muted rounded-lg p-3 text-center">
                          <div className="font-bold text-foreground">{rm.villages_reached}</div>
                          <div className="text-xs text-muted-foreground">Villages</div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {r.sdg_tags?.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default ImpactPage;
