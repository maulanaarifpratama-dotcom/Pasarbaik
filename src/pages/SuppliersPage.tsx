import { MapPin, CheckCircle, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const suppliers = [
  { id: 1, name: "Batik Pekalongan Indah", owner: "Ibu Sari Rahayu", location: "Pekalongan, Jawa Tengah", year: 2015, category: "Textile & Craft", capacity: "500 unit/bulan", products: 3, verified: true, certifications: ["Halal"] },
  { id: 2, name: "Rempah Nusantara", owner: "Bapak Ahmad", location: "Bandung, Jawa Barat", year: 2018, category: "Food & Beverage", capacity: "2000 unit/bulan", products: 5, verified: true, certifications: ["BPOM", "Halal"] },
  { id: 3, name: "Craft Natural Bali", owner: "Wayan Susilo", location: "Gianyar, Bali", year: 2016, category: "Eco Product", capacity: "1000 unit/bulan", products: 4, verified: true, certifications: ["Export Ready"] },
  { id: 4, name: "Kopi Rakyat Indonesia", owner: "Pak Daud", location: "Toraja, Sulawesi Selatan", year: 2019, category: "Food & Beverage", capacity: "800 unit/bulan", products: 2, verified: false, certifications: [] },
  { id: 5, name: "Kayu Craft Jepara", owner: "Haji Muhtar", location: "Jepara, Jawa Tengah", year: 2012, category: "Furniture & Craft", capacity: "300 unit/bulan", products: 6, verified: true, certifications: ["Export Ready"] },
  { id: 6, name: "Herbal Indonesia", owner: "Ibu Dewi", location: "Yogyakarta", year: 2020, category: "Health & Beauty", capacity: "1500 unit/bulan", products: 4, verified: true, certifications: ["BPOM", "Halal", "Organic"] },
];

const SuppliersPage = () => (
  <main className="pt-16">
    <section className="bg-primary py-14">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Our Suppliers</h1>
        <p className="text-primary-foreground/70">UMKM terverifikasi dengan kapasitas produksi yang terstandar.</p>
      </div>
    </section>

    <section className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((s) => (
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
            <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-1"><MapPin size={12} /> {s.location}</div>
              <div>Kategori: {s.category}</div>
              <div>Berdiri: {s.year}</div>
              <div>Kapasitas: {s.capacity}</div>
              <div className="flex items-center gap-1"><Package size={12} /> {s.products} produk</div>
            </div>
            {s.certifications.length > 0 && (
              <div className="flex gap-1.5 flex-wrap mb-4">
                {s.certifications.map((c) => (
                  <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
                ))}
              </div>
            )}
            <Link to="/products">
              <Button variant="outline" size="sm" className="w-full">View Products</Button>
            </Link>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default SuppliersPage;
