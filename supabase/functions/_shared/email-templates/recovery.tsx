/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body, Button, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'

interface RecoveryEmailProps {
  siteName: string
  confirmationUrl: string
}

export const RecoveryEmail = ({ siteName, confirmationUrl }: RecoveryEmailProps) => (
  <Html lang="id" dir="ltr">
    <Head />
    <Preview>Reset password untuk {siteName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Reset Password</Heading>
        <Text style={text}>
          Kami menerima permintaan untuk mereset password akun {siteName} Anda. Klik tombol di bawah untuk memilih password baru.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Reset Password
        </Button>
        <Text style={footer}>
          Jika Anda tidak meminta reset password, abaikan email ini. Password Anda tidak akan berubah.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default RecoveryEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '24px 28px', maxWidth: '560px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: 'hsl(160, 45%, 22%)', margin: '0 0 20px' }
const text = { fontSize: '14px', color: 'hsl(160, 10%, 46%)', lineHeight: '1.6', margin: '0 0 20px' }
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
