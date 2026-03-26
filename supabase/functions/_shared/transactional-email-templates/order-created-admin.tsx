import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "PasarBaik"

interface OrderCreatedAdminProps {
  buyerCompany?: string
  buyerContact?: string
  buyerEmail?: string
  supplierName?: string
  category?: string
  quantity?: string
  agreedPrice?: string
  leadTime?: string
}

const OrderCreatedAdminEmail = ({
  buyerCompany,
  buyerContact,
  buyerEmail,
  supplierName,
  category,
  quantity,
  agreedPrice,
  leadTime,
}: OrderCreatedAdminProps) => (
  <Html lang="id" dir="ltr">
    <Head />
    <Preview>Order baru di {SITE_NAME}: {buyerCompany || 'Buyer'} × {supplierName || 'Supplier'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🎉 Order Baru Dibuat</Heading>
        <Text style={text}>
          Buyer telah menerima penawaran dan order otomatis telah dibuat di {SITE_NAME}.
        </Text>

        <Section style={detailBox}>
          <Text style={sectionTitle}>Detail Buyer</Text>
          {buyerCompany && <Text style={detailRow}><strong>Perusahaan:</strong> {buyerCompany}</Text>}
          {buyerContact && <Text style={detailRow}><strong>Kontak:</strong> {buyerContact}</Text>}
          {buyerEmail && <Text style={detailRow}><strong>Email:</strong> {buyerEmail}</Text>}
        </Section>

        <Section style={detailBox}>
          <Text style={sectionTitle}>Detail Order</Text>
          {supplierName && <Text style={detailRow}><strong>Supplier:</strong> {supplierName}</Text>}
          {category && <Text style={detailRow}><strong>Kategori:</strong> {category}</Text>}
          {quantity && <Text style={detailRow}><strong>Kuantitas:</strong> {quantity}</Text>}
          {agreedPrice && <Text style={detailRow}><strong>Harga Disepakati:</strong> {agreedPrice}</Text>}
          {leadTime && <Text style={detailRow}><strong>Lead Time:</strong> {leadTime}</Text>}
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          Kelola order ini di Admin Panel → Orders.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderCreatedAdminEmail,
  subject: (data: Record<string, any>) =>
    `Order baru: ${data.buyerCompany || 'Buyer'} × ${data.supplierName || 'Supplier'} — ${SITE_NAME}`,
  displayName: 'Order Created (Admin Notification)',
  previewData: {
    buyerCompany: 'PT Maju Jaya',
    buyerContact: 'Ahmad Hidayat',
    buyerEmail: 'ahmad@majujaya.co.id',
    supplierName: 'Koperasi Maju Bersama',
    category: 'Handicraft',
    quantity: '500 pcs',
    agreedPrice: 'IDR 85,000/pcs',
    leadTime: '14 hari kerja',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: 'hsl(160, 45%, 22%)', margin: '0 0 20px' }
const text = { fontSize: '14px', color: 'hsl(160, 10%, 46%)', lineHeight: '1.6', margin: '0 0 16px' }
const detailBox = {
  backgroundColor: 'hsl(38, 60%, 92%)',
  borderRadius: '8px',
  padding: '16px 20px',
  margin: '12px 0',
}
const sectionTitle = { fontSize: '13px', fontWeight: 'bold' as const, color: 'hsl(160, 45%, 22%)', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }
const detailRow = { fontSize: '14px', color: 'hsl(160, 30%, 12%)', lineHeight: '1.8', margin: '0' }
const hr = { borderColor: 'hsl(40, 20%, 94%)', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '0' }
