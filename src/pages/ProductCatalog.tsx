import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, CheckCircle } from "lucide-react";
import productGift from "@/assets/product-corporate-gift.jpg";
import productFood from "@/assets/product-food.jpg";
import productEco from "@/assets/product-eco.jpg";

const categories = ["All", "Corporate Gift", "Specialty Food", "Craft", "Eco Product"];

const products = [
  { id: 1, name: "Batik Gift Set Premium", supplier: "UMKM Batik Pekalongan", capacity: "500 unit/bulan", moq: "100 unit", location: "Pekalongan, Jawa Tengah", category: "Corporate Gift", verified: true, img: productGift, price: "Rp 150.000 - 250.000" },
  { id: 2, name: "Organic Spice Collection", supplier: "Rempah Nusantara", capacity: "2000 unit/bulan", moq: "200 unit", location: "Bandung, Jawa Barat", category: "Specialty Food", verified: true, img: productFood, price: "Rp 75.000 - 120.000" },
  { id: 3, name: "Eco Tote Bag Anyaman", supplier: "Craft Natural Bali", capacity: "1000 unit/bulan", moq: "50 unit", location: "Gianyar, Bali", category: "Eco Product", verified: true, img: productEco, price: "Rp 85.000 - 150.000" },
  { id: 4, name: "Hampers Kopi Nusantara", supplier: "Kopi Rakyat Indonesia", capacity: "800 unit/bulan", moq: "100 unit", location: "Toraja, Sulawesi Selatan", category: "Specialty Food", verified: false, img: productFood, price: "Rp 200.000 - 350.000" },
  { id: 5, name: "Wooden Desk Organizer", supplier: "Kayu Craft Jepara", capacity: "300 unit/bulan", moq: "50 unit", location: "Jepara, Jawa Tengah", category: "Craft", verified: true, img: productGift, price: "Rp 120.000 - 200.000" },
  { id: 6, name: "Natural Soap Gift Set", supplier: "Herbal Indonesia", capacity: "1500 unit/bulan", moq: "100 unit", location: "Yogyakarta", category: "Eco Product", verified: true, img: productEco, price: "Rp 65.000 - 100.000" },
];

const ProductCatalog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.supplier.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="bg-primary py-14">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Product Catalog</h1>
          <p className="text-primary-foreground/70">Temukan produk UMKM berdampak yang telah terkurasi dan terverifikasi.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Cari produk atau supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <div key={product.id} className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-border">
              <div className="aspect-[4/3] overflow-hidden relative">
                <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                {product.verified && (
                  <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground gap-1">
                    <CheckCircle size={12} /> Verified
                  </Badge>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-card-foreground mb-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{product.supplier}</p>
                <div className="space-y-1 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1"><MapPin size={12} /> {product.location}</div>
                  <div>Kapasitas: {product.capacity}</div>
                  <div>MOQ: {product.moq}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{product.price}</span>
                  <Button variant="default" size="sm">View Details</Button>
                </div>
              </div>
            </div>
          ))}
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
