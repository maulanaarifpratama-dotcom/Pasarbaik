import { useState, useEffect, useMemo } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useProducts, useSuppliers, usePrograms, usePartners, useImpactReports } from "@/hooks/useSupabaseQuery";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup,
  SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar,
} from "@/components/ui/sidebar";
import { BarChart3, Package, Users, Building2, FileText, LogOut, Handshake, Plus, Trash2, ImageIcon, Pencil, Inbox, Eye, FileEdit, ShoppingCart, ArrowLeft, MapPin, Mail, Phone, Clock, DollarSign, FileCheck, Download } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/ImageUpload";
import { RichTextEditor } from "@/components/RichTextEditor";
import { AdminProducts } from "@/components/admin/ProductEditor";
import { AdminSuppliers } from "@/components/admin/SupplierEditor";
import { AdminUsers } from "@/components/admin/UserRolesManager";

const sidebarItems = [
  { title: "Dashboard", url: "/admin", icon: BarChart3 },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Suppliers", url: "/admin/suppliers", icon: Users },
  { title: "Programs", url: "/admin/programs", icon: Building2 },
  { title: "Partners", url: "/admin/partners", icon: Handshake },
  { title: "Pages", url: "/admin/pages", icon: FileEdit },
  { title: "RFQ", url: "/admin/rfq", icon: Inbox },
  { title: "Orders", url: "/admin/orders", icon: ShoppingCart },
  { title: "Reports", url: "/admin/reports", icon: FileText },
  { title: "Users", url: "/admin/users", icon: Users, adminOnly: true },
];

function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();

  const visibleItems = sidebarItems.filter((item) => !(item as any).adminOnly || isAdmin);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && "Admin Panel"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
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

type AdminTab = "overview" | "products" | "suppliers" | "programs" | "partners" | "pages" | "rfq" | "orders" | "reports" | "users";

// --- CRUD Components ---

// AdminProducts is now imported from @/components/admin/ProductEditor

// AdminSuppliers is now imported from @/components/admin/SupplierEditor

