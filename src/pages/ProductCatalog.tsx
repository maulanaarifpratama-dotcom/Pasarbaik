import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, CheckCircle, Building2, Leaf } from "lucide-react";
import { products, suppliers, programs, organizations, productCategories, certificationTypes, impactTypes, getSupplier, getProgram } from "@/data/mockData";

const locations = [...new Set(suppliers.map(s => s.province))];

const ProductCatalog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [certification, setCertification] = useState("All");
  const [impact, setImpact] = useState("All");
  const [location, setLocation] = useState("All");

  const filtered = products.filter((p) => {
    const supplier = getSupplier(p.supplierId);
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || supplier?.name.toLowerCase().includes(search.toLowerCase());
    const matchCert = certification === "All" || p.certifications.includes(certification);
    const matchImpact = impact === "All" || p.impactBadge === impact;
    const matchLoc = location === "All" || supplier?.province === location;
    return matchCat && matchSearch && matchCert && matchImpact && matchLoc;
  });

  return (
    <main className="pt-16">
      <section className="bg-primary py-14">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Product Catalog</h1>
          <p className="text-primary-foreground/70">Produk berdampak dari program pembinaan UMKM — setiap produk dapat ditelusuri ke program dan komunitas asalnya.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {/* Search */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text" placeholder="Cari produk atau supplier..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Filters */}
        <div className="space-y-3 mb-8">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider self-center mr-1">Category:</span>
            {productCategories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider self-center mr-1">Certification:</span>
            <button onClick={() => setCertification("All")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${certification === "All" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}>All</button>
            {certificationTypes.map((c) => (
              <button key={c} onClick={() => setCertification(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${certification === c ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider self-center mr-1">Location:</span>
            <button onClick={() => setLocation("All")} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${location === "All" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}>All</button>
            {locations.map((l) => (
              <button key={l} onClick={() => setLocation(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${location === l ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/70"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const supplier = getSupplier(product.supplierId);
            const program = getProgram(product.programId);
            return (
              <div key={product.id} className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-border">
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                  {supplier?.verified && (
                    <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground gap-1">
                      <CheckCircle size={12} /> Verified
                    </Badge>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="gap-1 text-xs bg-accent/90 text-accent-foreground">
                      <Leaf size={10} /> {product.impactBadge}
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-card-foreground mb-1 text-sm">{product.name}</h3>
                  <p className="text-muted-foreground text-xs mb-2">{supplier?.name}</p>
                  <div className="space-y-1 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1"><MapPin size={10} /> {supplier?.location}</div>
                    <div className="flex items-center gap-1"><Building2 size={10} /> {program?.name}</div>
                    <div>Kapasitas: {product.capacity} · MOQ: {product.moq}</div>
                  </div>
                  {product.certifications.length > 0 && (
                    <div className="flex gap-1 flex-wrap mb-3">
                      {product.certifications.slice(0, 2).map((c) => (
                        <Badge key={c} variant="outline" className="text-[10px] px-1.5 py-0">{c}</Badge>
                      ))}
                      {product.certifications.length > 2 && <Badge variant="outline" className="text-[10px] px-1.5 py-0">+{product.certifications.length - 2}</Badge>}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{product.price}</span>
                    <Link to={`/products/${product.id}`}>
                      <Button variant="default" size="sm" className="text-xs h-7">View Detail</Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Filter className="mx-auto mb-3" size={40} />
            <p>Tidak ada produk ditemukan.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default ProductCatalog;
