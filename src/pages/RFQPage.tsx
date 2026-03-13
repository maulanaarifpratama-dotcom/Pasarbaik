import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

const RFQPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("RFQ berhasil dikirim!");
  };

  if (submitted) {
    return (
      <main className="pt-16 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <CheckCircle className="mx-auto mb-4 text-primary" size={64} />
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">RFQ Terkirim!</h2>
          <p className="text-muted-foreground mb-6">Tim PasarBaik akan menghubungi Anda dalam 1-2 hari kerja dengan rekomendasi supplier terbaik.</p>
          <Button onClick={() => setSubmitted(false)}>Kirim RFQ Lain</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-16">
      <section className="bg-primary py-14">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Request for Quotation</h1>
          <p className="text-primary-foreground/70">Sampaikan kebutuhan procurement Anda, kami carikan supplier UMKM terbaik.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl border border-border shadow-sm">
          <h2 className="font-display text-xl font-semibold text-card-foreground">Informasi Perusahaan</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" required placeholder="PT Example Indonesia" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Person</Label>
              <Input id="contact" required placeholder="Nama lengkap" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required placeholder="email@company.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" type="tel" required placeholder="+62 812 3456 7890" />
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="font-display text-xl font-semibold text-card-foreground mb-4">Detail Kebutuhan</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Product Category</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori produk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporate-gift">Corporate Gift</SelectItem>
                    <SelectItem value="food">Food Product</SelectItem>
                    <SelectItem value="craft">Craft</SelectItem>
                    <SelectItem value="custom">Custom Product</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="qty">Quantity</Label>
                  <Input id="qty" type="number" required placeholder="2000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Target Price (per unit)</Label>
                  <Input id="price" placeholder="Rp 150.000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input id="deadline" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Delivery Location</Label>
                  <Input id="location" required placeholder="Jakarta" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea id="notes" placeholder="Jelaskan detail kebutuhan Anda..." rows={4} />
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full">
            Submit RFQ
          </Button>
        </form>
      </section>
    </main>
  );
};

export default RFQPage;
