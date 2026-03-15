import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, ArrowLeft, Users, Package } from "lucide-react";
import { useSuppliers, useSupplier, useProducts } from "@/hooks/useSupabaseQuery";

export function SuppliersList() {
  const { data: suppliers, isLoading } = useSuppliers();

  return (
    <main className="pt-16">
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-primary-foreground">Suppliers</h1>
          <p className="text-primary-foreground/60 mt-2">Verified UMKM suppliers from impact programs</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
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
            {suppliers?.map((s) => (
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
              <p className="text-muted-foreground mt-4">{supplier.description}</p>
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
                {p.price && <p className="text-sm font-semibold text-foreground mt-1">{p.price}</p>}
              </div>
            </Link>
          ))}
          {(!supplierProducts || supplierProducts.length === 0) && (
            <p className="text-muted-foreground col-span-3 text-center py-8">No products listed yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