function AdminPrograms() {
  const { data: programs, isLoading } = usePrograms();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [editItem, setEditItem] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("programs").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["programs"] }); }
    setDeleteId(null);
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
      images: imageUrl ? [imageUrl] : null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Added"); qc.invalidateQueries({ queryKey: ["programs"] }); setOpen(false); setImageUrl(""); }
  };

  const openEdit = (p: any) => {
    setEditItem(p);
    setEditImageUrl(p.images?.[0] || "");
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("programs").update({
      title: fd.get("title") as string,
      slug: (fd.get("title") as string).toLowerCase().replace(/\s+/g, "-"),
      category: fd.get("category") as string,
      location: fd.get("location") as string,
      description: fd.get("description") as string,
      images: editImageUrl ? [editImageUrl] : null,
    }).eq("id", editItem.id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["programs"] }); setEditOpen(false); setEditItem(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Programs</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setImageUrl(""); }}>
          <DialogTrigger asChild><Button size="sm"><Plus size={16} className="mr-1" /> Add Program</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Program</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><Label>Image</Label><ImageUpload value={imageUrl} onChange={setImageUrl} folder="programs" /></div>
              <div><Label>Title</Label><Input name="title" required /></div>
              <div><Label>Category</Label><Input name="category" placeholder="CSR / NGO / Government" /></div>
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
          <DialogHeader><DialogTitle>Edit Program</DialogTitle></DialogHeader>
          {editItem && (
            <form onSubmit={handleEdit} className="space-y-3">
              <div><Label>Image</Label><ImageUpload value={editImageUrl} onChange={setEditImageUrl} folder="programs" /></div>
              <div><Label>Title</Label><Input name="title" defaultValue={editItem.title} required /></div>
              <div><Label>Category</Label><Input name="category" defaultValue={editItem.category || ""} placeholder="CSR / NGO / Government" /></div>
              <div><Label>Location</Label><Input name="location" defaultValue={editItem.location || ""} /></div>
              <div><Label>Description</Label><Input name="description" defaultValue={editItem.description || ""} /></div>
              <Button type="submit" className="w-full">Update</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this program? This action cannot be undone.</p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

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
                  <td className="p-4 text-right flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil size={16} className="text-muted-foreground" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}><Trash2 size={16} className="text-destructive" /></Button>
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
  const [logoUrl, setLogoUrl] = useState("");
  const [editItem, setEditItem] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editLogoUrl, setEditLogoUrl] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("partners").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["partners"] }); }
    setDeleteId(null);
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("partners").insert({
      name: fd.get("name") as string,
      type: fd.get("type") as string,
      description: fd.get("description") as string,
      logo: logoUrl || null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Added"); qc.invalidateQueries({ queryKey: ["partners"] }); setOpen(false); setLogoUrl(""); }
  };

  const openEdit = (p: any) => {
    setEditItem(p);
    setEditLogoUrl(p.logo || "");
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("partners").update({
      name: fd.get("name") as string,
      type: fd.get("type") as string,
      description: fd.get("description") as string,
      logo: editLogoUrl || null,
    }).eq("id", editItem.id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["partners"] }); setEditOpen(false); setEditItem(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Partners</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setLogoUrl(""); }}>
          <DialogTrigger asChild><Button size="sm"><Plus size={16} className="mr-1" /> Add Partner</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Partner</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><Label>Logo</Label><ImageUpload value={logoUrl} onChange={setLogoUrl} folder="partners" /></div>
              <div><Label>Name</Label><Input name="name" required /></div>
              <div><Label>Type</Label><Input name="type" placeholder="NGO / Corporate / Government" /></div>
              <div><Label>Description</Label><Input name="description" /></div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) setEditItem(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Partner</DialogTitle></DialogHeader>
          {editItem && (
            <form onSubmit={handleEdit} className="space-y-3">
              <div><Label>Logo</Label><ImageUpload value={editLogoUrl} onChange={setEditLogoUrl} folder="partners" /></div>
              <div><Label>Name</Label><Input name="name" defaultValue={editItem.name} required /></div>
              <div><Label>Type</Label><Input name="type" defaultValue={editItem.type || ""} placeholder="NGO / Corporate / Government" /></div>
              <div><Label>Description</Label><Input name="description" defaultValue={editItem.description || ""} /></div>
              <Button type="submit" className="w-full">Update</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this partner? This action cannot be undone.</p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
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
                <th className="text-left p-4 font-semibold">Description</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partners?.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-4">
                    {p.logo ? (
                      <img src={p.logo} alt={p.name} className="w-10 h-10 rounded object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center"><ImageIcon size={16} className="text-muted-foreground" /></div>
                    )}
                  </td>
                  <td className="p-4 font-medium text-foreground">{p.name}</td>
                  <td className="p-4 text-muted-foreground">{p.type}</td>
                  <td className="p-4 text-muted-foreground text-xs max-w-xs truncate">{p.description}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil size={16} className="text-muted-foreground" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}><Trash2 size={16} className="text-destructive" /></Button>
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
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("impact_reports").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["impact_reports"] }); }
    setDeleteId(null);
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const sdgRaw = fd.get("sdg_tags") as string;
    const { error } = await supabase.from("impact_reports").insert({
      title: fd.get("title") as string,
      slug: (fd.get("title") as string).toLowerCase().replace(/\s+/g, "-"),
      date: (fd.get("date") as string) || null,
      beneficiaries: parseInt(fd.get("beneficiaries") as string) || 0,
      sdg_tags: sdgRaw ? sdgRaw.split(",").map(s => s.trim()) : null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Added"); qc.invalidateQueries({ queryKey: ["impact_reports"] }); setOpen(false); }
  };

  const openEdit = (r: any) => {
    setEditItem(r);
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const sdgRaw = fd.get("sdg_tags") as string;
    const { error } = await supabase.from("impact_reports").update({
      title: fd.get("title") as string,
      slug: (fd.get("title") as string).toLowerCase().replace(/\s+/g, "-"),
      date: (fd.get("date") as string) || null,
      beneficiaries: parseInt(fd.get("beneficiaries") as string) || 0,
      sdg_tags: sdgRaw ? sdgRaw.split(",").map(s => s.trim()) : null,
    }).eq("id", editItem.id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["impact_reports"] }); setEditOpen(false); setEditItem(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Impact Reports</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus size={16} className="mr-1" /> Add Report</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Impact Report</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><Label>Title</Label><Input name="title" required /></div>
              <div><Label>Date</Label><Input name="date" type="date" /></div>
              <div><Label>Beneficiaries</Label><Input name="beneficiaries" type="number" /></div>
              <div><Label>SDG Tags (comma-separated)</Label><Input name="sdg_tags" placeholder="SDG 1, SDG 8, SDG 12" /></div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) setEditItem(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Impact Report</DialogTitle></DialogHeader>
          {editItem && (
            <form onSubmit={handleEdit} className="space-y-3">
              <div><Label>Title</Label><Input name="title" defaultValue={editItem.title} required /></div>
              <div><Label>Date</Label><Input name="date" type="date" defaultValue={editItem.date || ""} /></div>
              <div><Label>Beneficiaries</Label><Input name="beneficiaries" type="number" defaultValue={editItem.beneficiaries || 0} /></div>
              <div><Label>SDG Tags (comma-separated)</Label><Input name="sdg_tags" defaultValue={editItem.sdg_tags?.join(", ") || ""} /></div>
              <Button type="submit" className="w-full">Update</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this report? This action cannot be undone.</p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? <Skeleton className="h-64" /> : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Title</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-left p-4 font-semibold">Beneficiaries</th>
                <th className="text-left p-4 font-semibold">SDG Tags</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports?.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-4 font-medium text-foreground">{r.title}</td>
                  <td className="p-4 text-muted-foreground">{r.date}</td>
                  <td className="p-4 text-muted-foreground">{r.beneficiaries?.toLocaleString()}</td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {r.sdg_tags?.map((tag: string) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                    </div>
                  </td>
                  <td className="p-4 text-right flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)}><Pencil size={16} className="text-muted-foreground" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(r.id)}><Trash2 size={16} className="text-destructive" /></Button>
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

function AdminPages() {
  const qc = useQueryClient();
  const { data: pages, isLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pages").select("*").order("updated_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [addContent, setAddContent] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("pages").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["pages"] }); }
    setDeleteId(null);
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = fd.get("title") as string;
    const { error } = await supabase.from("pages").insert({
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      content_json: { html: addContent },
    });
    if (error) toast.error(error.message);
    else { toast.success("Added"); qc.invalidateQueries({ queryKey: ["pages"] }); setOpen(false); setAddContent(""); }
  };

  const openEdit = (p: any) => {
    setEditItem(p);
    const cj = p.content_json;
    if (cj?.html) setEditContent(cj.html);
    else if (cj?.body) setEditContent(cj.body);
    else if (typeof cj === "string") setEditContent(cj);
    else setEditContent("");
    setEditOpen(true);
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = fd.get("title") as string;
    const { error } = await supabase.from("pages").update({
      title,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      content_json: { html: editContent },
    }).eq("id", editItem.id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["pages"] }); setEditOpen(false); setEditItem(null); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Pages</h2>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setAddContent(""); }}>
          <DialogTrigger asChild><Button size="sm"><Plus size={16} className="mr-1" /> Add Page</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Add Page</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-3">
              <div><Label>Title</Label><Input name="title" required /></div>
              <div><Label>Content</Label><RichTextEditor value={addContent} onChange={setAddContent} /></div>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editOpen} onOpenChange={(v) => { setEditOpen(v); if (!v) setEditItem(null); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit Page</DialogTitle></DialogHeader>
          {editItem && (
            <form onSubmit={handleEdit} className="space-y-3">
              <div><Label>Title</Label><Input name="title" defaultValue={editItem.title} required /></div>
              <div><Label>Content</Label><RichTextEditor value={editContent} onChange={setEditContent} /></div>
              <Button type="submit" className="w-full">Update</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this page? This action cannot be undone.</p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? <Skeleton className="h-64" /> : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Title</th>
                <th className="text-left p-4 font-semibold">Slug</th>
                <th className="text-left p-4 font-semibold">Updated</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages?.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-4 font-medium text-foreground">{p.title}</td>
                  <td className="p-4 text-muted-foreground">{p.slug}</td>
                  <td className="p-4 text-muted-foreground">{new Date(p.updated_at).toLocaleDateString("id-ID")}</td>
                  <td className="p-4 text-right flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil size={16} className="text-muted-foreground" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}><Trash2 size={16} className="text-destructive" /></Button>
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

function AdminRFQ() {
  const qc = useQueryClient();
  const { data: rfqs, isLoading } = useQuery({
    queryKey: ["rfq_requests"],
    queryFn: async () => {
      const { data, error } = await supabase.from("rfq_requests").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    new: { label: "New", color: "bg-blue-100 text-blue-800" },
    viewed: { label: "Viewed", color: "bg-slate-100 text-slate-800" },
    replied: { label: "Replied", color: "bg-indigo-100 text-indigo-800" },
    quoted: { label: "Quoted", color: "bg-amber-100 text-amber-800" },
    negotiating: { label: "Negotiating", color: "bg-purple-100 text-purple-800" },
    accepted: { label: "Accepted", color: "bg-green-100 text-green-800" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
    order_created: { label: "Order Created", color: "bg-emerald-100 text-emerald-800" },
    archived: { label: "Archived", color: "bg-gray-100 text-gray-600" },
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
    reviewed: { label: "Reviewed", color: "bg-blue-100 text-blue-800" },
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("rfq_requests").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["rfq_requests"] }); }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">RFQ Requests</h2>

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
              {rfqs?.map((r) => {
                const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.new;
                return (
                  <tr key={r.id} className="border-t border-border">
                    <td className="p-4 text-muted-foreground">{new Date(r.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="p-4 font-medium text-foreground">{r.company}</td>
                    <td className="p-4 text-muted-foreground">{r.contact_person}</td>
                    <td className="p-4 text-muted-foreground">{r.category || "-"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                    </td>
                    <td className="p-4 text-right flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild title="View Detail">
                        <a href={`/supplier-center/rfq/${r.id}`}>
                          <Eye size={16} className="text-muted-foreground" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(r.id)} title="Delete">
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminOrders() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch related data for selected order
  const { data: orderDetail } = useQuery({
    queryKey: ["admin-order-detail", selectedOrder?.id],
    queryFn: async () => {
      if (!selectedOrder) return null;
      const [rfqRes, quoteRes, supplierRes, activityRes] = await Promise.all([
        selectedOrder.rfq_id
          ? supabase.from("rfq_requests").select("*").eq("id", selectedOrder.rfq_id).single()
          : Promise.resolve({ data: null }),
        selectedOrder.quote_id
          ? supabase.from("rfq_quotes").select("*").eq("id", selectedOrder.quote_id).single()
          : Promise.resolve({ data: null }),
        selectedOrder.supplier_id
          ? supabase.from("suppliers").select("*").eq("id", selectedOrder.supplier_id).single()
          : Promise.resolve({ data: null }),
        selectedOrder.rfq_id
          ? supabase.from("rfq_activity_log" as any).select("*").eq("rfq_id", selectedOrder.rfq_id).order("created_at", { ascending: false }).limit(10)
          : Promise.resolve({ data: [] }),
      ]);
      return {
        rfq: rfqRes.data,
        quote: quoteRes.data,
        supplier: supplierRes.data,
        activity: (activityRes.data || []) as any[],
      };
    },
    enabled: !!selectedOrder,
  });

  const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    pending: { label: "Pending", variant: "secondary" },
    confirmed: { label: "Confirmed", variant: "default" },
    processing: { label: "Processing", variant: "outline" },
    shipped: { label: "Shipped", variant: "outline" },
    completed: { label: "Completed", variant: "default" },
    cancelled: { label: "Cancelled", variant: "destructive" },
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    if (error) toast.error(error.message);
    else {
      toast.success(`Order status updated to ${newStatus}`);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("orders").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else {
      toast.success("Order deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      if (selectedOrder?.id === deleteId) setSelectedOrder(null);
    }
    setDeleteId(null);
  };

  const exportCSV = () => {
    const headers = ["Order ID", "Buyer Company", "Contact", "Email", "Category", "Quantity", "Agreed Price", "Lead Time", "Status", "Created At", "Notes"];
    const rows = filtered.map((o: any) => [
      o.id, o.buyer_company, o.buyer_contact, o.buyer_email, o.product_category || "", o.quantity || "",
      o.agreed_price, o.lead_time || "", o.status,
      new Date(o.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
      o.notes || "",
    ]);
    const csv = [headers, ...rows].map(r => r.map((c: string) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported");
  };

  const exportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(16);
    doc.text("Order Report", 14, 18);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}`, 14, 25);
    autoTable(doc, {
      startY: 30,
      head: [["Order ID", "Buyer", "Category", "Qty", "Price", "Status", "Date"]],
      body: filtered.map((o: any) => [
        o.id.slice(0, 8), o.buyer_company, o.product_category || "—", o.quantity || "—",
        o.agreed_price, o.status,
        new Date(o.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 87, 60] },
    });
    doc.save(`orders-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF exported");
  };

  const filtered = statusFilter === "all" ? orders : orders.filter((o: any) => o.status === statusFilter);
  const statuses = ["all", "pending", "confirmed", "processing", "shipped", "completed", "cancelled"];

  // Detail View
  if (selectedOrder) {
    const cfg = STATUS_CONFIG[selectedOrder.status] || { label: selectedOrder.status, variant: "outline" as const };
    const rfq = orderDetail?.rfq;
    const quote = orderDetail?.quote;
    const supplier = orderDetail?.supplier;
    const activity = orderDetail?.activity || [];

    return (
      <div>
        <Button variant="ghost" size="sm" className="mb-4 gap-1" onClick={() => setSelectedOrder(null)}>
          <ArrowLeft size={16} /> Back to Orders
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Order Detail</h2>
            <p className="text-sm text-muted-foreground font-mono mt-1">{selectedOrder.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={cfg.variant} className="text-sm">{cfg.label}</Badge>
            {selectedOrder.status === "pending" && (
              <Button size="sm" onClick={() => handleStatusUpdate(selectedOrder.id, "confirmed")}>Confirm</Button>
            )}
            {selectedOrder.status === "confirmed" && (
              <Button size="sm" onClick={() => handleStatusUpdate(selectedOrder.id, "processing")}>Process</Button>
            )}
            {selectedOrder.status === "processing" && (
              <Button size="sm" onClick={() => handleStatusUpdate(selectedOrder.id, "shipped")}>Ship</Button>
            )}
            {selectedOrder.status === "shipped" && (
              <Button size="sm" onClick={() => handleStatusUpdate(selectedOrder.id, "completed")}>Complete</Button>
            )}
            {!["completed", "cancelled"].includes(selectedOrder.status) && (
              <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(selectedOrder.id, "cancelled")}>Cancel</Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Buyer Info */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Building2 size={18} /> Buyer Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Building2 size={14} className="mt-0.5 text-muted-foreground" />
                <div><span className="text-muted-foreground">Company:</span> <span className="font-medium text-foreground">{selectedOrder.buyer_company}</span></div>
              </div>
              <div className="flex items-start gap-2">
                <Users size={14} className="mt-0.5 text-muted-foreground" />
                <div><span className="text-muted-foreground">Contact:</span> <span className="font-medium text-foreground">{selectedOrder.buyer_contact}</span></div>
              </div>
              <div className="flex items-start gap-2">
                <Mail size={14} className="mt-0.5 text-muted-foreground" />
                <div><span className="text-muted-foreground">Email:</span> <span className="font-medium text-foreground">{selectedOrder.buyer_email}</span></div>
              </div>
            </div>
          </div>

          {/* Supplier Info */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Package size={18} /> Supplier Information</h3>
            {supplier ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 mb-2">
                  {supplier.logo ? (
                    <img src={supplier.logo} alt={supplier.name} className="w-10 h-10 rounded-lg object-cover border border-border" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"><Building2 size={16} className="text-muted-foreground" /></div>
                  )}
                  <div>
                    <div className="font-medium text-foreground">{supplier.name}</div>
                    <div className="text-xs text-muted-foreground">{supplier.type}</div>
                  </div>
                </div>
                {supplier.location && (
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{supplier.location}</span>
                  </div>
                )}
                {supplier.contact && (
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="mt-0.5 text-muted-foreground" />
                    <span className="text-muted-foreground">{supplier.contact}</span>
                  </div>
                )}
                {supplier.description && (
                  <p className="text-muted-foreground text-xs leading-relaxed mt-2">{supplier.description}</p>
                )}
              </div>
            ) : (
              <Skeleton className="h-20" />
            )}
          </div>

          {/* Order Details */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><DollarSign size={18} /> Order Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="font-medium text-foreground">{selectedOrder.product_category || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span className="font-medium text-foreground">{selectedOrder.quantity || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Agreed Price</span><span className="font-medium text-foreground">{selectedOrder.agreed_price}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Lead Time</span><span className="font-medium text-foreground">{selectedOrder.lead_time || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span className="text-foreground">{new Date(selectedOrder.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Updated</span><span className="text-foreground">{new Date(selectedOrder.updated_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span></div>
              {selectedOrder.notes && (
                <div className="pt-2 border-t border-border">
                  <span className="text-muted-foreground block mb-1">Notes:</span>
                  <p className="text-foreground">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quotation Detail */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><FileCheck size={18} /> Quotation Detail</h3>
            {quote ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Quote Price</span><span className="font-medium text-foreground">{(quote as any).price}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">MOQ</span><span className="text-foreground">{(quote as any).moq || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Lead Time</span><span className="text-foreground">{(quote as any).lead_time || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="default">{(quote as any).status}</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Submitted</span><span className="text-foreground">{new Date((quote as any).created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span></div>
                {(quote as any).notes && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-muted-foreground block mb-1">Supplier Notes:</span>
                    <p className="text-foreground">{(quote as any).notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No quotation linked</p>
            )}
          </div>

          {/* Source RFQ */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Inbox size={18} /> Source RFQ</h3>
            {rfq ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">RFQ ID</span><span className="font-mono text-xs text-foreground">{(rfq as any).id?.slice(0, 8)}...</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><Badge variant="outline">{(rfq as any).status}</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="text-foreground">{(rfq as any).category || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Quantity</span><span className="text-foreground">{(rfq as any).quantity || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Target Price</span><span className="text-foreground">{(rfq as any).target_price || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="text-foreground">{(rfq as any).location || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Submitted</span><span className="text-foreground">{new Date((rfq as any).created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</span></div>
                {(rfq as any).notes && (
                  <div className="pt-2 border-t border-border">
                    <span className="text-muted-foreground block mb-1">Buyer Notes:</span>
                    <p className="text-foreground">{(rfq as any).notes}</p>
                  </div>
                )}
                <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                  <a href={`/supplier-center/rfq/${(rfq as any).id}`}>View Full RFQ →</a>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No RFQ linked</p>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><Clock size={18} /> Activity Timeline</h3>
            {activity.length > 0 ? (
              <div className="space-y-3">
                {activity.map((a: any) => (
                  <div key={a.id} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      <p className="text-foreground">{a.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {a.actor_type} · {new Date(a.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No activity recorded</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Order Management</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><Download size={16} className="mr-1" /> Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={exportCSV}><FileText size={14} className="mr-2" /> Export CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={exportPDF}><FileText size={14} className="mr-2" /> Export PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Badge variant="outline" className="text-sm">{orders.length} total orders</Badge>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "all" ? "All" : STATUS_CONFIG[s]?.label || s}
            {s === "all"
              ? ` (${orders.length})`
              : ` (${orders.filter((o: any) => o.status === s).length})`}
          </button>
        ))}
      </div>

      <Dialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this order? This action cannot be undone.</p>
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {isLoading ? <Skeleton className="h-64" /> : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <ShoppingCart className="mx-auto mb-3 h-10 w-10 opacity-50" />
          <p>No orders found</p>
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-4 font-semibold">Order ID</th>
                <th className="text-left p-4 font-semibold">Buyer</th>
                <th className="text-left p-4 font-semibold">Category</th>
                <th className="text-left p-4 font-semibold">Qty</th>
                <th className="text-left p-4 font-semibold">Price</th>
                <th className="text-left p-4 font-semibold">Status</th>
                <th className="text-left p-4 font-semibold">Date</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order: any) => {
                const cfg = STATUS_CONFIG[order.status] || { label: order.status, variant: "outline" as const };
                return (
                  <tr key={order.id} className="border-t border-border hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="p-4 font-mono text-xs text-foreground">{order.id.slice(0, 8)}...</td>
                    <td className="p-4">
                      <div className="font-medium text-foreground">{order.buyer_company}</div>
                      <div className="text-xs text-muted-foreground">{order.buyer_contact} · {order.buyer_email}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">{order.product_category || "—"}</td>
                    <td className="p-4 text-muted-foreground">{order.quantity || "—"}</td>
                    <td className="p-4 font-medium text-foreground">{order.agreed_price}</td>
                    <td className="p-4"><Badge variant={cfg.variant}>{cfg.label}</Badge></td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {new Date(order.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)} title="View Detail">
                          <Eye size={16} className="text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setDeleteId(order.id)}>
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminOverview({ products, suppliers, programs, partners }: { products: any; suppliers: any; programs: any; partners: any }) {
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  // Parse numeric price from text
  const parsePrice = (p: string) => {
    const n = parseFloat(p.replace(/[^0-9.,]/g, "").replace(",", "."));
    return isNaN(n) ? 0 : n;
  };

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + parsePrice(o.agreed_price), 0);
  const completedRevenue = orders.filter((o: any) => o.status === "completed").reduce((sum: number, o: any) => sum + parsePrice(o.agreed_price), 0);

  // Status distribution
  const statusCounts: Record<string, number> = {};
  orders.forEach((o: any) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const STATUS_COLORS: Record<string, string> = {
    pending: "hsl(var(--muted-foreground))",
    confirmed: "hsl(var(--primary))",
    processing: "hsl(40, 90%, 50%)",
    shipped: "hsl(200, 80%, 50%)",
    completed: "hsl(140, 70%, 40%)",
    cancelled: "hsl(var(--destructive))",
  };

  // Monthly trend
  const monthlyMap: Record<string, { month: string; orders: number; revenue: number }> = {};
  orders.forEach((o: any) => {
    const d = new Date(o.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!monthlyMap[key]) monthlyMap[key] = { month: key, orders: 0, revenue: 0 };
    monthlyMap[key].orders += 1;
    monthlyMap[key].revenue += parsePrice(o.agreed_price);
  });
  const monthlyData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));

  // Recent orders
  const recentOrders = [...orders].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard Analytics</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
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
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <ShoppingCart className="mx-auto mb-2 text-primary" size={24} />
          <div className="font-display text-2xl font-bold text-foreground">{orders.length}</div>
          <div className="text-xs text-muted-foreground">Total Orders</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5 text-center">
          <DollarSign className="mx-auto mb-2 text-primary" size={24} />
          <div className="font-display text-lg font-bold text-foreground">Rp {totalRevenue.toLocaleString("id-ID")}</div>
          <div className="text-xs text-muted-foreground">Total Revenue</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Trend */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Monthly Order Trend</h3>
          {monthlyData.length > 0 ? (
            <OrderMonthlyChart data={monthlyData} />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No order data yet</p>
          )}
        </div>

        {/* Status Distribution */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Orders by Status</h3>
          {statusData.length > 0 ? (
            <OrderStatusChart data={statusData} colors={STATUS_COLORS} />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No order data yet</p>
          )}
        </div>

        {/* Revenue Trend */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Monthly Revenue</h3>
          {monthlyData.length > 0 ? (
            <OrderRevenueChart data={monthlyData} />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No revenue data yet</p>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4">Recent Orders</h3>
          {recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((o: any) => (
                <div key={o.id} className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
                  <div>
                    <div className="font-medium text-foreground">{o.buyer_company}</div>
                    <div className="text-xs text-muted-foreground">{o.product_category || "—"} · {new Date(o.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">{o.agreed_price}</div>
                    <Badge variant={o.status === "completed" ? "default" : o.status === "cancelled" ? "destructive" : "secondary"} className="text-xs">{o.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No orders yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Chart sub-components using recharts
function OrderMonthlyChart({ data }: { data: { month: string; orders: number; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function OrderStatusChart({ data, colors }: { data: { name: string; value: number }[]; colors: Record<string, string> }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }: any) => `${name}: ${value}`}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={colors[entry.name] || "hsl(var(--muted-foreground))"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

function OrderRevenueChart({ data }: { data: { month: string; orders: number; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(v: number) => [`Rp ${v.toLocaleString("id-ID")}`, "Revenue"]} />
        <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function AdminContent() {
  const { user } = useAuth();
  const { isAdmin } = useUserRole();
  const { data: products } = useProducts(true);
  const { data: suppliers } = useSuppliers();
  const { data: programs } = usePrograms();
  const { data: partners } = usePartners();
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegment = location.pathname.replace("/admin", "").replace("/", "") || "overview";
  const tab = (["overview", "products", "suppliers", "programs", "partners", "pages", "rfq", "orders", "reports", "users"].includes(pathSegment) ? pathSegment : "overview") as AdminTab;

  const tabRouteMap: Record<AdminTab, string> = {
    overview: "/admin",
    products: "/admin/products",
    suppliers: "/admin/suppliers",
    programs: "/admin/programs",
    partners: "/admin/partners",
    pages: "/admin/pages",
    rfq: "/admin/rfq",
    orders: "/admin/orders",
    reports: "/admin/reports",
    users: "/admin/users",
  };

  const editorTabs: AdminTab[] = ["overview", "products", "suppliers", "programs", "pages", "reports"];
  const adminTabs: AdminTab[] = ["overview", "products", "suppliers", "programs", "partners", "pages", "rfq", "orders", "reports", "users"];
  const visibleTabs = isAdmin ? adminTabs : editorTabs;

  return (
    <div className="flex-1 flex flex-col">
      <header className="h-14 flex items-center border-b border-border px-4 bg-card">
        <SidebarTrigger className="mr-4" />
        <h1 className="font-display text-lg font-bold text-foreground">Admin Panel</h1>
        <div className="ml-auto text-sm text-muted-foreground">{user?.email}</div>
      </header>
      <main className="flex-1 p-6 bg-background overflow-auto">
        <div className="flex gap-2 mb-6 flex-wrap">
          {visibleTabs.map((t) => (
            <button key={t} onClick={() => navigate(tabRouteMap[t])}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "overview" && <AdminOverview products={products} suppliers={suppliers} programs={programs} partners={partners} />}
        {tab === "products" && <AdminProducts />}
        {tab === "suppliers" && <AdminSuppliers />}
        {tab === "programs" && <AdminPrograms />}
        {tab === "partners" && <AdminPartners />}
        {tab === "pages" && <AdminPages />}
        {tab === "rfq" && <AdminRFQ />}
        {tab === "orders" && <AdminOrders />}
        {tab === "reports" && <AdminReports />}
        {tab === "users" && isAdmin && <AdminUsers />}
      </main>
    </div>
  );
}

function AdminDashboard() {
  const { user, loading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();

  const isLoading = loading || roleLoading;

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    if (!isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isLoading, user, isAdmin, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Skeleton className="h-8 w-48 mx-auto" />
          <p className="text-sm text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

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
