import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, ArrowRight, CheckCircle, Building2, Leaf, ShieldCheck } from "lucide-react";
import { getProduct, getSupplier, getProgram, getOrganization } from "@/data/mockData";

function ProductDetail() {
  const { id } = useParams();
  const product = getProduct(id || "");

  if (!product) {
    return (
      <main className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Product not found</h2>
          <Link to="/products"><Button>Back to Catalog</Button></Link>
        </div>
      </main>
    );
  }

  const supplier = getSupplier(product.supplierId);
  const program = getProgram(product.programId);
  const organization = program ? getOrganization(program.organizationId) : null;

  return (
    <main className="pt-16">
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-2">
            <Link to="/products" className="hover:text-accent transition-colors">Products</Link>
            <span>/</span>
            <span className="text-primary-foreground">{product.name}</span>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Image */}
          <div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden border border-border">
              <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.certifications.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-4">
                {product.certifications.map((c) => (
                  <Badge key={c} className="bg-primary text-primary-foreground gap-1">
                    <ShieldCheck size={12} /> {c}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <Badge variant="secondary" className="gap-1 mb-3 bg-accent/20 text-accent-foreground border-accent/30">
              <Leaf size={12} /> {product.impactBadge}
            </Badge>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Category</div>
                <div className="font-semibold text-foreground text-sm">{product.category}</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Price Range</div>
                <div className="font-semibold text-foreground text-sm">{product.price}</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">MOQ</div>
                <div className="font-semibold text-foreground text-sm">{product.moq}</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Capacity</div>
                <div className="font-semibold text-foreground text-sm">{product.capacity}</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Lead Time</div>
                <div className="font-semibold text-foreground text-sm">{product.leadTime}</div>
              </div>
            </div>

            <Link to="/rfq">
              <Button variant="default" size="lg" className="w-full mb-4">
                Request Quotation <ArrowRight className="ml-1" size={18} />
              </Button>
            </Link>

            {/* Supplier Info */}
            {supplier && (
              <div className="bg-card rounded-xl border border-border p-5 mb-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users size={16} /> Supplier Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Supplier</span><Link to={`/suppliers/${supplier.id}`} className="font-medium text-primary hover:underline">{supplier.name}</Link></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Owner</span><span className="text-foreground">{supplier.owner}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="text-foreground flex items-center gap-1"><MapPin size={12} />{supplier.location}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Since</span><span className="text-foreground">{supplier.year}</span></div>
                  {supplier.verified && <div className="flex items-center gap-1 text-primary text-xs font-semibold"><CheckCircle size={14} /> Verified Supplier</div>}
                </div>
              </div>
            )}

            {/* Program Origin */}
            {program && organization && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Building2 size={16} /> Program Origin
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Program</span><Link to={`/programs/${program.id}`} className="font-medium text-primary hover:underline">{program.name}</Link></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Organization</span><span className="text-foreground">{organization.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><Badge variant="outline" className="text-xs">{organization.type}</Badge></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="text-foreground">{program.location}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Since</span><span className="text-foreground">{program.startYear}</span></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Impact Story */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-cream rounded-xl p-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Impact Story</h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Community Background</h4>
                <p>{product.communityBackground}</p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">Program Impact</h4>
                <p>{product.impactStory}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">Impact Metrics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-5 text-center">
                <div className="font-display text-2xl font-bold text-primary">{product.metrics.jobsCreated}</div>
                <div className="text-xs text-muted-foreground">Jobs Created</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 text-center">
                <div className="font-display text-2xl font-bold text-primary">{product.metrics.womenWorkers}</div>
                <div className="text-xs text-muted-foreground">Women Workers</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 text-center">
                <div className="font-display text-2xl font-bold text-accent">{product.metrics.revenueGenerated}</div>
                <div className="text-xs text-muted-foreground">Revenue Generated</div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 text-center">
                <div className="font-display text-2xl font-bold text-accent">{product.metrics.householdsSupported}</div>
                <div className="text-xs text-muted-foreground">Households Supported</div>
              </div>
            </div>

            {/* Traceability */}
            <div className="mt-6 bg-primary/5 rounded-xl p-5 border border-primary/10">
              <h3 className="font-semibold text-foreground mb-3 text-sm">Supply Chain Traceability</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span className="bg-secondary px-2 py-1 rounded font-medium text-foreground">{organization?.name}</span>
                <ArrowRight size={12} />
                <span className="bg-secondary px-2 py-1 rounded font-medium text-foreground">{program?.name}</span>
                <ArrowRight size={12} />
                <span className="bg-secondary px-2 py-1 rounded font-medium text-foreground">{supplier?.name}</span>
                <ArrowRight size={12} />
                <span className="bg-accent/20 px-2 py-1 rounded font-medium text-foreground">PasarBaik</span>
                <ArrowRight size={12} />
                <span className="bg-secondary px-2 py-1 rounded font-medium text-foreground">Corporate Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;
