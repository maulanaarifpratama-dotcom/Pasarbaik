import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Section, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "PasarBaik"

interface NewQuotationProps {
  buyerName?: string
  supplierName?: string
  price?: string
  moq?: string
  leadTime?: string
  notes?: string
  trackingUrl?: string
}

const NewQuotationEmail = ({
  buyerName,
  supplierName,
  price,
  moq,
  leadTime,
  notes,
  trackingUrl,
}: NewQuotationProps) => (
  <Html lang="id" dir="ltr">
    <Head />
    <Preview>Penawaran baru dari {supplierName || 'supplier'} di {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Penawaran Baru Diterima</Heading>
        <Text style={text}>
          {buyerName ? `Halo ${buyerName},` : 'Halo,'}
        </Text>
        <Text style={text}>
          Supplier <strong>{supplierName || 'mitra kami'}</strong> telah mengirimkan penawaran untuk permintaan Anda di {SITE_NAME}.
        </Text>

        <Section style={detailBox}>
          {price && (
            <Text style={detailRow}>
              <strong>Harga:</strong> {price}
            </Text>
          )}
          {moq && (
            <Text style={detailRow}>
              <strong>Min. Order:</strong> {moq}
            </Text>
          )}
          {leadTime && (
            <Text style={detailRow}>
              <strong>Lead Time:</strong> {leadTime}
            </Text>
          )}
          {notes && (
            <Text style={detailRow}>
              <strong>Catatan:</strong> {notes}
            </Text>
          )}
        </Section>

        {trackingUrl && (
          <Section style={{ textAlign: 'center' as const, margin: '24px 0' }}>
            <Button style={button} href={trackingUrl}>
              Lihat & Bandingkan Penawaran
            </Button>
          </Section>
        )}

        <Hr style={hr} />
        <Text style={footer}>
          Email ini dikirim otomatis oleh {SITE_NAME}. Jika Anda tidak merasa mengirim RFQ, silakan abaikan email ini.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: NewQuotationEmail,
  subject: (data: Record<string, any>) =>
    `Penawaran baru dari ${data.supplierName || 'supplier'} — ${SITE_NAME}`,
  displayName: 'New Quotation Notification',
  previewData: {
    buyerName: 'Ahmad',
    supplierName: 'Koperasi Maju Bersama',
    price: 'IDR 85,000/pcs',
    moq: '100 pcs',
    leadTime: '14 hari kerja',
    notes: 'Harga sudah termasuk packaging',
    trackingUrl: 'https://pasarbaik.com/my-rfq?token=example-token',
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
  margin: '16px 0',
}
const detailRow = { fontSize: '14px', color: 'hsl(160, 30%, 12%)', lineHeight: '1.8', margin: '0' }
const button = {
  backgroundColor: 'hsl(160, 45%, 22%)',
  color: 'hsl(40, 33%, 98%)',
  borderRadius: '8px',
  padding: '12px 28px',
  fontSize: '14px',
  fontWeight: '600' as const,
  textDecoration: 'none',
}
const hr = { borderColor: 'hsl(40, 20%, 94%)', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '0' }
