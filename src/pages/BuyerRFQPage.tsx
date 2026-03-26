import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Inbox,
  MessageSquare,
  CheckCircle,
  XCircle,
  Send,
  Package,
  Clock,
  Building2,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: "Menunggu", color: "bg-blue-100 text-blue-800" },
  viewed: { label: "Dilihat", color: "bg-slate-100 text-slate-800" },
  replied: { label: "Dibalas", color: "bg-indigo-100 text-indigo-800" },
  quoted: { label: "Penawaran Masuk", color: "bg-amber-100 text-amber-800" },
  negotiating: { label: "Negosiasi", color: "bg-purple-100 text-purple-800" },
  accepted: { label: "Diterima", color: "bg-green-100 text-green-800" },
  rejected: { label: "Ditolak", color: "bg-red-100 text-red-800" },
  order_created: { label: "Order Dibuat", color: "bg-emerald-100 text-emerald-800" },
  archived: { label: "Arsip", color: "bg-gray-100 text-gray-600" },
};

export default function BuyerRFQPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRfqId, setSelectedRfqId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["buyer-rfq", token],
    queryFn: async () => {
      const res = await supabase.functions.invoke("buyer-rfq", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: undefined,
      });
      // Use fetch directly since invoke doesn't support GET params well
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/buyer-rfq?token=${token}`;
      const response = await fetch(url, {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      if (!response.ok) throw new Error("Failed to load RFQ data");
      return response.json();
    },
    enabled: !!token,
  });

  const rfqs = data?.rfqs || [];
  const quotes = data?.quotes || [];
  const messages = data?.messages || [];
  const orders = data?.orders || [];

  const selectedRfq = rfqs.find((r: any) => r.id === selectedRfqId);
  const rfqMessages = messages.filter((m: any) => m.rfq_id === selectedRfqId);
  const rfqQuotes = selectedRfqId
    ? quotes.filter((q: any) => q.rfq_id === selectedRfqId)
    : quotes;

  const doAction = async (action: string, extraBody: any = {}) => {
    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/buyer-rfq`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ action, token, ...extraBody }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Action failed");
    }
    return res.json();
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedRfqId) return;
    setSendingMessage(true);
    try {
      await doAction("send_message", { rfq_id: selectedRfqId, message: message.trim() });
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["buyer-rfq", token] });
      toast.success("Pesan terkirim");
    } catch (err: any) {
      toast.error(err.message);
    }
    setSendingMessage(false);
  };

  const handleAcceptQuote = async (quoteId: string) => {
    try {
      await doAction("accept_quote", { quote_id: quoteId });
      queryClient.invalidateQueries({ queryKey: ["buyer-rfq", token] });
      toast.success("Penawaran diterima! Order telah dibuat.");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleRejectQuote = async (quoteId: string) => {
    try {
      await doAction("reject_quote", { quote_id: quoteId });
      queryClient.invalidateQueries({ queryKey: ["buyer-rfq", token] });
      toast.success("Penawaran ditolak");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (!token) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen flex items-center justify-center bg-background">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <Inbox className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Token Diperlukan</h2>
              <p className="text-muted-foreground text-sm">
                Gunakan link tracking yang diberikan saat Anda mengirim RFQ untuk
                mengakses halaman ini.
              </p>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Memuat data RFQ...</p>
        </main>
      </>
    );
  }

  if (error || rfqs.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen flex items-center justify-center bg-background">
          <Card className="max-w-md w-full">
            <CardContent className="p-8 text-center">
              <XCircle className="h-12 w-12 mx-auto text-destructive/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Link Tidak Valid</h2>
              <p className="text-muted-foreground text-sm">
                Link tracking ini tidak valid atau sudah kedaluwarsa.
              </p>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }

  const firstRfq = rfqs[0];

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-background">
        <section className="bg-primary py-8">
          <div className="container mx-auto px-4">
            <h1 className="font-display text-2xl font-bold text-primary-foreground">
              RFQ Tracking — {firstRfq.company}
            </h1>
            <p className="text-primary-foreground/60 mt-1 text-sm">
              {rfqs.length} RFQ dikirim • {quotes.length} penawaran masuk • {orders.length} order
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="quotes">
                Penawaran ({quotes.length})
              </TabsTrigger>
              <TabsTrigger value="compare">Bandingkan</TabsTrigger>
              <TabsTrigger value="messages">Percakapan</TabsTrigger>
              {orders.length > 0 && (
                <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
              )}
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {rfqs.map((rfq: any) => {
                  const cfg = STATUS_CONFIG[rfq.status] || STATUS_CONFIG.new;
                  const supplierName = rfq.suppliers?.name || "Semua Supplier";
                  const rfqQuoteCount = quotes.filter(
                    (q: any) => q.rfq_id === rfq.id
                  ).length;

                  return (
                    <Card
                      key={rfq.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedRfqId === rfq.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => {
                        setSelectedRfqId(rfq.id);
                        if (rfqQuoteCount > 0) setActiveTab("quotes");
                      }}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold text-sm">
                              {supplierName}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}
                          >
                            {cfg.label}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {rfq.category || "—"} • {rfq.quantity || "—"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(rfq.created_at), "dd MMM yyyy")}
                          </div>
                        </div>
                        {rfqQuoteCount > 0 && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <span className="text-xs font-medium text-amber-700">
                              {rfqQuoteCount} penawaran masuk
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Quotes */}
            <TabsContent value="quotes">
              <div className="space-y-4 mt-4">
                {rfqQuotes.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Clock className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">
                        Belum ada penawaran dari supplier. Silakan tunggu.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  rfqQuotes.map((q: any) => (
                    <Card key={q.id}>
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="font-semibold">
                                {q.suppliers?.name || "Supplier"}
                              </span>
                            </div>
                            <p className="text-2xl font-bold text-primary">
                              {q.price}
                            </p>
                          </div>
                          <Badge
                            variant={
                              q.status === "accepted"
                                ? "default"
                                : q.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {q.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3 text-sm text-muted-foreground">
                          {q.moq && <div>MOQ: {q.moq}</div>}
                          {q.lead_time && <div>Lead time: {q.lead_time}</div>}
                        </div>
                        {q.notes && (
                          <p className="text-sm text-muted-foreground mt-2 bg-muted p-3 rounded">
                            {q.notes}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(q.created_at), "dd MMM yyyy, HH:mm")}
                        </p>
                        {q.status === "sent" && (
                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAcceptQuote(q.id);
                              }}
                              className="gap-1"
                            >
                              <CheckCircle className="h-4 w-4" /> Terima
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRejectQuote(q.id);
                              }}
                              className="gap-1"
                            >
                              <XCircle className="h-4 w-4" /> Tolak
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* Compare */}
            <TabsContent value="compare">
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">Bandingkan Penawaran</CardTitle>
                </CardHeader>
                <CardContent>
                  {quotes.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Belum ada penawaran untuk dibandingkan
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Supplier</TableHead>
                            <TableHead>Harga</TableHead>
                            <TableHead>MOQ</TableHead>
                            <TableHead>Lead Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quotes.map((q: any) => (
                            <TableRow key={q.id}>
                              <TableCell className="font-medium">
                                {q.suppliers?.name || "—"}
                              </TableCell>
                              <TableCell className="font-bold text-primary">
                                {q.price}
                              </TableCell>
                              <TableCell>{q.moq || "—"}</TableCell>
                              <TableCell>{q.lead_time || "—"}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    q.status === "accepted"
                                      ? "default"
                                      : q.status === "rejected"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {q.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {format(new Date(q.created_at), "dd MMM yyyy")}
                              </TableCell>
                              <TableCell className="text-right">
                                {q.status === "sent" && (
                                  <div className="flex gap-1 justify-end">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleAcceptQuote(q.id)}
                                    >
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleRejectQuote(q.id)}
                                    >
                                      <XCircle className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages */}
            <TabsContent value="messages">
              <div className="mt-4 space-y-4">
                {!selectedRfqId ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">
                        Pilih RFQ di tab Overview untuk memulai percakapan
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Percakapan dengan{" "}
                        {selectedRfq?.suppliers?.name || "Supplier"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                        {rfqMessages.length === 0 ? (
                          <p className="text-center text-muted-foreground py-6">
                            Belum ada pesan
                          </p>
                        ) : (
                          rfqMessages.map((msg: any) => (
                            <div
                              key={msg.id}
                              className={`flex ${
                                msg.sender_type === "buyer"
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg p-3 ${
                                  msg.sender_type === "buyer"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                <p className="text-sm">{msg.message}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {format(
                                    new Date(msg.created_at),
                                    "dd MMM, HH:mm"
                                  )}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <Separator className="mb-4" />
                      <div className="flex gap-2">
                        <Textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tulis pesan..."
                          rows={2}
                          className="flex-1"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!message.trim() || sendingMessage}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders">
              <div className="space-y-4 mt-4">
                {orders.map((order: any) => (
                  <Card key={order.id}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-lg">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <Badge>{order.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Harga:</span>{" "}
                          <strong>{order.agreed_price}</strong>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>{" "}
                          <strong>{order.quantity || "—"}</strong>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Lead Time:</span>{" "}
                          <strong>{order.lead_time || "—"}</strong>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Dibuat:</span>{" "}
                          <strong>
                            {format(new Date(order.created_at), "dd MMM yyyy")}
                          </strong>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
