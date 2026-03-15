import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUpload } from "@/components/ImageUpload";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useSuppliers } from "@/hooks/useSupabaseQuery";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ImageIcon, ArrowLeft, Save } from "lucide-react";

const SUPPLIER_TYPES = ["UMKM", "Cooperative", "Social Enterprise", "NGO", "Corporate", "Government"];

type SupplierFormData = {
  name: string;
  slug: string;
  type: string;
  location: string;
  contact: string;
  description: string;
  logo: string;
};

function SupplierForm({ supplier, onSave, onCancel, onDelete }: {
  supplier?: any;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<SupplierFormData>({
    name: supplier?.name || "",
    slug: supplier?.slug || "",
    type: supplier?.type || "",
    location: supplier?.location || "",
    contact: supplier?.contact || "",
    description: supplier?.description || "",
    logo: supplier?.logo || "",
  });

  const updateField = (key: keyof SupplierFormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const autoSlug = (name: string) => {
    updateField("name", name);
    if (!supplier) {
      updateField("slug", name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Supplier name is required"); return; }
    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      type: form.type || null,
      location: form.location || null,
      contact: form.contact || null,
      description: form.description || null,
      logo: form.logo || null,
    };

    if (supplier) {
      const { error } = await supabase.from("suppliers").update(payload).eq("id", supplier.id);
      if (error) toast.error(error.message);
      else { toast.success("Supplier updated"); qc.invalidateQueries({ queryKey: ["suppliers"] }); onSave(); }
    } else {
      const { error } = await supabase.from("suppliers").insert(payload);
      if (error) toast.error(error.message);
      else { toast.success("Supplier created"); qc.invalidateQueries({ queryKey: ["suppliers"] }); onSave(); }
    }
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              {supplier ? "Edit Supplier" : "New Supplier"}
            </h2>
            {supplier && (
              <p className="text-xs text-muted-foreground">
                Created {new Date(supplier.created_at).toLocaleDateString("id-ID")}
                {supplier.updated_at !== supplier.created_at && ` · Updated ${new Date(supplier.updated_at).toLocaleDateString("id-ID")}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onDelete && (
            <Button type="button" variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={onDelete}>
              <Trash2 size={14} className="mr-1" /> Delete
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
          <Button type="submit" size="sm" disabled={saving}>
            <Save size={14} className="mr-1" /> {saving ? "Saving..." : "Save Supplier"}
          </Button>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Supplier Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => autoSlug(e.target.value)} placeholder="e.g. Koperasi Toraja Melo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="koperasi-toraja-melo" className="text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => updateField("type", v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {SUPPLIER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={(e) => updateField("location", e.target.value)} placeholder="e.g. Toraja, Sulawesi Selatan" />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Contact Information</h3>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Details</Label>
              <Input id="contact" value={form.contact} onChange={(e) => updateField("contact", e.target.value)} placeholder="Email, phone, or website" />
            </div>
          </div>

          {/* Description */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Description</h3>
            <Textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the supplier, their mission, products they offer, impact story..."
              rows={8}
              className="resize-y"
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Logo */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Logo / Photo</h3>
            <ImageUpload value={form.logo} onChange={(url) => updateField("logo", url)} folder="suppliers" />
            {form.logo && (
              <p className="text-xs text-muted-foreground truncate">{form.logo.split("/").pop()}</p>
            )}
          </div>

          {/* Quick Info */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-3">
            <h3 className="font-semibold text-foreground text-sm">Summary</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="text-foreground">{form.type || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="text-foreground">{form.location || "—"}</span>
              </div>
            </div>
          </div>

          {/* Metadata */}
          {supplier && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <h3 className="font-semibold text-foreground text-sm">Metadata</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supplier ID</span>
                  <span className="text-foreground font-mono">{supplier.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">{new Date(supplier.created_at).toLocaleDateString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="text-foreground">{new Date(supplier.updated_at).toLocaleDateString("id-ID")}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

export function AdminSuppliers() {
  const { data: suppliers, isLoading } = useSuppliers();
  const qc = useQueryClient();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("suppliers").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else { toast.success("Supplier deleted"); qc.invalidateQueries({ queryKey: ["suppliers"] }); }
    setDeleteId(null);
    setMode("list");
    setEditItem(null);
  };

  if (mode === "add") {
    return <SupplierForm onSave={() => setMode("list")} onCancel={() => setMode("list")} />;
  }

  if (mode === "edit" && editItem) {
    return (
      <SupplierForm
        supplier={editItem}
        onSave={() => { setMode("list"); setEditItem(null); }}
        onCancel={() => { setMode("list"); setEditItem(null); }}
        onDelete={() => setDeleteId(editItem.id)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Suppliers</h2>
        <Button size="sm" onClick={() => setMode("add")}>
          <Plus size={16} className="mr-1" /> Add Supplier
        </Button>
      </div>

      <Dialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this supplier? This action cannot be undone.</p>
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
                <th className="text-left p-4 font-semibold">Location</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers?.map((s) => (
                <tr key={s.id} className="border-t border-border hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => { setEditItem(s); setMode("edit"); }}>
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
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => { setEditItem(s); setMode("edit"); }}>
                        <Pencil size={16} className="text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}>
                        <Trash2 size={16} className="text-destructive" />
                      </Button>
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
