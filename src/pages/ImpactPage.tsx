import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Building2, Package, Briefcase, TrendingUp, BarChart3, Globe, Heart, Leaf, DollarSign, Target, ArrowRight } from "lucide-react";
import { useImpactReports, useSuppliers, usePrograms, useProducts } from "@/hooks/useSupabaseQuery";

const sdgColors: Record<string, string> = {
  "SDG 1": "bg-red-500/10 text-red-700 border-red-200",
  "SDG 2": "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  "SDG 4": "bg-red-400/10 text-red-600 border-red-200",
  "SDG 5": "bg-orange-500/10 text-orange-700 border-orange-200",
  "SDG 8": "bg-rose-500/10 text-rose-700 border-rose-200",
  "SDG 10": "bg-pink-500/10 text-pink-700 border-pink-200",
  "SDG 12": "bg-amber-500/10 text-amber-700 border-amber-200",
  "SDG 15": "bg-green-500/10 text-green-700 border-green-200",
  "SDG 17": "bg-blue-500/10 text-blue-700 border-blue-200",
};

function ImpactPage() {
  const { data: reports, isLoading } = useImpactReports();
  const { data: suppliers } = useSuppliers();
  const { data: programs } = usePrograms();
  const { data: products } = useProducts();

  const latest = reports?.[0];
  const metrics = (latest?.metrics as any) || {};

  const cards = [
    { label: "UMKM Suppliers", value: suppliers?.length || 0, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Active Programs", value: programs?.length || 0, icon: Building2, color: "bg-accent/10 text-accent-foreground" },
    { label: "Products Listed", value: products?.length || 0, icon: Package, color: "bg-primary/10 text-primary" },
    { label: "Beneficiaries", value: latest?.beneficiaries || 0, icon: Heart, color: "bg-destructive/10 text-destructive" },
    { label: "Jobs Created", value: metrics.jobs_created || 0, icon: Briefcase, color: "bg-accent/10 text-accent-foreground" },
    { label: "Women Workers", value: metrics.women_workers || 0, icon: Users, color: "bg-primary/10 text-primary" },
    { label: "Villages Reached", value: metrics.villages_reached || 0, icon: Globe, color: "bg-accent/10 text-accent-foreground" },
    { label: "Households Supported", value: metrics.households_supported || 0, icon: BarChart3, color: "bg-primary/10 text-primary" },
  ];

  // Aggregate all SDG tags
  const allSdgTags = [...new Set(reports?.flatMap((r) => r.sdg_tags || []) || [])].sort();

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
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {cards.map((c, i) => (
                <div key={i} className="bg-card rounded-xl border border-border p-5 text-center hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center ${c.color}`}>
                    <c.icon size={24} />
                  </div>
                  <div className="font-display text-2xl font-bold text-foreground">{typeof c.value === "number" ? c.value.toLocaleString() : c.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
                </div>
              ))}
            </div>

            {/* Revenue Hero */}
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

            {/* SDG Alignment */}
            {allSdgTags.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-6 mb-8">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Target className="text-primary" size={20} /> SDG Alignment
                </h2>
                <div className="flex gap-2 flex-wrap">
                  {allSdgTags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className={`px-3 py-1.5 text-sm font-medium ${sdgColors[tag] || "bg-primary/10 text-primary border-primary/20"}`}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Impact Progress Bars */}
            <div className="bg-card rounded-xl border border-border p-6 mb-8">
              <h2 className="font-display text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                <BarChart3 className="text-primary" size={20} /> Impact Progress
              </h2>
              <div className="space-y-5">
                {[
                  { label: "Beneficiaries Reached", current: latest?.beneficiaries || 0, target: 25000, color: "bg-primary" },
                  { label: "Jobs Created", current: metrics.jobs_created || 0, target: 5000, color: "bg-accent" },
                  { label: "Women Empowered", current: metrics.women_workers || 0, target: 3000, color: "bg-destructive" },
                  { label: "Villages Reached", current: metrics.villages_reached || 0, target: 150, color: "bg-primary" },
                ].map((bar, i) => {
                  const pct = Math.min((bar.current / bar.target) * 100, 100);
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-foreground">{bar.label}</span>
                        <span className="text-muted-foreground">{bar.current.toLocaleString()} / {bar.target.toLocaleString()}</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${bar.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Impact Reports Timeline */}
            <h2 className="font-display text-xl font-semibold text-foreground mb-4">Impact Reports</h2>
            <div className="space-y-4 mb-8">
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
                      {rm.revenue_generated && (
                        <div className="bg-muted rounded-lg p-3 text-center">
                          <div className="font-bold text-foreground">{rm.revenue_generated}</div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {r.sdg_tags?.map((tag: string) => (
                        <Badge key={tag} variant="outline" className={`text-xs ${sdgColors[tag] || ""}`}>{tag}</Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="bg-secondary rounded-xl p-8 text-center">
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Want to contribute to this impact?</h3>
              <p className="text-muted-foreground mb-4 text-sm">Source your products from impact programs and track your contribution.</p>
              <Link to="/rfq"><Button size="lg">Request Quotation <ArrowRight className="ml-1" size={18} /></Button></Link>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default ImpactPage;
