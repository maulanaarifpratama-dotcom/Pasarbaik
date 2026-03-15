import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, ArrowLeft, Building2, Package, Users } from "lucide-react";
import { usePrograms, useProgram, useProducts, useSuppliers } from "@/hooks/useSupabaseQuery";

export function ProgramsList() {
  const { data: programs, isLoading } = usePrograms();

  return (
    <main className="pt-16">
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-primary-foreground">Programs</h1>
          <p className="text-primary-foreground/60 mt-2">CSR, NGO, and government development programs</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {programs?.map((p) => (
              <Link key={p.id} to={`/programs/${p.slug}`} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="text-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{p.title}</h3>
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline" className="text-xs">{p.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1"><MapPin size={12} /> {p.location}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                <div className="flex gap-1 mt-3 flex-wrap">
                  {p.impact_tags?.map((tag: string) => (
                    <span key={tag} className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
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
      <div className="container mx-auto px-4 py-8">
        <Link to="/programs" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={16} /> Back to Programs
        </Link>

        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <Badge className="mb-3">{program.category}</Badge>
          <h1 className="font-display text-3xl font-bold text-foreground">{program.title}</h1>
          <p className="flex items-center gap-1 text-muted-foreground mt-2"><MapPin size={16} /> {program.location}</p>
          <p className="text-muted-foreground mt-4">{program.description}</p>
          <div className="flex gap-2 mt-4 flex-wrap">
            {program.impact_tags?.map((tag: string) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
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
                <Link key={s.id} to={`/suppliers/${s.slug}`} className="block bg-muted rounded-lg p-4 hover:bg-muted/80 transition-colors">
                  <p className="font-medium text-foreground">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.location}</p>
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
                <Link key={p.id} to={`/products/${p.slug}`} className="block bg-muted rounded-lg p-4 hover:bg-muted/80 transition-colors">
                  <p className="font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.category}</p>
                </Link>
              ))}
              {(!programProducts || programProducts.length === 0) && (
                <p className="text-sm text-muted-foreground">No products linked yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
