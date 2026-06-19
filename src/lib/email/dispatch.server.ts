import * as React from 'react'
import { render } from '@react-email/components'
import { createClient } from '@supabase/supabase-js'
import { TEMPLATES } from '@/lib/email-templates/registry'

// Sender configuration (mirrors the scaffolded transactional send route).
const SITE_NAME = 'shutty-spark-lab'
const SENDER_DOMAIN = 'notify.shutty.io'
const FROM_DOMAIN = 'shutty.io'

function generateToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export interface EnqueueResult {
  success: boolean
  reason?: string
}

/**
 * Render and enqueue a registered transactional email using service-role
 * credentials. Safe to call from public/unauthenticated app action routes
 * AFTER the caller has validated input and verified the trigger event.
 */
export async function enqueueTemplateEmail(opts: {
  templateName: string
  recipientEmail: string
  idempotencyKey?: string
  templateData?: Record<string, unknown>
}): Promise<EnqueueResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server credentials')
  }

  const template = TEMPLATES[opts.templateName]
  if (!template) {
    throw new Error(`Template '${opts.templateName}' not found`)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  const messageId = crypto.randomUUID()
  const idempotencyKey = opts.idempotencyKey || messageId
  const recipient = template.to || opts.recipientEmail
  const normalizedEmail = recipient.toLowerCase()

  // Suppression check (fail-closed)
  const { data: suppressed, error: suppressionError } = await supabase
    .from('suppressed_emails')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle()
  if (suppressionError) throw new Error('Failed to verify suppression status')
  if (suppressed) {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: opts.templateName,
      recipient_email: recipient,
      status: 'suppressed',
    })
    return { success: false, reason: 'email_suppressed' }
  }

  // Get or create unsubscribe token (one per email)
  let unsubscribeToken: string
  const { data: existingToken } = await supabase
    .from('email_unsubscribe_tokens')
    .select('token, used_at')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (existingToken && !existingToken.used_at) {
    unsubscribeToken = existingToken.token
  } else if (!existingToken) {
    unsubscribeToken = generateToken()
    await supabase
      .from('email_unsubscribe_tokens')
      .upsert({ token: unsubscribeToken, email: normalizedEmail }, { onConflict: 'email', ignoreDuplicates: true })
    const { data: storedToken } = await supabase
      .from('email_unsubscribe_tokens')
      .select('token')
      .eq('email', normalizedEmail)
      .maybeSingle()
    if (!storedToken) throw new Error('Failed to confirm unsubscribe token storage')
    unsubscribeToken = storedToken.token
  } else {
    return { success: false, reason: 'email_suppressed' }
  }

  // Render
  const element = React.createElement(template.component, opts.templateData || {})
  const html = await render(element)
  const plainText = await render(element, { plainText: true })
  const resolvedSubject =
    typeof template.subject === 'function'
      ? template.subject(opts.templateData || {})
      : template.subject

  await supabase.from('email_send_log').insert({
    message_id: messageId,
    template_name: opts.templateName,
    recipient_email: recipient,
    status: 'pending',
  })

  const { error: enqueueError } = await supabase.rpc('enqueue_email', {
    queue_name: 'transactional_emails',
    payload: {
      message_id: messageId,
      to: recipient,
      from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
      sender_domain: SENDER_DOMAIN,
      subject: resolvedSubject,
      html,
      text: plainText,
      purpose: 'transactional',
      label: opts.templateName,
      idempotency_key: idempotencyKey,
      unsubscribe_token: unsubscribeToken,
      queued_at: new Date().toISOString(),
    },
  })

  if (enqueueError) {
    await supabase.from('email_send_log').insert({
      message_id: messageId,
      template_name: opts.templateName,
      recipient_email: recipient,
      status: 'failed',
      error_message: 'Failed to enqueue email',
    })
    throw new Error('Failed to enqueue email')
  }

  return { success: true }
}
