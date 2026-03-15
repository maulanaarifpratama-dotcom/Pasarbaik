import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, Building2, Package, Briefcase, TrendingUp, BarChart3, Globe, Heart } from "lucide-react";
import { useImpactReports, useSuppliers, usePrograms, useProducts } from "@/hooks/useSupabaseQuery";

function ImpactPage() {
  const { data: reports, isLoading } = useImpactReports();
  const { data: suppliers } = useSuppliers();
  const { data: programs } = usePrograms();
  const { data: products } = useProducts();

  const latest = reports?.[0];
  const metrics = (latest?.metrics as any) || {};

  const cards = [
    { label: "UMKM Suppliers", value: suppliers?.length || 0, icon: Users },
    { label: "Active Programs", value: programs?.length || 0, icon: Building2 },
    { label: "Products Listed", value: products?.length || 0, icon: Package },
    { label: "Beneficiaries", value: latest?.beneficiaries || 0, icon: Heart },
    { label: "Jobs Created", value: metrics.jobs_created || 0, icon: Briefcase },
    { label: "Women Workers", value: metrics.women_workers || 0, icon: Users },
    { label: "Villages Reached", value: metrics.villages_reached || 0, icon: Globe },
    { label: "Households Supported", value: metrics.households_supported || 0, icon: BarChart3 },
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
                <div key={i} className="bg-card rounded-xl border border-border p-5 text-center">
                  <c.icon className="mx-auto mb-2 text-primary" size={24} />
                  <div className="font-display text-2xl font-bold text-foreground">{c.value.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                </div>
              ))}
            </div>

            {metrics.revenue_generated && (
              <div className="bg-primary rounded-xl p-8 text-center mb-8">
                <TrendingUp className="mx-auto mb-3 text-accent" size={32} />
                <div className="font-display text-3xl font-bold text-primary-foreground">{metrics.revenue_generated}</div>
                <div className="text-primary-foreground/60 text-sm">Total Revenue Generated for UMKM</div>
              </div>
            )}

            {latest?.sdg_tags && (
              <div className="bg-card rounded-xl border border-border p-6 mb-8">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">SDG Alignment</h2>
                <div className="flex gap-2 flex-wrap">
                  {latest.sdg_tags.map((tag: string) => (
                    <Badge key={tag} className="bg-primary/10 text-primary border-primary/20">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Impact Reports</h2>
            <div className="space-y-4">
              {reports?.map((r) => (
                <div key={r.id} className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{r.title}</h3>
                    <span className="text-sm text-muted-foreground">{r.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Beneficiaries: {r.beneficiaries?.toLocaleString()}</p>
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {r.sdg_tags?.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default ImpactPage;
