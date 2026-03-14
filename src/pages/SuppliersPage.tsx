import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, Package, Users, Calendar, Building2, ArrowRight } from "lucide-react";
import { getSupplier, getProgram, getOrganization, getProductsBySupplier, suppliers } from "@/data/mockData";

function SuppliersList() {
  return (
    <main className="pt-16">
      <section className="bg-primary py-14">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">UMKM Suppliers</h1>
          <p className="text-primary-foreground/70">Supplier terverifikasi dari program pembinaan CSR, NGO, dan pemerintah.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((s) => {
            const program = getProgram(s.programId);
            const products = getProductsBySupplier(s.id);
            return (
              <div key={s.id} className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{s.name}</h3>
                    <p className="text-muted-foreground text-sm">{s.owner}</p>
                  </div>
                  {s.verified && (
                    <Badge className="bg-primary text-primary-foreground gap-1 shrink-0">
                      <CheckCircle size={12} /> Verified
                    </Badge>
                  )}
                </div>
                <div className="space-y-1.5 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center gap-1"><MapPin size={12} /> {s.location}</div>
                  <div className="flex items-center gap-1"><Building2 size={12} /> Program: {program?.name}</div>
                  <div className="flex items-center gap-1"><Calendar size={12} /> Since {s.year}</div>
                  <div>Kapasitas: {s.capacity}</div>
                  <div className="flex items-center gap-1"><Package size={12} /> {products.length} produk</div>
                  <div className="flex items-center gap-1"><Users size={12} /> {s.workers} pekerja ({s.womenWorkers} perempuan)</div>
                </div>
                {s.certifications.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {s.certifications.map((c) => (
                      <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                    ))}
                  </div>
                )}
                <Link to={`/suppliers/${s.id}`}>
                  <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function SupplierProfile() {
  const { id } = useParams();
  const supplier = getSupplier(id || "");

  if (!supplier) {
    return (
      <main className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Supplier not found</h2>
          <Link to="/suppliers"><Button>Back to Suppliers</Button></Link>
        </div>
      </main>
    );
  }

  const program = getProgram(supplier.programId);
  const organization = program ? getOrganization(program.organizationId) : null;
  const products = getProductsBySupplier(supplier.id);

  return (
    <main className="pt-16">
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-2">
            <Link to="/suppliers" className="hover:text-accent transition-colors">Suppliers</Link>
            <span>/</span>
            <span className="text-primary-foreground">{supplier.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold text-primary-foreground">{supplier.name}</h1>
            {supplier.verified && <Badge className="bg-accent text-accent-foreground gap-1"><CheckCircle size={12} /> Verified</Badge>}
          </div>
          <p className="text-primary-foreground/70 mt-1">{supplier.owner} · {supplier.location}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-3">Business Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Category</span><span className="text-foreground">{supplier.category}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="text-foreground">{supplier.location}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Since</span><span className="text-foreground">{supplier.year}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Capacity</span><span className="text-foreground">{supplier.capacity}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span className="text-foreground">{supplier.revenue}</span></div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-3">Impact Data</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center bg-secondary/50 rounded-lg p-3">
                  <div className="font-display text-xl font-bold text-primary">{supplier.workers}</div>
                  <div className="text-xs text-muted-foreground">Workers</div>
                </div>
                <div className="text-center bg-secondary/50 rounded-lg p-3">
                  <div className="font-display text-xl font-bold text-primary">{supplier.womenWorkers}</div>
                  <div className="text-xs text-muted-foreground">Women</div>
                </div>
              </div>
            </div>

            {supplier.certifications.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-3">Certifications</h3>
                <div className="flex gap-2 flex-wrap">
                  {supplier.certifications.map((c) => (
                    <Badge key={c} className="bg-primary text-primary-foreground">{c}</Badge>
                  ))}
                </div>
              </div>
            )}

            {program && organization && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-3">Program Origin</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Program</span><Link to={`/programs/${program.id}`} className="text-primary hover:underline">{program.name}</Link></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Organization</span><span className="text-foreground">{organization.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><Badge variant="outline" className="text-xs">{organization.type}</Badge></div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Description & Products */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">About</h2>
              <p className="text-muted-foreground leading-relaxed">{supplier.description}</p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Products ({products.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((p) => (
                  <Link key={p.id} to={`/products/${p.id}`} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-card-foreground text-sm">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{p.price}</p>
                      <Badge variant="secondary" className="text-[10px] mt-2"><Leaf size={8} className="mr-1" />{p.impactBadge}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export { SuppliersList, SupplierProfile };
export default SuppliersList;
