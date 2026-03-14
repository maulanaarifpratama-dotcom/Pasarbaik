import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Package, Building2, TrendingUp, Briefcase, BarChart3, Settings } from "lucide-react";
import { aggregateMetrics, organizations, programs, suppliers, products } from "@/data/mockData";

type Tab = "overview" | "organizations" | "programs" | "suppliers" | "products" | "rfq";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "organizations", label: "Organizations", icon: Building2 },
    { key: "programs", label: "Programs", icon: Settings },
    { key: "suppliers", label: "Suppliers", icon: Users },
    { key: "products", label: "Products", icon: Package },
    { key: "rfq", label: "RFQ", icon: Briefcase },
  ];

  return (
    <main className="pt-16">
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-2xl font-bold text-primary-foreground">Admin Dashboard</h1>
          <p className="text-primary-foreground/60 text-sm">Manage platform data and monitor impact</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-1 flex-wrap mb-6 bg-secondary/50 rounded-lg p-1">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.key ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total UMKM", value: aggregateMetrics.totalUMKM, icon: Users },
                { label: "Programs", value: aggregateMetrics.totalPrograms, icon: Building2 },
                { label: "Products", value: aggregateMetrics.totalProducts, icon: Package },
                { label: "Buyers", value: aggregateMetrics.totalBuyers, icon: Briefcase },
                { label: "Jobs Created", value: aggregateMetrics.jobsCreated, icon: TrendingUp },
                { label: "Women Workers", value: aggregateMetrics.womenWorkers, icon: Users },
                { label: "Transactions", value: aggregateMetrics.totalTransactions, icon: BarChart3 },
                { label: "Households", value: aggregateMetrics.householdsSupported, icon: Users },
              ].map((m, i) => (
                <div key={i} className="bg-card rounded-xl p-5 border border-border">
                  <m.icon size={20} className="text-primary mb-2" />
                  <div className="font-display text-2xl font-bold text-card-foreground">{m.value}</div>
                  <div className="text-xs text-muted-foreground">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Organizations */}
        {activeTab === "organizations" && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr><th className="text-left p-4 font-semibold">Name</th><th className="text-left p-4 font-semibold">Type</th><th className="text-left p-4 font-semibold">Description</th></tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr key={org.id} className="border-t border-border">
                    <td className="p-4 font-medium text-foreground">{org.name}</td>
                    <td className="p-4"><Badge variant="outline">{org.type}</Badge></td>
                    <td className="p-4 text-muted-foreground text-xs max-w-md truncate">{org.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Programs */}
        {activeTab === "programs" && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr><th className="text-left p-4 font-semibold">Program</th><th className="text-left p-4 font-semibold">Location</th><th className="text-left p-4 font-semibold">Year</th><th className="text-left p-4 font-semibold">Status</th><th className="text-center p-4 font-semibold">Suppliers</th><th className="text-center p-4 font-semibold">Products</th></tr>
              </thead>
              <tbody>
                {programs.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-4 font-medium text-foreground">{p.name}</td>
                    <td className="p-4 text-muted-foreground">{p.location}</td>
                    <td className="p-4 text-muted-foreground">{p.startYear}</td>
                    <td className="p-4"><Badge className={p.status === "Active" ? "bg-primary text-primary-foreground" : ""}>{p.status}</Badge></td>
                    <td className="p-4 text-center font-semibold">{p.suppliersCount}</td>
                    <td className="p-4 text-center font-semibold">{p.productsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Suppliers */}
        {activeTab === "suppliers" && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr><th className="text-left p-4 font-semibold">Supplier</th><th className="text-left p-4 font-semibold">Owner</th><th className="text-left p-4 font-semibold">Location</th><th className="text-left p-4 font-semibold">Category</th><th className="text-center p-4 font-semibold">Workers</th><th className="text-center p-4 font-semibold">Verified</th></tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.id} className="border-t border-border">
                    <td className="p-4 font-medium text-foreground">{s.name}</td>
                    <td className="p-4 text-muted-foreground">{s.owner}</td>
                    <td className="p-4 text-muted-foreground">{s.location}</td>
                    <td className="p-4 text-muted-foreground">{s.category}</td>
                    <td className="p-4 text-center">{s.workers}</td>
                    <td className="p-4 text-center">{s.verified ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr><th className="text-left p-4 font-semibold">Product</th><th className="text-left p-4 font-semibold">Category</th><th className="text-left p-4 font-semibold">Price</th><th className="text-left p-4 font-semibold">MOQ</th><th className="text-left p-4 font-semibold">Impact</th></tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-4 font-medium text-foreground">{p.name}</td>
                    <td className="p-4 text-muted-foreground">{p.category}</td>
                    <td className="p-4 text-muted-foreground">{p.price}</td>
                    <td className="p-4 text-muted-foreground">{p.moq}</td>
                    <td className="p-4"><Badge variant="secondary" className="text-xs">{p.impactBadge}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* RFQ */}
        {activeTab === "rfq" && (
          <div className="text-center py-16 text-muted-foreground">
            <Briefcase className="mx-auto mb-3" size={40} />
            <p className="text-sm">RFQ management requires backend integration.</p>
            <p className="text-xs mt-1">Connect Lovable Cloud to enable RFQ tracking.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
