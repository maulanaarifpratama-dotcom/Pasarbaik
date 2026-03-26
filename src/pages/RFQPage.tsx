import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Briefcase, Copy, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function RFQPage() {
  const [loading, setLoading] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [submittedToken, setSubmittedToken] = useState<string | null>(null);

  const { data: suppliers = [] } = useQuery({
    queryKey: ["suppliers-for-rfq"],
    queryFn: async () => {
      const { data } = await supabase
        .from("suppliers")
        .select("id, name, location, type, logo")
        .order("name");
      return data || [];
    },
  });

  const toggleSupplier = (id: string) => {
    setSelectedSuppliers((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

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

    // Generate shared session ID and access token
    const sessionId = crypto.randomUUID();
    const accessToken = crypto.randomUUID();

    // If suppliers selected, create one RFQ per supplier
    // If none selected, create one general RFQ
    const suppliersToSend = selectedSuppliers.length > 0 ? selectedSuppliers : [null];

    const rfqRows = suppliersToSend.map((supplierId) => ({
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
      supplier_id: supplierId,
      buyer_session_id: sessionId,
      buyer_access_token: accessToken,
    }));

    const { error } = await supabase.from("rfq_requests").insert(rfqRows as any);

    if (error) {
      toast.error("Gagal mengirim RFQ: " + error.message);
    } else {
      const count = suppliersToSend.filter(Boolean).length;
      toast.success(
        count > 0
          ? `RFQ berhasil dikirim ke ${count} supplier!`
          : "RFQ berhasil dikirim!"
      );
      setSubmittedToken(accessToken);
      setSelectedSuppliers([]);

      // Notify (fire-and-forget)
      supabase.functions
        .invoke("notify-rfq", {
          body: {
            rfq: { company, contact_person, email, phone, category, quantity, target_price, deadline, location, notes },
          },
        })
        .catch((err) => console.warn("RFQ notification failed:", err));
    }
    setLoading(false);
  };

  const trackingUrl = submittedToken
    ? `${window.location.origin}/my-rfq?token=${submittedToken}`
    : null;

  return (
    <main className="pt-16">
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold text-primary-foreground">
            Request for Quotation
          </h1>
          <p className="text-primary-foreground/60 mt-2">
            Submit your procurement needs to one or multiple suppliers
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Success with tracking link */}
        {submittedToken && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              ✅ RFQ Berhasil Dikirim!
            </h3>
            <p className="text-sm text-green-700 mb-3">
              Gunakan link berikut untuk melacak status RFQ dan menerima
              quotation dari supplier:
            </p>
            <div className="flex items-center gap-2">
              <Input value={trackingUrl || ""} readOnly className="bg-white text-sm" />
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(trackingUrl || "");
                  toast.success("Link disalin!");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm" asChild>
                <a href={trackingUrl || ""} target="_blank" rel="noopener">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <Button
              variant="link"
              className="mt-2 p-0 text-green-700"
              onClick={() => setSubmittedToken(null)}
            >
              Kirim RFQ baru
            </Button>
          </div>
        )}

        <div className="bg-card rounded-xl border border-border p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Briefcase className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Submit RFQ
              </h2>
              <p className="text-sm text-muted-foreground">
                Fill in your requirements and select suppliers
              </p>
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
                <select
                  name="category"
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
                >
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

            {/* Supplier Selection */}
            {suppliers.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Select Suppliers ({selectedSuppliers.length} selected)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Choose which suppliers to send your RFQ to. Leave empty to send to all.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto border border-border rounded-lg p-3">
                  {suppliers.map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedSuppliers.includes(s.id)
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <Checkbox
                        checked={selectedSuppliers.includes(s.id)}
                        onCheckedChange={() => toggleSupplier(s.id)}
                      />
                      <div className="flex items-center gap-2 min-w-0">
                        {s.logo ? (
                          <img
                            src={s.logo}
                            alt={s.name}
                            className="w-8 h-8 rounded object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0 text-xs font-bold text-muted-foreground">
                            {s.name.charAt(0)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{s.name}</p>
                          {s.location && (
                            <p className="text-xs text-muted-foreground truncate">
                              {s.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading
                ? "Submitting..."
                : selectedSuppliers.length > 0
                ? `Send RFQ to ${selectedSuppliers.length} Supplier${selectedSuppliers.length > 1 ? "s" : ""}`
                : "Submit RFQ"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default RFQPage;
