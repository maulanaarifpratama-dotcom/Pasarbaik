import productGift from "@/assets/product-corporate-gift.jpg";
import productFood from "@/assets/product-food.jpg";
import productEco from "@/assets/product-eco.jpg";

// === TYPES ===
export interface Organization {
  id: string;
  name: string;
  type: "CSR" | "NGO" | "Government";
  description: string;
  logo?: string;
}

export interface Program {
  id: string;
  name: string;
  organizationId: string;
  description: string;
  location: string;
  startYear: number;
  status: "Active" | "Completed";
  suppliersCount: number;
  productsCount: number;
}

export interface Supplier {
  id: string;
  name: string;
  owner: string;
  location: string;
  province: string;
  year: number;
  category: string;
  capacity: string;
  programId: string;
  verified: boolean;
  certifications: string[];
  workers: number;
  womenWorkers: number;
  revenue: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  supplierId: string;
  programId: string;
  category: string;
  img: string;
  price: string;
  moq: string;
  capacity: string;
  leadTime: string;
  description: string;
  impactBadge: string;
  impactStory: string;
  communityBackground: string;
  certifications: string[];
  metrics: {
    jobsCreated: number;
    womenWorkers: number;
    revenueGenerated: string;
    householdsSupported: number;
  };
}

export interface ImpactMetric {
  label: string;
  value: string;
  category: string;
}

// === ORGANIZATIONS ===
export const organizations: Organization[] = [
  { id: "org-1", name: "Yayasan Cinta Kasih", type: "NGO", description: "NGO pemberdayaan UMKM pedesaan di seluruh Indonesia, fokus pada pengembangan kapasitas dan market access." },
  { id: "org-2", name: "PT Telkom Indonesia", type: "CSR", description: "Program CSR pembinaan UMKM digital dan kerajinan lokal melalui pelatihan dan pendampingan bisnis." },
  { id: "org-3", name: "Kementerian Koperasi & UKM", type: "Government", description: "Program pemerintah untuk peningkatan daya saing UMKM melalui standardisasi produk dan akses pasar." },
  { id: "org-4", name: "USAID Indonesia", type: "NGO", description: "Program pengembangan ekonomi inklusif dan pemberdayaan perempuan melalui kewirausahaan." },
  { id: "org-5", name: "PT Unilever Indonesia", type: "CSR", description: "Program pemberdayaan petani dan pengrajin lokal untuk supply chain berkelanjutan." },
];

// === PROGRAMS ===
export const programs: Program[] = [
  { id: "prg-1", name: "Desa Batik Berdaya", organizationId: "org-1", description: "Program pemberdayaan pengrajin batik di Pekalongan dengan pelatihan motif kontemporer dan standarisasi produksi.", location: "Pekalongan, Jawa Tengah", startYear: 2020, status: "Active", suppliersCount: 25, productsCount: 40 },
  { id: "prg-2", name: "Digital UMKM Nusantara", organizationId: "org-2", description: "Program digitalisasi dan peningkatan kapasitas UMKM makanan dan rempah tradisional.", location: "Bandung, Jawa Barat", startYear: 2021, status: "Active", suppliersCount: 30, productsCount: 55 },
  { id: "prg-3", name: "Kerajinan Hijau Indonesia", organizationId: "org-3", description: "Program pemerintah untuk pengembangan produk ramah lingkungan dari bahan daur ulang dan alami.", location: "Bali & Yogyakarta", startYear: 2019, status: "Active", suppliersCount: 20, productsCount: 35 },
  { id: "prg-4", name: "Women Empowerment Through Craft", organizationId: "org-4", description: "Pemberdayaan perempuan melalui pelatihan keterampilan kerajinan tangan dan akses pasar internasional.", location: "Toraja, Sulawesi Selatan", startYear: 2021, status: "Active", suppliersCount: 15, productsCount: 20 },
  { id: "prg-5", name: "Sustainable Sourcing Initiative", organizationId: "org-5", description: "Inisiatif sourcing berkelanjutan dari petani dan pengrajin lokal untuk supply chain korporat.", location: "Jepara, Jawa Tengah", startYear: 2022, status: "Active", suppliersCount: 18, productsCount: 30 },
];

