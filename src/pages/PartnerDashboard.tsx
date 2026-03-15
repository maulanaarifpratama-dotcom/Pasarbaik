import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
  SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup,
  SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ImageUpload";
import { BarChart3, Package, User, LogOut, Plus, Trash2, Pencil, MapPin, ImageIcon } from "lucide-react";

// --- Hooks ---

function useMySupplier(userId: string | undefined) {
  return useQuery({
    queryKey: ["my-supplier", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

function useMyProducts(supplierId: string | undefined) {
  return useQuery({
    queryKey: ["my-products", supplierId],
    queryFn: async () => {
      if (!supplierId) return [];
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("supplier_id", supplierId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!supplierId,
  });
}

// --- Sidebar ---

const sidebarItems = [
  { title: "Overview", url: "/partner", icon: BarChart3 },
  { title: "Profile", url: "/partner/profile", icon: User },
  { title: "Products", url: "/partner/products", icon: Package },
];

function PartnerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && "Partner Panel"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    type="button"
                    onClick={() => navigate(item.url)}
                    isActive={location.pathname === item.url}
                    className="hover:bg-muted/50"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {!collapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  type="button"
                  onClick={signOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  {!collapsed && <span>Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// --- Overview ---

function PartnerOverview({ supplier, products }: { supplier: any; products: any[] }) {
  const activeProducts = products.filter((p) => p.status === "active").length;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Partner Overview</h2>

      {!supplier ? (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-8 text-center">
          <User className="mx-auto mb-4 text-accent" size={48} />
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">Welcome, Partner!</h3>
          <p className="text-muted-foreground mb-4">
            Your supplier profile hasn't been linked yet. Please contact admin to link your account to a supplier profile.
          </p>
        </div>
      ) : (
        <>
          {/* Supplier Card */}
          <div className="bg-card rounded-xl border border-border p-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                {supplier.logo ? (
                  <img src={supplier.logo} alt={supplier.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="text-primary" size={28} />
                )}
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground">{supplier.name}</h3>
                <div className="flex gap-2 items-center mt-1 flex-wrap">
                  <Badge variant="outline" className="text-xs">{supplier.type}</Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={10} /> {supplier.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl border border-border p-5 text-center">
              <Package className="mx-auto mb-2 text-primary" size={24} />
              <div className="font-display text-2xl font-bold text-foreground">{products.length}</div>
              <div className="text-xs text-muted-foreground">Total Products</div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 text-center">
              <Package className="mx-auto mb-2 text-accent" size={24} />
              <div className="font-display text-2xl font-bold text-foreground">{activeProducts}</div>
              <div className="text-xs text-muted-foreground">Active Products</div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 text-center">
              <BarChart3 className="mx-auto mb-2 text-primary" size={24} />
              <div className="font-display text-2xl font-bold text-foreground">{products.filter((p) => p.status === "draft").length}</div>
              <div className="text-xs text-muted-foreground">Draft Products</div>
            </div>
            <div className="bg-card rounded-xl border border-border p-5 text-center">
              <ImageIcon className="mx-auto mb-2 text-muted-foreground" size={24} />
              <div className="font-display text-2xl font-bold text-foreground">{products.filter((p) => p.image).length}</div>
              <div className="text-xs text-muted-foreground">With Images</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// --- Profile Editor ---

function PartnerProfile({ supplier }: { supplier: any }) {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [logoUrl, setLogoUrl] = useState(supplier?.logo || "");

  useEffect(() => {
    setLogoUrl(supplier?.logo || "");
  }, [supplier]);

  if (!supplier) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>No supplier profile linked to your account.</p>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("suppliers").update({
      name: fd.get("name") as string,
      description: fd.get("description") as string,
      location: fd.get("location") as string,
      type: fd.get("type") as string,
      contact: fd.get("contact") as string,
      logo: logoUrl || null,
    }).eq("id", supplier.id);

    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated!");
      qc.invalidateQueries({ queryKey: ["my-supplier"] });
    }
    setSaving(false);
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Edit Supplier Profile</h2>
      <form onSubmit={handleSave} className="max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <div>
                <Label>Supplier Name</Label>
                <Input name="name" defaultValue={supplier.name} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Input name="type" defaultValue={supplier.type || ""} placeholder="Cooperative / UMKM / Foundation" />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input name="location" defaultValue={supplier.location || ""} />
                </div>
              </div>
              <div>
                <Label>Contact Email / Phone</Label>
                <Input name="contact" defaultValue={supplier.contact || ""} placeholder="email@example.com" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea name="description" defaultValue={supplier.description || ""} rows={5} />
              </div>
            </div>
          </div>
          {/* Right */}
          <div className="space-y-4">
            <div className="bg-card rounded-xl border border-border p-6">
              <Label className="mb-2 block">Logo / Photo</Label>
              <ImageUpload value={logoUrl} onChange={setLogoUrl} folder="suppliers" />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

// --- Products Manager ---

function PartnerProducts({ supplier, products }: { supplier: any; products: any[] }) {
  const qc = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  if (!supplier) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>No supplier profile linked. Contact admin to get started.</p>
      </div>
    );
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const { error } = await supabase.from("products").insert({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      category: fd.get("category") as string,
      price: fd.get("price") as string,
      moq: fd.get("moq") as string,
      description: fd.get("description") as string,
      image: imageUrl || null,
      supplier_id: supplier.id,
      status: "draft",
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Product added as draft!");
      qc.invalidateQueries({ queryKey: ["my-products"] });
      setAddOpen(false);
      setImageUrl("");
    }
  };

  const openEdit = (p: any) => {
    setEditItem(p);
    setEditImageUrl(p.image || "");
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const { error } = await supabase.from("products").update({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      category: fd.get("category") as string,
      price: fd.get("price") as string,
      moq: fd.get("moq") as string,
      description: fd.get("description") as string,
      image: editImageUrl || null,
    }).eq("id", editItem.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Product updated!");
      qc.invalidateQueries({ queryKey: ["my-products"] });
      setEditItem(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("products").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else {
      toast.success("Product deleted");
      qc.invalidateQueries({ queryKey: ["my-products"] });
    }
    setDeleteId(null);
  };

  const statusColors: Record<string, string> = {
    active: "bg-primary/10 text-primary",
    draft: "bg-muted text-muted-foreground",
    archived: "bg-destructive/10 text-destructive",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">My Products</h2>
        <Dialog open={addOpen} onOpenChange={(v) => { setAddOpen(v); if (!v) setImageUrl(""); }}>
          <DialogTrigger asChild><Button size="sm"><Plus size={16} className="mr-1" /> Add Product</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><Label>Image</Label><ImageUpload value={imageUrl} onChange={setImageUrl} folder="products" /></div>
              <div><Label>Name *</Label><Input name="name" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label><Input name="category" placeholder="Textiles / Food / Crafts" /></div>
                <div><Label>Price</Label><Input name="price" placeholder="IDR 100,000" /></div>
              </div>
              <div><Label>MOQ</Label><Input name="moq" placeholder="50 pcs" /></div>
              <div><Label>Description</Label><Textarea name="description" rows={3} /></div>
              <p className="text-xs text-muted-foreground">Products are saved as <strong>draft</strong>. Admin will review and publish.</p>
              <Button type="submit" className="w-full">Save Product</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(v) => { if (!v) setEditItem(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
          {editItem && (
            <form onSubmit={handleEdit} className="space-y-3">
              <div><Label>Image</Label><ImageUpload value={editImageUrl} onChange={setEditImageUrl} folder="products" /></div>
              <div><Label>Name *</Label><Input name="name" defaultValue={editItem.name} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label><Input name="category" defaultValue={editItem.category || ""} /></div>
                <div><Label>Price</Label><Input name="price" defaultValue={editItem.price || ""} /></div>
              </div>
              <div><Label>MOQ</Label><Input name="moq" defaultValue={editItem.moq || ""} /></div>
              <div><Label>Description</Label><Textarea name="description" defaultValue={editItem.description || ""} rows={3} /></div>
              <Button type="submit" className="w-full">Update Product</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure? This cannot be undone.</p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {products.length === 0 ? (
        <div className="bg-muted rounded-xl p-12 text-center">
          <Package className="mx-auto mb-4 text-muted-foreground" size={48} />
          <p className="text-muted-foreground">No products yet. Add your first product above.</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold w-12">Image</th>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Price</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-4">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center"><ImageIcon size={16} className="text-muted-foreground" /></div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-foreground">{p.name}</td>
                  <td className="p-4 text-muted-foreground">{p.category || "—"}</td>
                  <td className="p-4 text-muted-foreground">{p.price || "—"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[p.status] || "bg-muted text-muted-foreground"}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil size={16} className="text-muted-foreground" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}><Trash2 size={16} className="text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- Main Layout ---

type PartnerTab = "overview" | "profile" | "products";

function PartnerContent() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { data: supplier, isLoading: supplierLoading } = useMySupplier(user?.id);
  const { data: products = [], isLoading: productsLoading } = useMyProducts(supplier?.id);

  const pathSegment = location.pathname.replace("/partner", "").replace("/", "") || "overview";
  const tab = (["overview", "profile", "products"].includes(pathSegment) ? pathSegment : "overview") as PartnerTab;

  const tabRouteMap: Record<PartnerTab, string> = {
    overview: "/partner",
    profile: "/partner/profile",
    products: "/partner/products",
  };

  const isLoading = supplierLoading || productsLoading;

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 flex items-center border-b border-border px-4 bg-card">
        <SidebarTrigger className="mr-4" />
        <h1 className="font-display text-lg font-bold text-foreground">Partner Panel</h1>
        <div className="ml-auto text-sm text-muted-foreground">{user?.email}</div>
      </header>
      <main className="flex-1 p-6 bg-background overflow-auto">
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["overview", "profile", "products"] as PartnerTab[]).map((t) => (
            <button key={t} onClick={() => navigate(tabRouteMap[t])}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {isLoading ? (
          <Skeleton className="h-64" />
        ) : (
          <>
            {tab === "overview" && <PartnerOverview supplier={supplier} products={products} />}
            {tab === "profile" && <PartnerProfile supplier={supplier} />}
            {tab === "products" && <PartnerProducts supplier={supplier} products={products} />}
          </>
        )}
      </main>
    </div>
  );
}

export default function PartnerDashboard() {
  const { user, loading } = useAuth();
  const { isPartner, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !roleLoading) {
      if (!user) navigate("/login");
      else if (!isPartner) navigate("/");
    }
  }, [user, loading, roleLoading, isPartner, navigate]);

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  if (!user || !isPartner) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <PartnerSidebar />
        <PartnerContent />
      </div>
    </SidebarProvider>
  );
}
