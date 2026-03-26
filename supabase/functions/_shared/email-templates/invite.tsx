/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body, Button, Container, Head, Heading, Html, Link, Preview, Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({ siteName, siteUrl, confirmationUrl }: InviteEmailProps) => (
  <Html lang="id" dir="ltr">
    <Head />
    <Preview>Anda diundang bergabung di {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Anda Diundang</Heading>
        <Text style={text}>
          Anda telah diundang untuk bergabung di{' '}
          <Link href={siteUrl} style={link}><strong>{siteName}</strong></Link>.
          Klik tombol di bawah untuk menerima undangan dan membuat akun.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Terima Undangan
        </Button>
        <Text style={footer}>
          Jika Anda tidak mengharapkan undangan ini, abaikan email ini.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: 'hsl(160, 45%, 22%)', margin: '0 0 20px' }
const text = { fontSize: '14px', color: 'hsl(160, 10%, 46%)', lineHeight: '1.6', margin: '0 0 20px' }
const link = { color: 'inherit', textDecoration: 'underline' }
const button = {
  backgroundColor: 'hsl(160, 45%, 22%)',
  color: 'hsl(40, 33%, 98%)',
  fontSize: '14px',
  fontWeight: '600' as const,
  borderRadius: '0.75rem',
  padding: '12px 28px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
