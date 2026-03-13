import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Users, BarChart3, ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Dashboard tracking dampak program CSR Anda",
  "Akses ke 120+ UMKM binaan terverifikasi",
  "Laporan impact berkala untuk stakeholder",
  "Dukungan supply aggregation untuk pesanan besar",
];

const CSRPage = () => (
  <main className="pt-16">
    <section className="bg-primary py-14">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">For CSR & NGO Partners</h1>
        <p className="text-primary-foreground/70">Maksimalkan dampak program pembinaan UMKM Anda bersama PasarBaik.</p>
      </div>
    </section>

    <section className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
            Hubungkan UMKM Binaan dengan Market Access
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            PasarBaik membantu program CSR dan NGO untuk tidak hanya membina UMKM, 
            tapi juga menghubungkan mereka dengan pasar korporat melalui supply aggregation yang terstandar.
          </p>
          <ul className="space-y-3 mb-8">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                <CheckCircle className="text-primary mt-0.5 shrink-0" size={18} />
                {b}
              </li>
            ))}
          </ul>
          <Link to="/rfq">
            <Button size="lg">
              Hubungi Kami <ArrowRight className="ml-1" size={18} />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {[
            { icon: Building2, title: "Daftarkan Program", desc: "Input data program CSR dan UMKM binaan Anda ke platform" },
            { icon: Users, title: "UMKM Onboarding", desc: "UMKM mengunggah profil usaha dan katalog produk" },
            { icon: BarChart3, title: "Track Impact", desc: "Monitor dampak sosial dan ekonomi secara real-time" },
          ].map((step, i) => (
            <div key={i} className="bg-card rounded-xl p-5 border border-border flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                <step.icon className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground text-sm">{step.title}</h3>
                <p className="text-muted-foreground text-xs mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default CSRPage;