// === SUPPLIERS ===
export const suppliers: Supplier[] = [
  { id: "sup-1", name: "Batik Pekalongan Indah", owner: "Ibu Sari Rahayu", location: "Pekalongan, Jawa Tengah", province: "Jawa Tengah", year: 2015, category: "Textile & Craft", capacity: "500 unit/bulan", programId: "prg-1", verified: true, certifications: ["Halal", "Export Ready"], workers: 25, womenWorkers: 18, revenue: "Rp 450 juta/tahun", description: "Produsen batik tulis dan cap dengan motif khas Pekalongan. Telah memasok hampers korporat untuk 15+ perusahaan." },
  { id: "sup-2", name: "Rempah Nusantara", owner: "Bapak Ahmad", location: "Bandung, Jawa Barat", province: "Jawa Barat", year: 2018, category: "Food & Beverage", capacity: "2000 unit/bulan", programId: "prg-2", verified: true, certifications: ["BPOM", "Halal", "Organic"], workers: 30, womenWorkers: 20, revenue: "Rp 600 juta/tahun", description: "Produsen rempah organik dan bumbu tradisional dengan standar food safety internasional." },
  { id: "sup-3", name: "Craft Natural Bali", owner: "Wayan Susilo", location: "Gianyar, Bali", province: "Bali", year: 2016, category: "Eco Product", capacity: "1000 unit/bulan", programId: "prg-3", verified: true, certifications: ["Export Ready", "Fair Trade"], workers: 20, womenWorkers: 12, revenue: "Rp 380 juta/tahun", description: "Kerajinan anyaman dari bahan alami dan daur ulang. Spesialis tote bag dan aksesoris eco-friendly." },
  { id: "sup-4", name: "Kopi Rakyat Indonesia", owner: "Pak Daud Lembang", location: "Toraja, Sulawesi Selatan", province: "Sulawesi Selatan", year: 2019, category: "Food & Beverage", capacity: "800 unit/bulan", programId: "prg-4", verified: true, certifications: ["Fair Trade"], workers: 45, womenWorkers: 30, revenue: "Rp 520 juta/tahun", description: "Koperasi petani kopi arabika Toraja dengan proses roasting tradisional dan modern." },
  { id: "sup-5", name: "Kayu Craft Jepara", owner: "Haji Muhtar", location: "Jepara, Jawa Tengah", province: "Jawa Tengah", year: 2012, category: "Furniture & Craft", capacity: "300 unit/bulan", programId: "prg-5", verified: true, certifications: ["Export Ready", "FSC Certified"], workers: 35, womenWorkers: 8, revenue: "Rp 700 juta/tahun", description: "Pengrajin kayu jati dan mahoni dengan teknik ukir tradisional Jepara untuk furniture dan dekorasi." },
  { id: "sup-6", name: "Herbal Indonesia", owner: "Ibu Dewi Kartini", location: "Yogyakarta", province: "DI Yogyakarta", year: 2020, category: "Health & Beauty", capacity: "1500 unit/bulan", programId: "prg-3", verified: true, certifications: ["BPOM", "Halal", "Organic"], workers: 22, womenWorkers: 18, revenue: "Rp 320 juta/tahun", description: "Produsen sabun herbal dan skincare alami dari bahan-bahan lokal berkualitas." },
  { id: "sup-7", name: "Tenun Flores Indah", owner: "Mama Maria", location: "Ende, NTT", province: "Nusa Tenggara Timur", year: 2017, category: "Textile & Craft", capacity: "200 unit/bulan", programId: "prg-4", verified: true, certifications: ["UNESCO Heritage"], workers: 40, womenWorkers: 38, revenue: "Rp 280 juta/tahun", description: "Kelompok penenun tradisional ikat Flores dengan pewarna alami. Setiap kain memiliki makna budaya." },
  { id: "sup-8", name: "Bamboo Creative Hub", owner: "Mas Eko Prasetyo", location: "Purwokerto, Jawa Tengah", province: "Jawa Tengah", year: 2021, category: "Eco Product", capacity: "600 unit/bulan", programId: "prg-5", verified: false, certifications: [], workers: 15, womenWorkers: 6, revenue: "Rp 180 juta/tahun", description: "Startup kerajinan bambu modern untuk peralatan kantor dan rumah tangga ramah lingkungan." },
];

