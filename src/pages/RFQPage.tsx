import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function RFQPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);

    const company = (fd.get("company") as string).trim();
    const contact_person = (fd.get("contact") as string).trim();
    const email = (fd.get("email") as string).trim();
    const phone = (fd.get("phone") as string)?.trim() || null;
    const category = (fd.get("category") as string) || null;
    const quantity = (fd.get("quantity") as string)?.trim() || null;
    const target_price = (fd.get("price") as string)?.trim() || null;
    const deadlineVal = fd.get("deadline") as string;
    const deadline = deadlineVal || null;
    const location = (fd.get("location") as string)?.trim() || null;
    const notes = (fd.get("notes") as string)?.trim() || null;

    if (!company || !contact_person || !email) {
      toast.error("Mohon lengkapi data wajib");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("rfq_requests" as any).insert({
      company,
      contact_person,
      email,
      phone,
      category,
      quantity,
      target_price,
      deadline,
      location,
      notes,
    } as any);

    if (error) {
      toast.error("Gagal mengirim RFQ: " + error.message);
    } else {
      toast.success("RFQ berhasil dikirim! Kami akan menghubungi Anda segera.");
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  };

  return (
    <main className="pt-16">
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-primary-foreground">Request for Quotation</h1>
          <p className="text-primary-foreground/60 mt-2">Submit your procurement needs for impact products</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-card rounded-xl border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">Submit RFQ</h2>
              <p className="text-sm text-muted-foreground">Fill in your requirements below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company Name *</Label>
                <Input name="company" required placeholder="PT Example Indonesia" maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label>Contact Person *</Label>
                <Input name="contact" required placeholder="Your name" maxLength={100} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input name="email" type="email" required placeholder="email@company.com" maxLength={255} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input name="phone" placeholder="+62 812 3456 7890" maxLength={30} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Category</Label>
                <select name="category" className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground">
                  <option value="">Select category</option>
                  <option value="Textiles">Textiles</option>
                  <option value="Food & Beverage">Food & Beverage</option>
                  <option value="Eco Products">Eco Products</option>
                  <option value="Crafts">Crafts</option>
                  <option value="Corporate Gifts">Corporate Gifts</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input name="quantity" placeholder="e.g. 500 pcs" maxLength={100} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Target Price</Label>
                <Input name="price" placeholder="e.g. IDR 100,000/pcs" maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Input name="deadline" type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Delivery Location</Label>
              <Input name="location" placeholder="City, Province" maxLength={200} />
            </div>
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea name="notes" placeholder="Describe your requirements..." rows={4} maxLength={2000} />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Submitting..." : "Submit RFQ"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default RFQPage;
