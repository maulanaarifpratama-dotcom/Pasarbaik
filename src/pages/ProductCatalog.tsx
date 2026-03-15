import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Package, MapPin } from "lucide-react";
import { useProducts } from "@/hooks/useSupabaseQuery";

function ProductCatalog() {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(products?.map((p) => p.category).filter(Boolean) || [])];

  const filtered = products?.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <main className="pt-16">
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-primary-foreground">Product Catalog</h1>
          <p className="text-primary-foreground/60 mt-2">Impact products from verified UMKM suppliers</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setCategory(c as string)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${category === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                {c as string}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-4">
                <Skeleton className="aspect-square mb-4 rounded-lg" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered?.map((p) => (
              <Link key={p.id} to={`/products/${p.slug}`} className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="aspect-square bg-secondary overflow-hidden">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="text-muted-foreground" size={48} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin size={10} /> {(p.suppliers as any)?.name || "Unknown Supplier"}
                  </p>
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
          </div>
        )}

        {!isLoading && filtered?.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="mx-auto mb-3" size={48} />
            <p>No products found.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default ProductCatalog;
