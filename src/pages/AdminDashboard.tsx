import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProducts, useSuppliers, usePrograms, usePartners, useImpactReports } from "@/hooks/useSupabaseQuery";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup,
  SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { BarChart3, Package, Users, Building2, FileText, LogOut, Handshake, Plus, Trash2, ImageIcon, Pencil, Inbox, Eye } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ImageUpload";

const sidebarItems = [
  { title: "Overview", url: "/admin", icon: BarChart3 },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Suppliers", url: "/admin/suppliers", icon: Users },
  { title: "Programs", url: "/admin/programs", icon: Building2 },
  { title: "Partners", url: "/admin/partners", icon: Handshake },
  { title: "RFQ", url: "/admin/rfq", icon: Inbox },
  { title: "Reports", url: "/admin/reports", icon: FileText },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && "Admin Panel"}</SidebarGroupLabel>
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

type AdminTab = "overview" | "products" | "suppliers" | "programs" | "partners" | "rfq" | "reports";

// --- CRUD Components ---

function AdminProducts() {
  const { data: products, isLoading } = useProducts();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [editItem, setEditItem] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState("");

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["products"] }); }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("products").insert({
      name: fd.get("name") as string,
      slug: (fd.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
      category: fd.get("category") as string,
      price: fd.get("price") as string,
      moq: fd.get("moq") as string,
      description: fd.get("description") as string,
      image: imageUrl || null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Added"); qc.invalidateQueries({ queryKey: ["products"] }); setOpen(false); setImageUrl(""); }
  };

  const openEdit = (p: any) => {
    setEditItem(p);
    setEditImageUrl(p.image || "");
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("products").update({
      name: fd.get("name") as string,
      slug: (fd.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
      category: fd.get("category") as string,
      price: fd.get("price") as string,
      moq: fd.get("moq") as string,
      description: fd.get("description") as string,
      image: editImageUrl || null,
    }).eq("id", editItem.id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["products"] }); setEditOpen(false); setEditItem(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Products</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setImageUrl(""); }}>
          <DialogTrigger asChild><Button size="sm"><Plus size={16} className="mr-1" /> Add Product</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Product</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><Label>Gambar Produk</Label><ImageUpload value={imageUrl} onChange={setImageUrl} folder="products" /></div>
              <div><Label>Name</Label><Input name="name" required /></div>
              <div><Label>Category</Label><Input name="category" /></div>
              <div><Label>Price</Label><Input name="price" /></div>
              <div><Label>MOQ</Label><Input name="moq" /></div>
              <div><Label>Description</Label><Input name="description" /></div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) setEditItem(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
          {editItem && (
            <form onSubmit={handleEdit} className="space-y-3">
              <div><Label>Gambar Produk</Label><ImageUpload value={editImageUrl} onChange={setEditImageUrl} folder="products" /></div>
              <div><Label>Name</Label><Input name="name" defaultValue={editItem.name} required /></div>
              <div><Label>Category</Label><Input name="category" defaultValue={editItem.category || ""} /></div>
              <div><Label>Price</Label><Input name="price" defaultValue={editItem.price || ""} /></div>
              <div><Label>MOQ</Label><Input name="moq" defaultValue={editItem.moq || ""} /></div>
              <div><Label>Description</Label><Input name="description" defaultValue={editItem.description || ""} /></div>
              <Button type="submit" className="w-full">Update</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? <Skeleton className="h-64" /> : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold w-16">Img</th>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Price</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-4">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center"><ImageIcon size={16} className="text-muted-foreground" /></div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-foreground">{p.name}</td>
                  <td className="p-4 text-muted-foreground">{p.category}</td>
                  <td className="p-4 text-muted-foreground">{p.price}</td>
                  <td className="p-4"><Badge variant="secondary">{p.status}</Badge></td>
                  <td className="p-4 text-right flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil size={16} className="text-muted-foreground" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 size={16} className="text-destructive" /></Button>
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

function AdminSuppliers() {
  const { data: suppliers, isLoading } = useSuppliers();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [editItem, setEditItem] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editLogoUrl, setEditLogoUrl] = useState("");

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("suppliers").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["suppliers"] }); }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("suppliers").insert({
      name: fd.get("name") as string,
      slug: (fd.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
      type: fd.get("type") as string,
      location: fd.get("location") as string,
      description: fd.get("description") as string,
      logo: logoUrl || null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Added"); qc.invalidateQueries({ queryKey: ["suppliers"] }); setOpen(false); setLogoUrl(""); }
  };

  const openEdit = (s: any) => {
    setEditItem(s);
    setEditLogoUrl(s.logo || "");
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("suppliers").update({
      name: fd.get("name") as string,
      slug: (fd.get("name") as string).toLowerCase().replace(/\s+/g, "-"),
      type: fd.get("type") as string,
      location: fd.get("location") as string,
      description: fd.get("description") as string,
      logo: editLogoUrl || null,
    }).eq("id", editItem.id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["suppliers"] }); setEditOpen(false); setEditItem(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Suppliers</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setLogoUrl(""); }}>
          <DialogTrigger asChild><Button size="sm"><Plus size={16} className="mr-1" /> Add Supplier</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Supplier</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><Label>Logo / Foto</Label><ImageUpload value={logoUrl} onChange={setLogoUrl} folder="suppliers" /></div>
              <div><Label>Name</Label><Input name="name" required /></div>
              <div><Label>Type</Label><Input name="type" placeholder="UMKM / Cooperative" /></div>
              <div><Label>Location</Label><Input name="location" /></div>
              <div><Label>Description</Label><Input name="description" /></div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) setEditItem(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Supplier</DialogTitle></DialogHeader>
          {editItem && (
            <form onSubmit={handleEdit} className="space-y-3">
              <div><Label>Logo / Foto</Label><ImageUpload value={editLogoUrl} onChange={setEditLogoUrl} folder="suppliers" /></div>
              <div><Label>Name</Label><Input name="name" defaultValue={editItem.name} required /></div>
              <div><Label>Type</Label><Input name="type" defaultValue={editItem.type || ""} placeholder="UMKM / Cooperative" /></div>
              <div><Label>Location</Label><Input name="location" defaultValue={editItem.location || ""} /></div>
              <div><Label>Description</Label><Input name="description" defaultValue={editItem.description || ""} /></div>
              <Button type="submit" className="w-full">Update</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? <Skeleton className="h-64" /> : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold w-16">Logo</th>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Type</th>
                <th className="text-left p-4 font-semibold">Location</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers?.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="p-4">
                    {s.logo ? (
                      <img src={s.logo} alt={s.name} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center"><ImageIcon size={16} className="text-muted-foreground" /></div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-foreground">{s.name}</td>
                  <td className="p-4 text-muted-foreground">{s.type}</td>
                  <td className="p-4 text-muted-foreground">{s.location}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil size={16} className="text-muted-foreground" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}><Trash2 size={16} className="text-destructive" /></Button>
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

function AdminPrograms() {
  const { data: programs, isLoading } = usePrograms();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("programs").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["programs"] }); }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("programs").insert({
      title: fd.get("title") as string,
      slug: (fd.get("title") as string).toLowerCase().replace(/\s+/g, "-"),
      category: fd.get("category") as string,
      location: fd.get("location") as string,
      description: fd.get("description") as string,
    });
    if (error) toast.error(error.message);
    else { toast.success("Added"); qc.invalidateQueries({ queryKey: ["programs"] }); setOpen(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Programs</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus size={16} className="mr-1" /> Add Program</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Program</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><Label>Title</Label><Input name="title" required /></div>
              <div><Label>Category</Label><Input name="category" placeholder="CSR / NGO / Government" /></div>
              <div><Label>Location</Label><Input name="location" /></div>
              <div><Label>Description</Label><Input name="description" /></div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <Skeleton className="h-64" /> : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Title</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Location</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs?.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-4 font-medium text-foreground">{p.title}</td>
                  <td className="p-4 text-muted-foreground">{p.category}</td>
                  <td className="p-4 text-muted-foreground">{p.location}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 size={16} className="text-destructive" /></Button>
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

function AdminPartners() {
  const { data: partners, isLoading } = usePartners();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["partners"] }); }
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("partners").insert({
      name: fd.get("name") as string,
      type: fd.get("type") as string,
      description: fd.get("description") as string,
    });
    if (error) toast.error(error.message);
    else { toast.success("Added"); qc.invalidateQueries({ queryKey: ["partners"] }); setOpen(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Partners</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus size={16} className="mr-1" /> Add Partner</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Partner</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><Label>Name</Label><Input name="name" required /></div>
              <div><Label>Type</Label><Input name="type" placeholder="NGO / Corporate / Government" /></div>
              <div><Label>Description</Label><Input name="description" /></div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {isLoading ? <Skeleton className="h-64" /> : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Name</th>
                <th className="text-left p-4 font-semibold">Type</th>
                <th className="text-left p-4 font-semibold">Description</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners?.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-4 font-medium text-foreground">{p.name}</td>
                  <td className="p-4 text-muted-foreground">{p.type}</td>
                  <td className="p-4 text-muted-foreground text-xs max-w-xs truncate">{p.description}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}><Trash2 size={16} className="text-destructive" /></Button>
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

function AdminReports() {
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
              <div className="flex gap-1 mt-2 flex-wrap">
                {r.sdg_tags?.map((tag: string) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminRFQ() {
  const qc = useQueryClient();
  const { data: rfqs, isLoading } = useQuery({
    queryKey: ["rfq_requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("rfq_requests" as any).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });
  const [viewItem, setViewItem] = useState<any>(null);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    reviewed: "bg-blue-100 text-blue-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  const handleStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("rfq_requests" as any).update({ status } as any).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Status → ${status}`); qc.invalidateQueries({ queryKey: ["rfq_requests"] }); }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("rfq_requests" as any).delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["rfq_requests"] }); }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">RFQ Requests</h2>

      {/* Detail Dialog */}
      <Dialog open={!!viewItem} onOpenChange={(v) => { if (!v) setViewItem(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>RFQ Detail</DialogTitle></DialogHeader>
          {viewItem && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div><span className="text-muted-foreground">Company:</span> <strong>{viewItem.company}</strong></div>
                <div><span className="text-muted-foreground">Contact:</span> <strong>{viewItem.contact_person}</strong></div>
                <div><span className="text-muted-foreground">Email:</span> <strong>{viewItem.email}</strong></div>
                <div><span className="text-muted-foreground">Phone:</span> <strong>{viewItem.phone || "-"}</strong></div>
                <div><span className="text-muted-foreground">Category:</span> <strong>{viewItem.category || "-"}</strong></div>
                <div><span className="text-muted-foreground">Quantity:</span> <strong>{viewItem.quantity || "-"}</strong></div>
                <div><span className="text-muted-foreground">Target Price:</span> <strong>{viewItem.target_price || "-"}</strong></div>
                <div><span className="text-muted-foreground">Deadline:</span> <strong>{viewItem.deadline || "-"}</strong></div>
                <div className="col-span-2"><span className="text-muted-foreground">Location:</span> <strong>{viewItem.location || "-"}</strong></div>
              </div>
              {viewItem.notes && (
                <div><span className="text-muted-foreground">Notes:</span><p className="mt-1 bg-muted p-3 rounded-lg text-foreground">{viewItem.notes}</p></div>
              )}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleStatus(viewItem.id, "reviewed")}>Mark Reviewed</Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleStatus(viewItem.id, "accepted")}>Accept</Button>
                <Button size="sm" variant="destructive" onClick={() => handleStatus(viewItem.id, "rejected")}>Reject</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? <Skeleton className="h-64" /> : rfqs?.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
          <Inbox className="mx-auto mb-3" size={40} />
          <p>Belum ada permintaan RFQ</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Company</th>
                <th className="text-left p-4 font-semibold">Contact</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rfqs?.map((r: any) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-4 text-muted-foreground">{new Date(r.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="p-4 font-medium text-foreground">{r.company}</td>
                  <td className="p-4 text-muted-foreground">{r.contact_person}</td>
                  <td className="p-4 text-muted-foreground">{r.category || "-"}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[r.status] || "bg-muted text-muted-foreground"}`}>{r.status}</span>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setViewItem(r)}><Eye size={16} className="text-muted-foreground" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)}><Trash2 size={16} className="text-destructive" /></Button>
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

  const [tab, setTab] = useState<AdminTab>("overview");
  const { user } = useAuth();
  const { data: products } = useProducts();
  const { data: suppliers } = useSuppliers();
  const { data: programs } = usePrograms();
  const { data: partners } = usePartners();

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 flex items-center border-b border-border px-4 bg-card">
        <SidebarTrigger className="mr-4" />
        <h1 className="font-display text-lg font-bold text-foreground">Admin Panel</h1>
        <div className="ml-auto text-sm text-muted-foreground">{user?.email}</div>
      </header>
      <main className="flex-1 p-6 bg-background overflow-auto">
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["overview", "products", "suppliers", "programs", "partners", "reports"] as AdminTab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Admin Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl border border-border p-5 text-center">
                <Package className="mx-auto mb-2 text-primary" size={24} />
                <div className="font-display text-2xl font-bold text-foreground">{products?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Products</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 text-center">
                <Users className="mx-auto mb-2 text-primary" size={24} />
                <div className="font-display text-2xl font-bold text-foreground">{suppliers?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Suppliers</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 text-center">
                <Building2 className="mx-auto mb-2 text-primary" size={24} />
                <div className="font-display text-2xl font-bold text-foreground">{programs?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Programs</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 text-center">
                <Handshake className="mx-auto mb-2 text-primary" size={24} />
                <div className="font-display text-2xl font-bold text-foreground">{partners?.length || 0}</div>
                <div className="text-xs text-muted-foreground">Partners</div>
              </div>
            </div>
          </div>
        )}
        {tab === "products" && <AdminProducts />}
        {tab === "suppliers" && <AdminSuppliers />}
        {tab === "programs" && <AdminPrograms />}
        {tab === "partners" && <AdminPartners />}
        {tab === "reports" && <AdminReports />}
      </main>
    </div>
  );
}

function AdminDashboard() {
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
        <AdminSidebar />
        <AdminContent />
      </div>
    </SidebarProvider>
  );
}

export default AdminDashboard;
