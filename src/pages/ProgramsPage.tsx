import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Building2, Leaf, ArrowRight } from "lucide-react";
import { programs, getOrganization, getSuppliersByProgram, getProductsByProgram } from "@/data/mockData";

function ProgramsList() {
  return (
    <main className="pt-16">
      <section className="bg-primary py-14">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Development Programs</h1>
          <p className="text-primary-foreground/70">Program CSR, NGO, dan pemerintah yang menjadi sumber produk berdampak.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog) => {
            const org = getOrganization(prog.organizationId);
            return (
              <div key={prog.id} className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-shadow">
                <Badge variant="outline" className="mb-3 text-xs">{org?.type}</Badge>
                <h3 className="font-semibold text-card-foreground text-lg mb-1">{prog.name}</h3>
                <p className="text-muted-foreground text-xs mb-3">{org?.name}</p>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{prog.description}</p>
                <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1"><MapPin size={12} /> {prog.location}</div>
                  <div className="flex items-center gap-1"><Calendar size={12} /> Since {prog.startYear}</div>
                  <div className="flex items-center gap-1"><Users size={12} /> {prog.suppliersCount} suppliers · {prog.productsCount} products</div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={prog.status === "Active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}>{prog.status}</Badge>
                  <Link to={`/programs/${prog.id}`}>
                    <Button variant="outline" size="sm" className="text-xs">View Program</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function ProgramDetail() {
  const { id } = useParams();
  const program = programs.find(p => p.id === id);

  if (!program) {
    return (
      <main className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">Program not found</h2>
          <Link to="/programs"><Button>Back to Programs</Button></Link>
        </div>
      </main>
    );
  }

  const org = getOrganization(program.organizationId);
  const programSuppliers = getSuppliersByProgram(program.id);
  const programProducts = getProductsByProgram(program.id);

  const totalJobs = programProducts.reduce((s, p) => s + p.metrics.jobsCreated, 0);
  const totalWomen = programProducts.reduce((s, p) => s + p.metrics.womenWorkers, 0);
  const totalHouseholds = programProducts.reduce((s, p) => s + p.metrics.householdsSupported, 0);

  return (
    <main className="pt-16">
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-primary-foreground/60 text-sm mb-2">
            <Link to="/programs" className="hover:text-accent transition-colors">Programs</Link>
            <span>/</span>
            <span className="text-primary-foreground">{program.name}</span>
          </div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-display text-3xl font-bold text-primary-foreground">{program.name}</h1>
            <Badge className="bg-accent text-accent-foreground">{program.status}</Badge>
          </div>
          <p className="text-primary-foreground/70">{org?.name} · {org?.type}</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-3">Program Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Organization</span><span className="text-foreground">{org?.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><Badge variant="outline" className="text-xs">{org?.type}</Badge></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="text-foreground">{program.location}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Start Year</span><span className="text-foreground">{program.startYear}</span></div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-foreground mb-3">Impact Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: programSuppliers.length, l: "Suppliers" },
                  { v: programProducts.length, l: "Products" },
                  { v: totalJobs, l: "Jobs Created" },
                  { v: totalWomen, l: "Women Workers" },
                  { v: totalHouseholds, l: "Households" },
                ].map((m, i) => (
                  <div key={i} className="text-center bg-secondary/50 rounded-lg p-3">
                    <div className="font-display text-lg font-bold text-primary">{m.v}</div>
                    <div className="text-xs text-muted-foreground">{m.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-3">About This Program</h2>
              <p className="text-muted-foreground leading-relaxed">{program.description}</p>
              <p className="text-muted-foreground leading-relaxed mt-3">{org?.description}</p>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Suppliers ({programSuppliers.length})</h2>
              <div className="space-y-3">
                {programSuppliers.map((s) => (
                  <Link key={s.id} to={`/suppliers/${s.id}`} className="block bg-card rounded-xl border border-border p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-card-foreground text-sm">{s.name}</h3>
                        <p className="text-xs text-muted-foreground">{s.owner} · {s.location}</p>
                      </div>
                      <ArrowRight size={16} className="text-muted-foreground" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Products ({programProducts.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {programProducts.map((p) => (
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

export { ProgramsList, ProgramDetail };
export default ProgramsList;
