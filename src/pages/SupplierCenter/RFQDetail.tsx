import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ArrowLeft,
  Send,
  FileText,
  Clock,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Tag,
  Package,
  DollarSign,
} from "lucide-react";
import { Link } from "react-router-dom";

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  viewed: "Viewed",
  replied: "Replied",
  quoted: "Quoted",
  negotiating: "Negotiating",
  accepted: "Accepted",
  rejected: "Rejected",
  order_created: "Order Created",
  archived: "Archived",
};

export default function RFQDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "detail";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch RFQ
  const { data: rfq, isLoading } = useQuery({
    queryKey: ["rfq-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rfq_requests")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Auto-mark as viewed
  useEffect(() => {
    if (rfq && rfq.status === "new" && id) {
      supabase
        .from("rfq_requests")
        .update({ status: "viewed" } as any)
        .eq("id", id)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["rfq-detail", id] });
          queryClient.invalidateQueries({ queryKey: ["supplier-rfqs"] });
        });

      supabase.from("rfq_activity_log" as any).insert({
        rfq_id: id,
        action: "RFQ viewed",
        actor_type: "supplier",
        actor_user_id: user?.id,
      } as any);
    }
  }, [rfq?.status, id]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  if (!rfq) {
    return <div className="p-8 text-center text-muted-foreground">RFQ not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/supplier-center/rfq">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">RFQ from {rfq.company}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge>{STATUS_LABELS[rfq.status] || rfq.status}</Badge>
            <span className="text-sm text-muted-foreground">
              Submitted {format(new Date(rfq.created_at), "dd MMM yyyy, HH:mm")}
            </span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="detail">RFQ Detail</TabsTrigger>
          <TabsTrigger value="conversation">Conversation</TabsTrigger>
          <TabsTrigger value="quotation">Quotation</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="detail">
          <RFQDetailTab rfq={rfq} />
        </TabsContent>
        <TabsContent value="conversation">
          <ConversationTab rfqId={rfq.id} userId={user?.id} />
        </TabsContent>
        <TabsContent value="quotation">
          <QuotationTab rfqId={rfq.id} userId={user?.id} />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityLogTab rfqId={rfq.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RFQDetailTab({ rfq }: { rfq: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Buyer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow icon={Building2} label="Company" value={rfq.company} />
          <InfoRow icon={User} label="Contact Person" value={rfq.contact_person} />
          <InfoRow icon={Mail} label="Email" value={rfq.email} />
          <InfoRow icon={Phone} label="Phone" value={rfq.phone || "—"} />
          <InfoRow icon={MapPin} label="Location" value={rfq.location || "—"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <InfoRow icon={Tag} label="Category" value={rfq.category || "—"} />
          <InfoRow icon={Package} label="Quantity" value={rfq.quantity || "—"} />
          <InfoRow icon={DollarSign} label="Target Price" value={rfq.target_price || "—"} />
          <InfoRow icon={Calendar} label="Deadline" value={rfq.deadline ? format(new Date(rfq.deadline), "dd MMM yyyy") : "—"} />
        </CardContent>
      </Card>

      {rfq.notes && (
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{rfq.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function ConversationTab({ rfqId, userId }: { rfqId: string; userId?: string }) {
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ["rfq-messages", rfqId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rfq_messages" as any)
        .select("*")
        .eq("rfq_id", rfqId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const sendMessage = useMutation({
    mutationFn: async () => {
      if (!message.trim()) return;
      const { error } = await supabase.from("rfq_messages" as any).insert({
        rfq_id: rfqId,
        sender_type: "supplier",
        sender_user_id: userId,
        message: message.trim(),
      } as any);
      if (error) throw error;

      // Update rfq status to replied
      await supabase
        .from("rfq_requests")
        .update({ status: "replied", last_message_at: new Date().toISOString() } as any)
        .eq("id", rfqId);

      await supabase.from("rfq_activity_log" as any).insert({
        rfq_id: rfqId,
        action: "Supplier sent a message",
        actor_type: "supplier",
        actor_user_id: userId,
      } as any);
    },
    onSuccess: () => {
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["rfq-messages", rfqId] });
      queryClient.invalidateQueries({ queryKey: ["rfq-detail", rfqId] });
      toast.success("Message sent");
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No messages yet. Start the conversation.</p>
          ) : (
            messages.map((msg: any) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_type === "supplier" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender_type === "supplier"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {format(new Date(msg.created_at), "dd MMM, HH:mm")}
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
            placeholder="Type your message..."
            rows={2}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage.mutate();
              }
            }}
          />
          <Button onClick={() => sendMessage.mutate()} disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function QuotationTab({ rfqId, userId }: { rfqId: string; userId?: string }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ price: "", moq: "", lead_time: "", notes: "" });

  // Get supplier for current user
  const { data: supplier } = useQuery({
    queryKey: ["my-supplier-for-quote", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from("suppliers")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      return data;
    },
    enabled: !!userId,
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ["rfq-quotes", rfqId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rfq_quotes" as any)
        .select("*")
        .eq("rfq_id", rfqId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const sendQuote = useMutation({
    mutationFn: async () => {
      if (!form.price.trim() || !supplier?.id) {
        throw new Error("Price is required and you must be linked to a supplier");
      }
      const quoteId = crypto.randomUUID();
      const { error } = await supabase.from("rfq_quotes" as any).insert({
        id: quoteId,
        rfq_id: rfqId,
        supplier_id: supplier.id,
        price: form.price,
        moq: form.moq || null,
        lead_time: form.lead_time || null,
        notes: form.notes || null,
      } as any);
      if (error) throw error;

      await supabase
        .from("rfq_requests")
        .update({ status: "quoted", quotation_price: form.price, quotation_status: "sent" } as any)
        .eq("id", rfqId);

      await supabase.from("rfq_activity_log" as any).insert({
        rfq_id: rfqId,
        action: `Quote sent: ${form.price}`,
        actor_type: "supplier",
        actor_user_id: userId,
      } as any);

      // Send email notification to buyer
      try {
        const { data: rfq } = await supabase
          .from("rfq_requests")
          .select("email, contact_person, buyer_access_token")
          .eq("id", rfqId)
          .single();
        const { data: sup } = await supabase
          .from("suppliers")
          .select("name")
          .eq("id", supplier.id)
          .single();

        if (rfq?.email) {
          const trackingUrl = rfq.buyer_access_token
            ? `${window.location.origin}/my-rfq?token=${rfq.buyer_access_token}`
            : undefined;

          await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "new-quotation",
              recipientEmail: rfq.email,
              idempotencyKey: `new-quote-${quoteId}`,
              templateData: {
                buyerName: rfq.contact_person || undefined,
                supplierName: sup?.name || undefined,
                price: form.price,
                moq: form.moq || undefined,
                leadTime: form.lead_time || undefined,
                notes: form.notes || undefined,
                trackingUrl,
              },
            },
          });
        }
      } catch (emailErr) {
        console.error("Failed to send quotation email notification:", emailErr);
      }
    },
    onSuccess: () => {
      setForm({ price: "", moq: "", lead_time: "", notes: "" });
      queryClient.invalidateQueries({ queryKey: ["rfq-quotes", rfqId] });
      queryClient.invalidateQueries({ queryKey: ["rfq-detail", rfqId] });
      toast.success("Quotation sent successfully");
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" /> Send Quotation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Price *</Label>
            <Input
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="e.g. IDR 85,000/pcs"
            />
          </div>
          <div className="space-y-2">
            <Label>Minimum Order Quantity</Label>
            <Input
              value={form.moq}
              onChange={(e) => setForm({ ...form, moq: e.target.value })}
              placeholder="e.g. 100 pcs"
            />
          </div>
          <div className="space-y-2">
            <Label>Lead Time</Label>
            <Input
              value={form.lead_time}
              onChange={(e) => setForm({ ...form, lead_time: e.target.value })}
              placeholder="e.g. 14 working days"
            />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Additional notes..."
              rows={3}
            />
          </div>
          <Button onClick={() => sendQuote.mutate()} disabled={!form.price.trim()} className="w-full">
            Send Quotation
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sent Quotations</CardTitle>
        </CardHeader>
        <CardContent>
          {quotes.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No quotations sent yet</p>
          ) : (
            <div className="space-y-4">
              {quotes.map((q: any) => (
                <div key={q.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">{q.price}</span>
                    <Badge variant={q.status === "accepted" ? "default" : q.status === "rejected" ? "destructive" : "secondary"}>
                      {q.status}
                    </Badge>
                  </div>
                  {q.moq && <p className="text-sm text-muted-foreground">MOQ: {q.moq}</p>}
                  {q.lead_time && <p className="text-sm text-muted-foreground">Lead time: {q.lead_time}</p>}
                  {q.notes && <p className="text-sm text-muted-foreground">{q.notes}</p>}
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(q.created_at), "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityLogTab({ rfqId }: { rfqId: string }) {
  const { data: logs = [] } = useQuery({
    queryKey: ["rfq-activity", rfqId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rfq_activity_log" as any)
        .select("*")
        .eq("rfq_id", rfqId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        {logs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No activity yet</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log: any) => (
              <div key={log.id} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div>
                  <p className="text-sm font-medium">{log.action}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.actor_type} • {format(new Date(log.created_at), "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
