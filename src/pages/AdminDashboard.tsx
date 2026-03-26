import { useState, useEffect } from "react";
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
import { BarChart3, Package, Users, Building2, FileText, LogOut, Handshake, Plus, Trash2, ImageIcon, Pencil, Inbox, Eye, FileEdit, ShoppingCart } from "lucide-react";
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

type AdminTab = "overview" | "products" | "suppliers" | "programs" | "partners" | "pages" | "rfq" | "reports" | "users";

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
  const tab = (["overview", "products", "suppliers", "programs", "partners", "pages", "rfq", "reports", "users"].includes(pathSegment) ? pathSegment : "overview") as AdminTab;

  const tabRouteMap: Record<AdminTab, string> = {
    overview: "/admin",
    products: "/admin/products",
    suppliers: "/admin/suppliers",
    programs: "/admin/programs",
    partners: "/admin/partners",
    pages: "/admin/pages",
    rfq: "/admin/rfq",
    reports: "/admin/reports",
    users: "/admin/users",
  };

  // Editors can access content tabs but not user management
  const editorTabs: AdminTab[] = ["overview", "products", "suppliers", "programs", "pages", "reports"];
  const adminTabs: AdminTab[] = ["overview", "products", "suppliers", "programs", "partners", "pages", "rfq", "reports", "users"];
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
        {tab === "pages" && <AdminPages />}
        {tab === "rfq" && <AdminRFQ />}
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