// === PRODUCTS ===
export const products: Product[] = [
  {
    id: "prd-1", name: "Batik Gift Set Premium", supplierId: "sup-1", programId: "prg-1",
    category: "Corporate Gift", img: productGift, price: "Rp 150.000 - 250.000",
    moq: "100 unit", capacity: "500 unit/bulan", leadTime: "14-21 hari",
    description: "Set hadiah batik premium berisi scarf, pouch, dan kartu ucapan dalam box eksklusif. Cocok untuk corporate gifting dan hampers.",
    impactBadge: "Women Empowerment",
    impactStory: "Setiap set batik dibuat oleh kelompok ibu-ibu pengrajin di Pekalongan yang sebelumnya tidak memiliki penghasilan tetap. Melalui program Desa Batik Berdaya, mereka mendapat pelatihan motif modern dan akses pasar korporat.",
    communityBackground: "Desa Wiradesa, Pekalongan — komunitas pengrajin batik tulis yang hampir punah akibat kompetisi batik printing. Program ini menghidupkan kembali tradisi batik tulis dengan motif kontemporer.",
    certifications: ["Halal", "Export Ready"],
    metrics: { jobsCreated: 25, womenWorkers: 18, revenueGenerated: "Rp 450 juta", householdsSupported: 25 },
  },
  {
    id: "prd-2", name: "Organic Spice Collection", supplierId: "sup-2", programId: "prg-2",
    category: "Specialty Food", img: productFood, price: "Rp 75.000 - 120.000",
    moq: "200 unit", capacity: "2000 unit/bulan", leadTime: "7-14 hari",
    description: "Koleksi rempah organik Indonesia dalam packaging premium — kunyit, jahe, lengkuas, dan sereh.",
    impactBadge: "Sustainable Agriculture",
    impactStory: "Rempah-rempah ini bersumber dari petani organik binaan yang beralih dari pertanian konvensional. Program Digital UMKM membantu standardisasi dan sertifikasi produk.",
    communityBackground: "Petani rempah di lereng Gunung Tangkuban Perahu yang bertransformasi menjadi produsen rempah organik bersertifikat.",
    certifications: ["BPOM", "Halal", "Organic"],
    metrics: { jobsCreated: 30, womenWorkers: 20, revenueGenerated: "Rp 600 juta", householdsSupported: 30 },
  },
  {
    id: "prd-3", name: "Eco Tote Bag Anyaman", supplierId: "sup-3", programId: "prg-3",
    category: "Eco Product", img: productEco, price: "Rp 85.000 - 150.000",
    moq: "50 unit", capacity: "1000 unit/bulan", leadTime: "10-14 hari",
    description: "Tote bag anyaman dari serat alam dan bahan daur ulang. Desain modern untuk penggunaan sehari-hari.",
    impactBadge: "Circular Economy",
    impactStory: "Pengrajin Bali mengubah limbah kelapa dan pandan menjadi tas berkualitas ekspor. Program Kerajinan Hijau memberikan pelatihan desain dan quality control.",
    communityBackground: "Komunitas pengrajin di Gianyar yang mengolah limbah pertanian menjadi produk bernilai tinggi.",
    certifications: ["Export Ready", "Fair Trade"],
    metrics: { jobsCreated: 20, womenWorkers: 12, revenueGenerated: "Rp 380 juta", householdsSupported: 20 },
  },
  {
    id: "prd-4", name: "Hampers Kopi Nusantara", supplierId: "sup-4", programId: "prg-4",
    category: "Specialty Food", img: productFood, price: "Rp 200.000 - 350.000",
    moq: "100 unit", capacity: "800 unit/bulan", leadTime: "14-21 hari",
    description: "Hampers kopi arabika Toraja dengan pilihan single origin dan blend. Termasuk manual brew kit.",
    impactBadge: "Women Empowerment",
    impactStory: "Koperasi petani kopi yang 70% anggotanya perempuan. Program Women Empowerment Through Craft memberikan pelatihan pasca-panen dan packaging.",
    communityBackground: "Komunitas petani kopi di dataran tinggi Toraja yang melestarikan budaya kopi tradisional sambil mengadopsi teknik modern.",
    certifications: ["Fair Trade"],
    metrics: { jobsCreated: 45, womenWorkers: 30, revenueGenerated: "Rp 520 juta", householdsSupported: 45 },
  },
  {
    id: "prd-5", name: "Wooden Desk Organizer", supplierId: "sup-5", programId: "prg-5",
    category: "Corporate Gift", img: productGift, price: "Rp 120.000 - 200.000",
    moq: "50 unit", capacity: "300 unit/bulan", leadTime: "21-30 hari",
    description: "Desk organizer dari kayu jati daur ulang dengan ukiran khas Jepara. Bisa custom logo perusahaan.",
    impactBadge: "Sustainable Forestry",
    impactStory: "Pengrajin Jepara yang menggunakan kayu jati daur ulang dari furnitur bekas. Program Sustainable Sourcing memastikan keberlanjutan bahan baku.",
    communityBackground: "Kampung ukir Jepara yang berevolusi dari furnitur besar ke produk lifestyle modern dengan bahan berkelanjutan.",
    certifications: ["Export Ready", "FSC Certified"],
    metrics: { jobsCreated: 35, womenWorkers: 8, revenueGenerated: "Rp 700 juta", householdsSupported: 35 },
  },
  {
    id: "prd-6", name: "Natural Soap Gift Set", supplierId: "sup-6", programId: "prg-3",
    category: "Eco Product", img: productEco, price: "Rp 65.000 - 100.000",
    moq: "100 unit", capacity: "1500 unit/bulan", leadTime: "7-10 hari",
    description: "Set sabun herbal alami dari minyak kelapa, sereh, dan kunyit. Packaging ramah lingkungan.",
    impactBadge: "Green Economy",
    impactStory: "Kelompok ibu-ibu di Yogyakarta yang dulu bergantung pada pertanian subsisten, kini memproduksi sabun herbal premium untuk pasar korporat.",
    communityBackground: "Komunitas perempuan di pinggiran Yogyakarta yang bertransformasi menjadi produsen skincare alami.",
    certifications: ["BPOM", "Halal", "Organic"],
    metrics: { jobsCreated: 22, womenWorkers: 18, revenueGenerated: "Rp 320 juta", householdsSupported: 22 },
  },
  {
    id: "prd-7", name: "Tenun Ikat Flores Scarf", supplierId: "sup-7", programId: "prg-4",
    category: "Corporate Gift", img: productGift, price: "Rp 250.000 - 500.000",
    moq: "25 unit", capacity: "200 unit/bulan", leadTime: "30-45 hari",
    description: "Scarf tenun ikat tradisional Flores dengan pewarna alami. Setiap motif memiliki makna budaya.",
    impactBadge: "Cultural Heritage",
    impactStory: "Mama-mama penenun di Ende yang melestarikan teknik tenun ikat warisan UNESCO. Program ini memberikan akses ke pasar internasional.",
    communityBackground: "Kampung tenun di kaki Gunung Kelimutu yang mempertahankan tradisi tenun ikat selama ratusan tahun.",
    certifications: ["UNESCO Heritage"],
    metrics: { jobsCreated: 40, womenWorkers: 38, revenueGenerated: "Rp 280 juta", householdsSupported: 40 },
  },
  {
    id: "prd-8", name: "Bamboo Stationery Set", supplierId: "sup-8", programId: "prg-5",
    category: "Eco Product", img: productEco, price: "Rp 45.000 - 80.000",
    moq: "200 unit", capacity: "600 unit/bulan", leadTime: "10-14 hari",
    description: "Set alat tulis kantor dari bambu — pen holder, ruler, dan business card holder.",
    impactBadge: "Green Innovation",
    impactStory: "Startup anak muda yang mengajak pengrajin bambu tradisional untuk membuat produk modern. Belum sepenuhnya terverifikasi.",
    communityBackground: "Komunitas petani bambu di Purwokerto yang mendiversifikasi pendapatan melalui kerajinan bambu.",
    certifications: [],
    metrics: { jobsCreated: 15, womenWorkers: 6, revenueGenerated: "Rp 180 juta", householdsSupported: 15 },
  },
];

