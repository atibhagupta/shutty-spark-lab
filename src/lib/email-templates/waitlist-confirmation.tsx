import React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface Props {
  name?: string
}

const BENEFITS: { label: string; detail: string }[] = [
  {
    label: 'Free early access',
    detail: 'You get into SHUTTY for free the moment we launch — no charge for being early.',
  },
  {
    label: 'Founding-member perks',
    detail: 'Exclusive first-user benefits reserved only for people on this list.',
  },
  {
    label: 'Early leaderboard spot',
    detail: 'Start your streak before the crowd and lock in your place at the top.',
  },
]

const WaitlistConfirmation = ({ name }: Props) => {
  const greeting = name ? `You're in, ${name}.` : "You're in."
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>You're on the SHUTTY waiting list — free access + first-user perks locked in.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={card}>
            <Text style={kicker}>● SHUTTY — WAITING LIST</Text>
            <Heading style={h1}>{greeting}</Heading>
            <Text style={lead}>
              Thanks for claiming your streak early. You're officially on the SHUTTY waiting
              list, and we'll email you the second we launch. Here's what being early gets you:
            </Text>

            <Section style={benefitsWrap}>
              {BENEFITS.map((b) => (
                <Section key={b.label} style={benefitRow}>
                  <Text style={benefitLabel}>→ {b.label}</Text>
                  <Text style={benefitDetail}>{b.detail}</Text>
                </Section>
              ))}
            </Section>

            <Hr style={hr} />
            <Text style={footerText}>
              Sit tight — we'll be in touch the moment SHUTTY goes live. Tell your phone to
              stay shutty.
            </Text>
            <Text style={signoff}>— The SHUTTY team</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: WaitlistConfirmation,
  subject: "You're on the SHUTTY waiting list 🔥",
  displayName: 'Waitlist confirmation',
  previewData: { name: 'Atibha' },
} satisfies TemplateEntry

export default WaitlistConfirmation

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    "'Space Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace, Arial, sans-serif",
  padding: '24px 0',
}

const container = { maxWidth: '560px', margin: '0 auto', padding: '0 16px' }

const card = {
  backgroundColor: '#050505',
  borderRadius: '14px',
  border: '1px solid rgba(255,255,255,0.1)',
  padding: '40px 36px',
}

const kicker = {
  color: '#ff4500',
  fontSize: '11px',
  letterSpacing: '0.2em',
  textTransform: 'uppercase' as const,
  margin: '0 0 18px',
}

const h1 = {
  color: '#ffffff',
  fontSize: '30px',
  lineHeight: '1.15',
  fontWeight: 700,
  margin: '0 0 16px',
}

const lead = {
  color: '#b8b8b8',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 28px',
}

const benefitsWrap = { margin: '0' }

const benefitRow = {
  borderLeft: '2px solid #ff4500',
  padding: '4px 0 4px 16px',
  margin: '0 0 18px',
}

const benefitLabel = {
  color: '#ff4500',
  fontSize: '14px',
  fontWeight: 700,
  margin: '0 0 4px',
}

const benefitDetail = {
  color: '#cfcfcf',
  fontSize: '13px',
  lineHeight: '1.55',
  margin: '0',
}

const hr = { borderColor: 'rgba(255,255,255,0.1)', margin: '28px 0 20px' }

const footerText = {
  color: '#9a9a9a',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const signoff = { color: '#ffffff', fontSize: '13px', fontWeight: 700, margin: '0' }
