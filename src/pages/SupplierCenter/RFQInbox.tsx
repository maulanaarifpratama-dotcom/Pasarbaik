import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  Eye,
  MessageSquare,
  FileText,
  HelpCircle,
  XCircle,
  Archive,
  Search,
  Inbox,
} from "lucide-react";
import { format } from "date-fns";

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  new: { label: "New", variant: "default" },
  viewed: { label: "Viewed", variant: "secondary" },
  replied: { label: "Replied", variant: "outline" },
  quoted: { label: "Quoted", variant: "outline" },
  negotiating: { label: "Negotiating", variant: "outline" },
  accepted: { label: "Accepted", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
  order_created: { label: "Order Created", variant: "default" },
  archived: { label: "Archived", variant: "secondary" },
};

export default function RFQInbox() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  // Get supplier linked to current user
  const { data: supplier } = useQuery({
    queryKey: ["my-supplier", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("suppliers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: rfqs = [], isLoading } = useQuery({
    queryKey: ["supplier-rfqs", supplier?.id, statusFilter, search],
    queryFn: async () => {
      let query = supabase
        .from("rfq_requests")
        .select("*")
        .order("created_at", { ascending: false });

      // If user is a supplier (not admin), filter by supplier_id
      if (supplier?.id) {
        query = query.eq("supplier_id", supplier.id);
      }

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (search.trim()) {
        query = query.or(`company.ilike.%${search}%,contact_person.ilike.%${search}%,email.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("rfq_requests")
        .update({ status } as any)
        .eq("id", id);
      if (error) throw error;

      // Log activity
      await supabase.from("rfq_activity_log" as any).insert({
        rfq_id: id,
        action: `Status changed to ${status}`,
        actor_type: "supplier",
        actor_user_id: user?.id,
      } as any);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-rfqs"] });
      toast.success("Status updated");
    },
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">RFQ Inbox</h1>
        <p className="text-muted-foreground">Manage incoming requests for quotation</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by company, contact, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="quoted">Quoted</SelectItem>
            <SelectItem value="negotiating">Negotiating</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading...</div>
        ) : rfqs.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No RFQ requests found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfqs.map((rfq: any) => {
                const cfg = STATUS_CONFIG[rfq.status] || STATUS_CONFIG.new;
                return (
                  <TableRow key={rfq.id}>
                    <TableCell className="font-medium">{rfq.company}</TableCell>
                    <TableCell>
                      <div>{rfq.contact_person}</div>
                      <div className="text-xs text-muted-foreground">{rfq.email}</div>
                    </TableCell>
                    <TableCell>{rfq.category || "—"}</TableCell>
                    <TableCell>{rfq.quantity || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(rfq.created_at), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild title="View Detail">
                          <Link to={`/supplier-center/rfq/${rfq.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {rfq.status === "new" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Mark as Read"
                            onClick={() => updateStatus.mutate({ id: rfq.id, status: "viewed" })}
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" asChild title="Reply">
                          <Link to={`/supplier-center/rfq/${rfq.id}?tab=conversation`}>
                            <MessageSquare className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild title="Send Quote">
                          <Link to={`/supplier-center/rfq/${rfq.id}?tab=quotation`}>
                            <FileText className="h-4 w-4" />
                          </Link>
                        </Button>
                        {!["rejected", "archived"].includes(rfq.status) && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Reject"
                            onClick={() => updateStatus.mutate({ id: rfq.id, status: "rejected" })}
                          >
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                        {rfq.status !== "archived" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Archive"
                            onClick={() => updateStatus.mutate({ id: rfq.id, status: "archived" })}
                          >
                            <Archive className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