// === HELPER FUNCTIONS ===
export function getSupplier(id: string) { return suppliers.find(s => s.id === id); }
export function getProduct(id: string) { return products.find(p => p.id === id); }
export function getProgram(id: string) { return programs.find(p => p.id === id); }
export function getOrganization(id: string) { return organizations.find(o => o.id === id); }
export function getSuppliersByProgram(programId: string) { return suppliers.filter(s => s.programId === programId); }
export function getProductsBySupplier(supplierId: string) { return products.filter(p => p.supplierId === supplierId); }
export function getProductsByProgram(programId: string) { return products.filter(p => p.programId === programId); }
export function getProgramByOrg(orgId: string) { return programs.filter(p => p.organizationId === orgId); }

// === AGGREGATE METRICS ===
export const aggregateMetrics = {
  totalUMKM: suppliers.length,
  totalPrograms: programs.length,
  totalProducts: products.length,
  totalBuyers: 35,
  totalTransactions: "Rp 3.2B",
  jobsCreated: products.reduce((sum, p) => sum + p.metrics.jobsCreated, 0),
  womenWorkers: products.reduce((sum, p) => sum + p.metrics.womenWorkers, 0),
  householdsSupported: products.reduce((sum, p) => sum + p.metrics.householdsSupported, 0),
  revenueGenerated: "Rp 3.2 Miliar",
};

export const productCategories = ["All", "Corporate Gift", "Specialty Food", "Eco Product"];
export const certificationTypes = ["Halal", "BPOM", "Organic", "Export Ready", "Fair Trade", "FSC Certified", "UNESCO Heritage"];
export const impactTypes = ["Women Empowerment", "Sustainable Agriculture", "Circular Economy", "Green Economy", "Cultural Heritage", "Sustainable Forestry", "Green Innovation"];
