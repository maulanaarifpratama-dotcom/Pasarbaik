import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useProducts, useSuppliers, usePrograms, useImpactReports, usePartners } from "@/hooks/useSupabaseQuery";
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { BarChart3, Package, Users, Building2, FileText, Settings, LogOut, Home } from "lucide-react";

const sidebarItems = [
  { title: "Overview", url: "/dashboard", icon: BarChart3 },
  { title: "Products", url: "/dashboard/products", icon: Package },
  { title: "Suppliers", url: "/dashboard/suppliers", icon: Users },
  { title: "Programs", url: "/dashboard/programs", icon: Building2 },
  { title: "Reports", url: "/dashboard/reports", icon: FileText },
];

function DashboardSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!collapsed && "Dashboard"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button onClick={signOut} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                    <LogOut className="h-4 w-4" />
                    {!collapsed && <span>Sign Out</span>}
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

function DashboardOverview() {
  const { data: products } = useProducts();
  const { data: suppliers } = useSuppliers();
  const { data: programs } = usePrograms();
  const { data: reports } = useImpactReports();
  const { data: partners } = usePartners();

  const stats = [
    { label: "Products", value: products?.length || 0, icon: Package },
    { label: "Suppliers", value: suppliers?.length || 0, icon: Users },
    { label: "Programs", value: programs?.length || 0, icon: Building2 },
    { label: "Partners", value: partners?.length || 0, icon: Building2 },
    { label: "Impact Reports", value: reports?.length || 0, icon: FileText },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 text-center">
            <s.icon className="mx-auto mb-2 text-primary" size={24} />
            <div className="font-display text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <h3 className="font-semibold text-foreground mb-4">Recent Products</h3>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 font-semibold">Name</th>
              <th className="text-left p-4 font-semibold">Category</th>
              <th className="text-left p-4 font-semibold">Status</th>
              <th className="text-left p-4 font-semibold">Price</th>
            </tr>
          </thead>
          <tbody>
            {products?.slice(0, 5).map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-4 font-medium text-foreground">{p.name}</td>
                <td className="p-4 text-muted-foreground">{p.category}</td>
                <td className="p-4"><span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{p.status}</span></td>
                <td className="p-4 text-muted-foreground">{p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DashboardProducts() {
  const { data: products, isLoading } = useProducts();
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Products</h2>
      {isLoading ? <Skeleton className="h-64" /> : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Supplier</th>
                <th className="text-left p-4 font-semibold">Price</th>
                <th className="text-left p-4 font-semibold">MOQ</th>
                <th className="text-left p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-4 font-medium text-foreground">{p.name}</td>
                  <td className="p-4 text-muted-foreground">{p.category}</td>
                  <td className="p-4 text-muted-foreground">{(p.suppliers as any)?.name}</td>
                  <td className="p-4 text-muted-foreground">{p.price}</td>
                  <td className="p-4 text-muted-foreground">{p.moq}</td>
                  <td className="p-4"><span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DashboardSuppliers() {
  const { data: suppliers, isLoading } = useSuppliers();
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Suppliers</h2>
      {isLoading ? <Skeleton className="h-64" /> : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Type</th>
                <th className="text-left p-4 font-semibold">Location</th>
                <th className="text-left p-4 font-semibold">Contact</th>
              </tr>
            </thead>
            <tbody>
              {suppliers?.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="p-4 font-medium text-foreground">{s.name}</td>
                  <td className="p-4 text-muted-foreground">{s.type}</td>
                  <td className="p-4 text-muted-foreground">{s.location}</td>
                  <td className="p-4 text-muted-foreground">{s.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DashboardPrograms() {
  const { data: programs, isLoading } = usePrograms();
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Programs</h2>
      {isLoading ? <Skeleton className="h-64" /> : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Title</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Location</th>
              </tr>
            </thead>
            <tbody>
              {programs?.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-4 font-medium text-foreground">{p.title}</td>
                  <td className="p-4 text-muted-foreground">{p.category}</td>
                  <td className="p-4 text-muted-foreground">{p.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function DashboardReports() {
  const { data: reports, isLoading } = useImpactReports();
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Impact Reports</h2>
      {isLoading ? <Skeleton className="h-64" /> : (
        <div className="space-y-4">
          {reports?.map((r) => (
            <div key={r.id} className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground">{r.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">Date: {r.date} | Beneficiaries: {r.beneficiaries?.toLocaleString()}</p>
              <pre className="text-xs text-muted-foreground mt-2 bg-muted p-3 rounded-lg overflow-auto">
                {JSON.stringify(r.metrics, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type DashboardTab = "overview" | "products" | "suppliers" | "programs" | "reports";

function DashboardContent() {
  const [tab, setTab] = useState<DashboardTab>("overview");
  const { user } = useAuth();

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 flex items-center border-b border-border px-4 bg-card">
        <SidebarTrigger className="mr-4" />
        <h1 className="font-display text-lg font-bold text-foreground">PasarBaik Dashboard</h1>
        <div className="ml-auto text-sm text-muted-foreground">{user?.email}</div>
      </header>
      <main className="flex-1 p-6 bg-background overflow-auto">
        {/* Simple tab routing within dashboard */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["overview", "products", "suppliers", "programs", "reports"] as DashboardTab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
        {tab === "overview" && <DashboardOverview />}
        {tab === "products" && <DashboardProducts />}
        {tab === "suppliers" && <DashboardSuppliers />}
        {tab === "programs" && <DashboardPrograms />}
        {tab === "reports" && <DashboardReports />}
      </main>
    </div>
  );
}

function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />
        <DashboardContent />
      </div>
    </SidebarProvider>
  );
}

export default DashboardPage;
