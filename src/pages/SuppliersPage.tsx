import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, ArrowLeft, Users, Package, Search, ArrowRight } from "lucide-react";
import { useSuppliers, useSupplier, useProducts } from "@/hooks/useSupabaseQuery";

export function SuppliersList() {
  const { data: suppliers, isLoading } = useSuppliers();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const types = ["All", ...new Set(suppliers?.map((s) => s.type).filter(Boolean) || [])];

  const filtered = suppliers?.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.location?.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "All" || s.type === type;
    return matchSearch && matchType;
  });

  return (
    <main className="pt-16">
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-primary-foreground">Suppliers</h1>
          <p className="text-primary-foreground/60 mt-2">Verified UMKM suppliers from impact programs</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {types.map((t) => (
              <button key={t} onClick={() => setType(t as string)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${type === t ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                {t as string}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-6">
                <Skeleton className="h-16 w-16 rounded-xl mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filtered?.map((s) => (
              <Link key={s.id} to={`/suppliers/${s.slug}`} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                    {s.logo ? (
                      <img src={s.logo} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="text-primary" size={24} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors truncate">{s.name}</h3>
                    <Badge variant="outline" className="text-xs">{s.type}</Badge>
                  </div>
                </div>
                <p className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin size={14} /> {s.location}
                </p>
                <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && filtered?.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="mx-auto mb-3" size={48} />
            <p>No suppliers found.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export function SupplierProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: supplier, isLoading } = useSupplier(slug || "");
  const { data: products } = useProducts();

  const supplierProducts = products?.filter((p) => p.supplier_id === supplier?.id);

  if (isLoading) {
    return (
      <main className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-48" />
        </div>
      </main>
    );
  }

  if (!supplier) {
    return (
      <main className="pt-16">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Supplier not found.</p>
          <Link to="/suppliers"><Button variant="outline" className="mt-4">Back</Button></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-16">
      <div className="container mx-auto px-4 py-8">
        <Link to="/suppliers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={16} /> Back to Suppliers
        </Link>

        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
              {supplier.logo ? (
                <img src={supplier.logo} alt={supplier.name} className="w-full h-full object-cover" />
              ) : (
                <Users className="text-primary" size={36} />
              )}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">{supplier.name}</h1>
              <div className="flex gap-2 mt-2 flex-wrap">
                <Badge>{supplier.type}</Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin size={14} /> {supplier.location}</span>
              </div>
              <p className="text-muted-foreground mt-4 leading-relaxed">{supplier.description}</p>
              {supplier.contact && (
                <p className="text-sm text-muted-foreground mt-2">📧 {supplier.contact}</p>
              )}
            </div>
          </div>
        </div>

        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Products ({supplierProducts?.length || 0})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {supplierProducts?.map((p) => (
            <Link key={p.id} to={`/products/${p.slug}`} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group">
              <div className="aspect-video bg-secondary overflow-hidden">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="text-muted-foreground" size={36} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</h3>
                <p className="text-xs text-muted-foreground">{p.category}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {p.impact_tags?.slice(0, 2).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
                {p.price && <p className="text-sm font-semibold text-foreground mt-2">{p.price}</p>}
              </div>
            </Link>
          ))}
          {(!supplierProducts || supplierProducts.length === 0) && (
            <p className="text-muted-foreground col-span-3 text-center py-8">No products listed yet.</p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-secondary rounded-xl p-8 text-center">
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">Want to order from {supplier.name}?</h3>
          <p className="text-muted-foreground mb-4 text-sm">Submit a Request for Quotation and we'll connect you directly.</p>
          <Link to="/rfq"><Button size="lg">Request Quotation <ArrowRight className="ml-1" size={18} /></Button></Link>
        </div>
      </div>
    </main>
  );
}
