import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const { rfq } = await req.json()

    if (!rfq || !rfq.company || !rfq.email) {
      return new Response(JSON.stringify({ error: 'Invalid RFQ data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get admin emails from user_roles + profiles
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: adminRoles } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')

    if (!adminRoles?.length) {
      console.warn('No admin users found to notify')
      return new Response(JSON.stringify({ success: true, message: 'No admins to notify' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const adminUserIds = adminRoles.map((r) => r.user_id)
    const { data: profiles } = await supabase
      .from('profiles')
      .select('email')
      .in('user_id', adminUserIds)

    const adminEmails = profiles?.map((p) => p.email).filter(Boolean) || []

    if (!adminEmails.length) {
      console.warn('No admin emails found in profiles')
      return new Response(JSON.stringify({ success: true, message: 'No admin emails found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Build email HTML
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f5; padding: 32px;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e4e4e7;">
    <div style="background: #16a34a; padding: 24px 32px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 20px;">📬 New RFQ Request</h1>
      <p style="color: #bbf7d0; margin: 4px 0 0; font-size: 14px;">PasarBaik Marketplace</p>
    </div>
    <div style="padding: 32px;">
      <p style="color: #3f3f46; margin: 0 0 16px; font-size: 15px;">A new Request for Quotation has been submitted:</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f4f4f5;">
          <td style="padding: 10px 0; color: #71717a; width: 140px;">Company</td>
          <td style="padding: 10px 0; color: #18181b; font-weight: 600;">${escapeHtml(rfq.company)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f4f4f5;">
          <td style="padding: 10px 0; color: #71717a;">Contact Person</td>
          <td style="padding: 10px 0; color: #18181b; font-weight: 600;">${escapeHtml(rfq.contact_person)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f4f4f5;">
          <td style="padding: 10px 0; color: #71717a;">Email</td>
          <td style="padding: 10px 0; color: #18181b;">${escapeHtml(rfq.email)}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f4f4f5;">
          <td style="padding: 10px 0; color: #71717a;">Phone</td>
          <td style="padding: 10px 0; color: #18181b;">${escapeHtml(rfq.phone || '-')}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f4f4f5;">
          <td style="padding: 10px 0; color: #71717a;">Category</td>
          <td style="padding: 10px 0; color: #18181b;">${escapeHtml(rfq.category || '-')}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f4f4f5;">
          <td style="padding: 10px 0; color: #71717a;">Quantity</td>
          <td style="padding: 10px 0; color: #18181b;">${escapeHtml(rfq.quantity || '-')}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f4f4f5;">
          <td style="padding: 10px 0; color: #71717a;">Target Price</td>
          <td style="padding: 10px 0; color: #18181b;">${escapeHtml(rfq.target_price || '-')}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f4f4f5;">
          <td style="padding: 10px 0; color: #71717a;">Deadline</td>
          <td style="padding: 10px 0; color: #18181b;">${escapeHtml(rfq.deadline || '-')}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f4f4f5;">
          <td style="padding: 10px 0; color: #71717a;">Location</td>
          <td style="padding: 10px 0; color: #18181b;">${escapeHtml(rfq.location || '-')}</td>
        </tr>
        ${rfq.notes ? `
        <tr>
          <td style="padding: 10px 0; color: #71717a; vertical-align: top;">Notes</td>
          <td style="padding: 10px 0; color: #18181b;">${escapeHtml(rfq.notes)}</td>
        </tr>` : ''}
      </table>
      <div style="margin-top: 24px; text-align: center;">
        <a href="https://pasarbaik.lovable.app/admin" style="display: inline-block; background: #16a34a; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600;">View in Admin Panel</a>
      </div>
    </div>
    <div style="padding: 16px 32px; background: #f4f4f5; text-align: center;">
      <p style="color: #a1a1aa; font-size: 12px; margin: 0;">PasarBaik — Impact Marketplace Platform</p>
    </div>
  </div>
</body>
</html>`

    const messageId = `rfq-notify-${crypto.randomUUID()}`

    // Enqueue emails for each admin
    for (const adminEmail of adminEmails) {
      await supabase.rpc('enqueue_email', {
        queue_name: 'transactional_emails',
        payload: {
          message_id: `${messageId}-${adminEmail}`,
          to: adminEmail,
          from: 'PasarBaik <noreply@notify.pasarbaik.com>',
          sender_domain: 'notify.pasarbaik.com',
          subject: `[RFQ] New request from ${rfq.company}`,
          html,
          text: `New RFQ from ${rfq.company} (${rfq.contact_person}). Category: ${rfq.category || '-'}. Email: ${rfq.email}`,
          purpose: 'transactional',
          label: 'rfq-notification',
          queued_at: new Date().toISOString(),
        },
      })
    }

    console.log(`RFQ notification enqueued for ${adminEmails.length} admin(s)`)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in notify-rfq:', error)
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
