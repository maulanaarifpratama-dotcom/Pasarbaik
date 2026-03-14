import { Users, TrendingUp, Briefcase, Heart, BarChart3, Package, Building2, Globe } from "lucide-react";
import { aggregateMetrics, programs, products, suppliers, getOrganization } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ImpactPage = () => {
  const topMetrics = [
    { value: `${aggregateMetrics.totalUMKM}+`, label: "UMKM Aktif", icon: Users },
    { value: `${aggregateMetrics.totalPrograms}`, label: "Active Programs", icon: Building2 },
    { value: `${aggregateMetrics.totalProducts}`, label: "Total Products", icon: Package },
    { value: `${aggregateMetrics.totalBuyers}`, label: "Corporate Buyers", icon: Briefcase },
    { value: aggregateMetrics.totalTransactions, label: "Total Transaksi", icon: TrendingUp },
    { value: `${aggregateMetrics.jobsCreated}+`, label: "Jobs Created", icon: Heart },
    { value: `${aggregateMetrics.womenWorkers}+`, label: "Women Workers", icon: Users },
    { value: `${aggregateMetrics.householdsSupported}+`, label: "Households Supported", icon: BarChart3 },
  ];

  // Per program breakdown
  const programBreakdown = programs.map(prog => {
    const org = getOrganization(prog.organizationId);
    const programProducts = products.filter(p => p.programId === prog.id);
    const programSuppliers = suppliers.filter(s => s.programId === prog.id);
    return {
      name: prog.name,
      org: org?.name || "",
      type: org?.type || "",
      location: prog.location,
      suppliers: programSuppliers.length,
      products: programProducts.length,
      jobs: programProducts.reduce((s, p) => s + p.metrics.jobsCreated, 0),
      women: programProducts.reduce((s, p) => s + p.metrics.womenWorkers, 0),
    };
  });

  // Per location breakdown
  const locationMap = new Map<string, { suppliers: number; jobs: number; women: number }>();
  suppliers.forEach(s => {
    const existing = locationMap.get(s.province) || { suppliers: 0, jobs: 0, women: 0 };
    existing.suppliers += 1;
    existing.jobs += s.workers;
    existing.women += s.womenWorkers;
    locationMap.set(s.province, existing);
  });

  return (
    <main className="pt-16">
      <section className="bg-primary py-14">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Impact Dashboard</h1>
          <p className="text-primary-foreground/70">Dampak sosial yang terukur dan transparan dari seluruh ekosistem PasarBaik.</p>
        </div>
      </section>

      {/* Top metrics */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {topMetrics.map((m, i) => (
            <div key={i} className="bg-card rounded-xl p-5 border border-border shadow-sm text-center">
              <m.icon className="mx-auto mb-2 text-primary" size={24} />
              <div className="font-display text-2xl font-bold text-card-foreground">{m.value}</div>
              <div className="text-muted-foreground text-xs mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Per Program */}
      <section className="bg-cream py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">Impact per Program</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-semibold text-foreground">Program</th>
                  <th className="pb-3 font-semibold text-foreground">Organization</th>
                  <th className="pb-3 font-semibold text-foreground">Location</th>
                  <th className="pb-3 font-semibold text-foreground text-center">Suppliers</th>
                  <th className="pb-3 font-semibold text-foreground text-center">Products</th>
                  <th className="pb-3 font-semibold text-foreground text-center">Jobs</th>
                  <th className="pb-3 font-semibold text-foreground text-center">Women</th>
                </tr>
              </thead>
              <tbody>
                {programBreakdown.map((p, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 font-medium text-foreground">{p.name}</td>
                    <td className="py-3 text-muted-foreground">{p.org}</td>
                    <td className="py-3 text-muted-foreground">{p.location}</td>
                    <td className="py-3 text-center font-semibold text-primary">{p.suppliers}</td>
                    <td className="py-3 text-center font-semibold text-primary">{p.products}</td>
                    <td className="py-3 text-center font-semibold text-accent">{p.jobs}</td>
                    <td className="py-3 text-center font-semibold text-accent">{p.women}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Per Location */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">Impact per Location</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from(locationMap.entries()).map(([loc, data]) => (
            <div key={loc} className="bg-card rounded-xl p-5 border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Globe size={16} className="text-primary" />
                <h3 className="font-semibold text-foreground text-sm">{loc}</h3>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between"><span>Suppliers</span><span className="font-semibold text-foreground">{data.suppliers}</span></div>
                <div className="flex justify-between"><span>Workers</span><span className="font-semibold text-foreground">{data.jobs}</span></div>
                <div className="flex justify-between"><span>Women</span><span className="font-semibold text-foreground">{data.women}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">Want to contribute to this impact?</h2>
          <p className="text-muted-foreground mb-6 text-sm">Daftarkan program CSR Anda atau ajukan kebutuhan procurement berdampak.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/csr"><Button variant="default">Register Program</Button></Link>
            <Link to="/rfq"><Button variant="outline">Request Quotation</Button></Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ImpactPage;
