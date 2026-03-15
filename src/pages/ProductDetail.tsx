import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Package, MapPin, Building2, Users, Briefcase, TrendingUp, ArrowRight } from "lucide-react";
import { useProduct } from "@/hooks/useSupabaseQuery";

function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading } = useProduct(slug || "");

  if (isLoading) {
    return (
      <main className="pt-16">
        <div className="container mx-auto px-4 py-12">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-16">
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Product not found.</p>
          <Link to="/products"><Button variant="outline" className="mt-4">Back to Catalog</Button></Link>
        </div>
      </main>
    );
  }

  const supplier = product.suppliers as any;
  const program = product.programs as any;

  return (
    <main className="pt-16">
      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="aspect-square bg-secondary rounded-xl overflow-hidden">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="text-muted-foreground" size={80} />
              </div>
            )}
          </div>

          <div>
            <div className="flex gap-2 mb-3 flex-wrap">
              {product.impact_tags?.map((tag: string) => (
                <Badge key={tag} className="bg-primary/10 text-primary border-primary/20">{tag}</Badge>
              ))}
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {product.price && (
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">Price Range</p>
                  <p className="font-semibold text-foreground">{product.price}</p>
                </div>
              )}
              {product.moq && (
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-xs text-muted-foreground">MOQ</p>
                  <p className="font-semibold text-foreground">{product.moq}</p>
                </div>
              )}
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground">Category</p>
                <p className="font-semibold text-foreground">{product.category}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-semibold text-foreground capitalize">{product.status}</p>
              </div>
            </div>

            <Link to="/rfq">
              <Button size="lg" className="w-full">Request Quotation <ArrowRight className="ml-1" size={18} /></Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-12">
          {supplier && (
            <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Users size={18} className="text-primary" /> Supplier Info
              </h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                  {supplier.logo ? (
                    <img src={supplier.logo} alt={supplier.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="text-primary" size={20} />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{supplier.name}</p>
                  <p className="text-xs text-muted-foreground">{supplier.type}</p>
                </div>
              </div>
              <p className="flex items-center gap-1 text-sm text-muted-foreground mb-2"><MapPin size={14} /> {supplier.location}</p>
              <p className="text-sm text-muted-foreground">{supplier.description}</p>
              <Link to={`/suppliers/${supplier.slug}`}>
                <Button variant="outline" size="sm" className="mt-4">View Supplier Profile</Button>
              </Link>
            </div>
          )}

          {program && (
            <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow">
              <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Building2 size={18} className="text-primary" /> Program Origin
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Program:</span> <span className="font-medium text-foreground">{program.title}</span></p>
                <p><span className="text-muted-foreground">Category:</span> {program.category}</p>
                <p className="flex items-center gap-1"><MapPin size={14} className="text-muted-foreground" /> {program.location}</p>
                <p className="text-muted-foreground mt-2">{program.description}</p>
              </div>
              <Link to={`/programs/${program.slug}`}>
                <Button variant="outline" size="sm" className="mt-4">View Program</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="mt-12 bg-muted rounded-xl p-8">
          <h3 className="font-display text-lg font-semibold text-foreground mb-6 text-center">Impact Traceability</h3>
          <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
            <div className="bg-card rounded-lg px-5 py-4 border border-border text-center min-w-[120px]">
              <Building2 size={20} className="mx-auto mb-2 text-primary" />
              <p className="font-medium text-foreground text-xs">{program?.title || "Program"}</p>
            </div>
            <ArrowRight className="text-muted-foreground/40 hidden md:block" size={20} />
            <div className="bg-card rounded-lg px-5 py-4 border border-border text-center min-w-[120px]">
              <Users size={20} className="mx-auto mb-2 text-primary" />
              <p className="font-medium text-foreground text-xs">{supplier?.name || "Supplier"}</p>
            </div>
            <ArrowRight className="text-muted-foreground/40 hidden md:block" size={20} />
            <div className="bg-accent/10 rounded-lg px-5 py-4 border border-accent/30 text-center min-w-[120px]">
              <Briefcase size={20} className="mx-auto mb-2 text-accent" />
              <p className="font-medium text-foreground text-xs">PasarBaik</p>
            </div>
            <ArrowRight className="text-muted-foreground/40 hidden md:block" size={20} />
            <div className="bg-card rounded-lg px-5 py-4 border border-border text-center min-w-[120px]">
              <Briefcase size={20} className="mx-auto mb-2 text-primary" />
              <p className="font-medium text-foreground text-xs">Buyer</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetail;
