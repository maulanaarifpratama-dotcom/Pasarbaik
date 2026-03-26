import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const url = new URL(req.url);

    // GET: fetch buyer RFQs by access token
    if (req.method === "GET") {
      const token = url.searchParams.get("token");
      if (!token) {
        return new Response(JSON.stringify({ error: "Token required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Get all RFQs with this access token (grouped by session)
      const { data: rfqSample } = await supabase
        .from("rfq_requests")
        .select("buyer_session_id")
        .eq("buyer_access_token", token)
        .limit(1)
        .single();

      if (!rfqSample) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const sessionId = rfqSample.buyer_session_id;

      // Fetch all RFQs in this session
      const { data: rfqs } = await supabase
        .from("rfq_requests")
        .select("*, suppliers(id, name, logo, location)")
        .eq("buyer_session_id", sessionId)
        .order("created_at", { ascending: false });

      // Fetch quotes for these RFQs
      const rfqIds = (rfqs || []).map((r: any) => r.id);
      let quotes: any[] = [];
      if (rfqIds.length > 0) {
        const { data } = await supabase
          .from("rfq_quotes")
          .select("*, suppliers(id, name, logo)")
          .in("rfq_id", rfqIds)
          .order("created_at", { ascending: false });
        quotes = data || [];
      }

      // Fetch messages
      let messages: any[] = [];
      if (rfqIds.length > 0) {
        const { data } = await supabase
          .from("rfq_messages")
          .select("*")
          .in("rfq_id", rfqIds)
          .order("created_at", { ascending: true });
        messages = data || [];
      }

      // Fetch orders
      let orders: any[] = [];
      if (rfqIds.length > 0) {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .in("rfq_id", rfqIds);
        orders = data || [];
      }

      return new Response(
        JSON.stringify({ rfqs, quotes, messages, orders, sessionId }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // POST: buyer actions (send message, accept quote, reject quote)
    if (req.method === "POST") {
      const body = await req.json();
      const { action, token } = body;

      if (!token) {
        return new Response(JSON.stringify({ error: "Token required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify token
      const { data: rfqCheck } = await supabase
        .from("rfq_requests")
        .select("buyer_session_id")
        .eq("buyer_access_token", token)
        .limit(1)
        .single();

      if (!rfqCheck) {
        return new Response(JSON.stringify({ error: "Invalid token" }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const sessionId = rfqCheck.buyer_session_id;

      if (action === "send_message") {
        const { rfq_id, message } = body;
        // Verify rfq belongs to this session
        const { data: rfq } = await supabase
          .from("rfq_requests")
          .select("id")
          .eq("id", rfq_id)
          .eq("buyer_session_id", sessionId)
          .single();

        if (!rfq) {
          return new Response(JSON.stringify({ error: "RFQ not found" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        await supabase.from("rfq_messages").insert({
          rfq_id,
          sender_type: "buyer",
          message: message.trim(),
        });

        await supabase
          .from("rfq_requests")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", rfq_id);

        await supabase.from("rfq_activity_log").insert({
          rfq_id,
          action: "Buyer sent a message",
          actor_type: "buyer",
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "accept_quote") {
        const { quote_id } = body;

        // Get the quote
        const { data: quote } = await supabase
          .from("rfq_quotes")
          .select("*, rfq_requests!inner(id, buyer_session_id, company, contact_person, email, category, quantity)")
          .eq("id", quote_id)
          .single();

        if (!quote || (quote as any).rfq_requests?.buyer_session_id !== sessionId) {
          return new Response(JSON.stringify({ error: "Quote not found" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const rfqData = (quote as any).rfq_requests;

        // Update quote status to accepted
        await supabase
          .from("rfq_quotes")
          .update({ status: "accepted" })
          .eq("id", quote_id);

        // Reject other quotes for this RFQ
        await supabase
          .from("rfq_quotes")
          .update({ status: "rejected" })
          .eq("rfq_id", rfqData.id)
          .neq("id", quote_id);

        // Update RFQ status
        await supabase
          .from("rfq_requests")
          .update({ status: "accepted", quotation_status: "accepted" })
          .eq("id", rfqData.id);

        // Create order
        await supabase.from("orders").insert({
          rfq_id: rfqData.id,
          quote_id: quote_id,
          supplier_id: quote.supplier_id,
          buyer_email: rfqData.email,
          buyer_company: rfqData.company,
          buyer_contact: rfqData.contact_person,
          product_category: rfqData.category,
          quantity: rfqData.quantity,
          agreed_price: quote.price,
          lead_time: quote.lead_time,
          notes: quote.notes,
          status: "confirmed",
        });

        // Log activity
        await supabase.from("rfq_activity_log").insert({
          rfq_id: rfqData.id,
          action: `Buyer accepted quote: ${quote.price}`,
          actor_type: "buyer",
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "reject_quote") {
        const { quote_id } = body;

        const { data: quote } = await supabase
          .from("rfq_quotes")
          .select("*, rfq_requests!inner(id, buyer_session_id)")
          .eq("id", quote_id)
          .single();

        if (!quote || (quote as any).rfq_requests?.buyer_session_id !== sessionId) {
          return new Response(JSON.stringify({ error: "Quote not found" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        await supabase
          .from("rfq_quotes")
          .update({ status: "rejected" })
          .eq("id", quote_id);

        await supabase.from("rfq_activity_log").insert({
          rfq_id: (quote as any).rfq_requests.id,
          action: "Buyer rejected a quote",
          actor_type: "buyer",
        });

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
