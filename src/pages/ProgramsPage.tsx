import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, ArrowLeft, Building2, Package, Users, Search, ArrowRight } from "lucide-react";
import { usePrograms, useProgram, useProducts, useSuppliers } from "@/hooks/useSupabaseQuery";

export function ProgramsList() {
  const { data: programs, isLoading } = usePrograms();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(programs?.map((p) => p.category).filter(Boolean) || [])];

  const filtered = programs?.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <main className="pt-16">
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-primary-foreground">Programs</h1>
          <p className="text-primary-foreground/60 mt-2">CSR, NGO, and government development programs</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input placeholder="Search programs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                <Skeleton className="aspect-video" />
                <div className="p-6"><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered?.map((p) => (
              <Link key={p.id} to={`/programs/${p.slug}`} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group">
                <div className="aspect-video bg-secondary overflow-hidden">
                  {p.images?.[0] ? (
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <Building2 className="text-primary/40" size={48} />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">{p.category}</Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={10} /> {p.location}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
                  <div className="flex gap-1 flex-wrap">
                    {p.impact_tags?.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && filtered?.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Building2 className="mx-auto mb-3" size={48} />
            <p>No programs found.</p>
          </div>
        )}
      </section>
    </main>
  );
}

export function ProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: program, isLoading } = useProgram(slug || "");
  const { data: products } = useProducts();
  const { data: suppliers } = useSuppliers();

  const programProducts = products?.filter((p) => p.program_id === program?.id);
  const programSupplierIds = new Set(programProducts?.map((p) => p.supplier_id).filter(Boolean));
  const programSuppliers = suppliers?.filter((s) => programSupplierIds.has(s.id));

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

  if (!program) {
    return (
      <main className="pt-16">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Program not found.</p>
          <Link to="/programs"><Button variant="outline" className="mt-4">Back</Button></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-16">
      {/* Hero banner with program image */}
      {program.images?.[0] && (
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img src={program.images[0]} alt={program.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <Link to="/programs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={16} /> Back to Programs
        </Link>

        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <Badge className="mb-3">{program.category}</Badge>
          <h1 className="font-display text-3xl font-bold text-foreground">{program.title}</h1>
          <p className="flex items-center gap-1 text-muted-foreground mt-2"><MapPin size={16} /> {program.location}</p>
          <p className="text-muted-foreground mt-4 leading-relaxed">{program.description}</p>
          <div className="flex gap-2 mt-4 flex-wrap">
            {program.impact_tags?.map((tag: string) => (
              <Badge key={tag} className="bg-primary/10 text-primary border-primary/20">{tag}</Badge>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users size={18} className="text-primary" /> Suppliers ({programSuppliers?.length || 0})
            </h2>
            <div className="space-y-3">
              {programSuppliers?.map((s) => (
                <Link key={s.id} to={`/suppliers/${s.slug}`} className="flex items-center gap-3 bg-muted rounded-lg p-4 hover:bg-muted/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                    {s.logo ? (
                      <img src={s.logo} alt={s.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className="text-primary" size={16} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.location}</p>
                  </div>
                </Link>
              ))}
              {(!programSuppliers || programSuppliers.length === 0) && (
                <p className="text-sm text-muted-foreground">No suppliers linked yet.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Package size={18} className="text-primary" /> Products ({programProducts?.length || 0})
            </h2>
            <div className="space-y-3">
              {programProducts?.map((p) => (
                <Link key={p.id} to={`/products/${p.slug}`} className="flex items-center gap-3 bg-muted rounded-lg p-4 hover:bg-muted/80 transition-colors">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-secondary flex items-center justify-center shrink-0">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="text-muted-foreground" size={16} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category}</p>
                  </div>
                </Link>
              ))}
              {(!programProducts || programProducts.length === 0) && (
                <p className="text-sm text-muted-foreground">No products linked yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-secondary rounded-xl p-8 text-center">
          <h3 className="font-display text-xl font-semibold text-foreground mb-2">Interested in products from this program?</h3>
          <p className="text-muted-foreground mb-4 text-sm">Submit a Request for Quotation and we'll match you with the right suppliers.</p>
          <Link to="/rfq"><Button size="lg">Request Quotation <ArrowRight className="ml-1" size={18} /></Button></Link>
        </div>
      </div>
    </main>
  );
}
