import { createFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const SignupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email').max(255),
})

export const Route = createFileRoute('/api/public/waitlist')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !supabaseServiceKey) {
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        let parsed
        try {
          parsed = SignupSchema.parse(await request.json())
        } catch (err) {
          const message = err instanceof z.ZodError ? err.errors[0]?.message : 'Invalid request'
          return Response.json({ error: message }, { status: 400 })
        }

        const { name, email } = parsed
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        const { error: insertError } = await supabase
          .from('waitlist')
          .insert({ name, email })

        // Already on the list — succeed without resending the confirmation.
        if (insertError) {
          if (insertError.code === '23505') {
            return Response.json({ success: true, alreadyJoined: true })
          }
          console.error('Waitlist insert failed', { code: insertError.code })
          return Response.json({ error: 'Could not join the waitlist' }, { status: 500 })
        }

        // Fire the confirmation email. Don't fail the signup if email enqueue fails.
        try {
          const { enqueueTemplateEmail } = await import('@/lib/email/dispatch.server')
          await enqueueTemplateEmail({
            templateName: 'waitlist-confirmation',
            recipientEmail: email,
            idempotencyKey: `waitlist-confirm-${email}`,
            templateData: { name },
          })
        } catch (err) {
          console.error('Waitlist confirmation email failed to enqueue', err)
        }

        return Response.json({ success: true, alreadyJoined: false })
      },
    },
  },
})
