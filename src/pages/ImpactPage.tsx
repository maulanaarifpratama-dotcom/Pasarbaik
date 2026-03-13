import { Users, TrendingUp, Briefcase, Heart, BarChart3 } from "lucide-react";

const metrics = [
  { value: "120+", label: "UMKM Aktif", icon: Users, color: "bg-emerald/10 text-primary" },
  { value: "Rp 3.2B", label: "Total Transaksi", icon: TrendingUp, color: "bg-accent/10 text-accent" },
  { value: "35", label: "Corporate Buyers", icon: Briefcase, color: "bg-emerald/10 text-primary" },
  { value: "850+", label: "Tenaga Kerja Terlibat", icon: Heart, color: "bg-accent/10 text-accent" },
  { value: "45%", label: "Peningkatan Pendapatan UMKM", icon: BarChart3, color: "bg-emerald/10 text-primary" },
  { value: "15", label: "Program CSR Aktif", icon: Users, color: "bg-accent/10 text-accent" },
];

const ImpactPage = () => (
  <main className="pt-16">
    <section className="bg-primary py-14">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Impact Dashboard</h1>
        <p className="text-primary-foreground/70">Dampak sosial yang terukur dari ekosistem PasarBaik.</p>
      </div>
    </section>

    <section className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-card rounded-xl p-6 border border-border shadow-sm">
            <div className={`w-12 h-12 rounded-xl ${m.color} flex items-center justify-center mb-4`}>
              <m.icon size={24} />
            </div>
            <div className="font-display text-3xl font-bold text-card-foreground mb-1">{m.value}</div>
            <div className="text-muted-foreground text-sm">{m.label}</div>
          </div>
        ))}
      </div>
    </section>

    <section className="bg-cream py-16">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Dampak Nyata untuk Komunitas</h2>
        <p className="text-muted-foreground leading-relaxed">
          Setiap transaksi di PasarBaik berkontribusi langsung pada peningkatan ekonomi UMKM lokal. 
          Kami memastikan setiap supply chain memberikan dampak positif yang terukur — dari penciptaan lapangan kerja 
          hingga peningkatan pendapatan komunitas.
        </p>
      </div>
    </section>
  </main>
);

export default ImpactPage;
