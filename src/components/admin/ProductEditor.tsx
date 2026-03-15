import { useState, useEffect } from "react";
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
import { useProducts, useSuppliers } from "@/hooks/useSupabaseQuery";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, ImageIcon, ArrowLeft, X, Save } from "lucide-react";

const CATEGORIES = ["Food & Beverage", "Textiles", "Craft", "Eco Products", "Corporate Gift", "Service"];
const STATUSES = ["active", "draft", "archived"];
const IMPACT_TAGS = ["Women", "Village", "Eco", "Recycled", "CSR", "Education", "Health"];
const SDG_TAGS = ["SDG1", "SDG5", "SDG8", "SDG12", "SDG13"];

type ProductFormData = {
  name: string;
  slug: string;
  category: string;
  supplier_id: string;
  price: string;
  moq: string;
  description: string;
  image: string;
  status: string;
  impact_tags: string[];
};

function TagSelector({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (tag: string) => {
    onChange(value.includes(tag) ? value.filter(t => t !== tag) : [...value, tag]);
  };
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              value.includes(tag)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:border-primary/50"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductForm({ product, onSave, onCancel, onDelete }: {
  product?: any;
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const { data: suppliers } = useSuppliers();
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ProductFormData>({
    name: product?.name || "",
    slug: product?.slug || "",
    category: product?.category || "",
    supplier_id: product?.supplier_id || "",
    price: product?.price || "",
    moq: product?.moq || "",
    description: product?.description || "",
    image: product?.image || "",
    status: product?.status || "active",
    impact_tags: product?.impact_tags || [],
  });

  const updateField = (key: keyof ProductFormData, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const autoSlug = (name: string) => {
    updateField("name", name);
    if (!product) {
      updateField("slug", name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Product name is required"); return; }
    setSaving(true);

    const payload = {
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: form.category || null,
      supplier_id: form.supplier_id || null,
      price: form.price || null,
      moq: form.moq || null,
      description: form.description || null,
      image: form.image || null,
      status: form.status || "active",
      impact_tags: form.impact_tags.length > 0 ? form.impact_tags : null,
    };

    if (product) {
      const { error } = await supabase.from("products").update(payload).eq("id", product.id);
      if (error) toast.error(error.message);
      else { toast.success("Product updated"); qc.invalidateQueries({ queryKey: ["products"] }); onSave(); }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) toast.error(error.message);
      else { toast.success("Product created"); qc.invalidateQueries({ queryKey: ["products"] }); onSave(); }
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
              {product ? "Edit Product" : "New Product"}
            </h2>
            {product && (
              <p className="text-xs text-muted-foreground">
                Created {new Date(product.created_at).toLocaleDateString("id-ID")}
                {product.updated_at !== product.created_at && ` · Updated ${new Date(product.updated_at).toLocaleDateString("id-ID")}`}
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
            <Save size={14} className="mr-1" /> {saving ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN — Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" value={form.name} onChange={(e) => autoSlug(e.target.value)} placeholder="e.g. Toraja Arabica Coffee" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={form.slug} onChange={(e) => updateField("slug", e.target.value)} placeholder="toraja-arabica-coffee" className="text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Select value={form.supplier_id} onValueChange={(v) => updateField("supplier_id", v)}>
                  <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                  <SelectContent>
                    {suppliers?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Pricing & Quantity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price / Price Range</Label>
                <Input id="price" value={form.price} onChange={(e) => updateField("price", e.target.value)} placeholder="e.g. IDR 85,000 - 120,000/250g" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="moq">Minimum Order Quantity (MOQ)</Label>
                <Input id="moq" value={form.moq} onChange={(e) => updateField("moq", e.target.value)} placeholder="e.g. 200 pcs" />
              </div>
            </div>
          </div>

          {/* Description Card */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Description</h3>
            <Textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe the product, its origin, impact story, certifications..."
              rows={8}
              className="resize-y"
            />
          </div>

          {/* Impact Tags Card */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Impact & SDG Tags</h3>
            <TagSelector label="Impact Tags" options={IMPACT_TAGS} value={form.impact_tags} onChange={(v) => updateField("impact_tags", v)} />
            {/* SDG tags informational — stored as impact_tags for now */}
            <div className="pt-2 border-t border-border">
              <Label className="text-xs text-muted-foreground">SDG Alignment (optional)</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SDG_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const tags = form.impact_tags;
                      updateField("impact_tags", tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag]);
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                      form.impact_tags.includes(tag)
                        ? "bg-accent text-accent-foreground border-accent"
                        : "bg-muted text-muted-foreground border-border hover:border-accent/50"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Media + Status */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Status</h3>
            <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => (
                  <SelectItem key={s} value={s}>
                    <span className="capitalize">{s}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${form.status === "active" ? "bg-green-500" : form.status === "draft" ? "bg-yellow-500" : "bg-muted-foreground"}`} />
              <span className="text-xs text-muted-foreground capitalize">
                {form.status === "active" ? "Published & visible" : form.status === "draft" ? "Draft — not visible" : "Archived"}
              </span>
            </div>
          </div>

          {/* Image Card */}
          <div className="bg-card rounded-xl border border-border p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Product Image</h3>
            <ImageUpload value={form.image} onChange={(url) => updateField("image", url)} folder="products" />
            {form.image && (
              <p className="text-xs text-muted-foreground truncate">
                {form.image.split("/").pop()}
              </p>
            )}
          </div>

          {/* Metadata Card */}
          {product && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <h3 className="font-semibold text-foreground text-sm">Metadata</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Product ID</span>
                  <span className="text-foreground font-mono">{product.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-foreground">{new Date(product.created_at).toLocaleDateString("id-ID")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="text-foreground">{new Date(product.updated_at).toLocaleDateString("id-ID")}</span>
                </div>
                {product.supplier_id && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Supplier ID</span>
                    <span className="text-foreground font-mono">{product.supplier_id.slice(0, 8)}...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

export function AdminProducts() {
  const { data: products, isLoading } = useProducts(true);
  const qc = useQueryClient();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editItem, setEditItem] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("products").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else { toast.success("Product deleted"); qc.invalidateQueries({ queryKey: ["products"] }); }
    setDeleteId(null);
    setMode("list");
    setEditItem(null);
  };

  // Editor Mode
  if (mode === "add") {
    return (
      <ProductForm
        onSave={() => setMode("list")}
        onCancel={() => setMode("list")}
      />
    );
  }

  if (mode === "edit" && editItem) {
    return (
      <ProductForm
        product={editItem}
        onSave={() => { setMode("list"); setEditItem(null); }}
        onCancel={() => { setMode("list"); setEditItem(null); }}
        onDelete={() => setDeleteId(editItem.id)}
      />
    );
  }

  // List Mode
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Manage Products</h2>
        <Button size="sm" onClick={() => setMode("add")}>
          <Plus size={16} className="mr-1" /> Add Product
        </Button>
      </div>

      {/* Delete Confirm */}
      <Dialog open={!!deleteId} onOpenChange={(v) => { if (!v) setDeleteId(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Delete</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this product? This action cannot be undone.</p>
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
                <tr key={p.id} className="border-t border-border hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => { setEditItem(p); setMode("edit"); }}>
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
                  <td className="p-4">
                    <Badge variant={p.status === "active" ? "default" : "secondary"} className="capitalize">
                      {p.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => { setEditItem(p); setMode("edit"); }}>
                        <Pencil size={16} className="text-muted-foreground" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(p.id)}>
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
