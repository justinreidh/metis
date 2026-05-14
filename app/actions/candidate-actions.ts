'use server'

import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase/admin'
import AssessmentInvite from '@/components/emails/AssessmentInvite'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function createCandidateWithEmail({
  name,
  email,
  company_id,
}: {
  name: string
  email: string
  company_id: string
}) {
  try {
    // 1. Insert candidate
    const { data: candidate, error: insertError } = await supabaseAdmin
      .from('candidates')
      .insert({
        company_id,
        name,
        email,
        status: 'invited',
      })
      .select()
      .single()

    if (insertError) throw insertError

    // 2. Generate secure token
    const token = crypto.randomUUID()

    // 3. Save assessment token
    await supabaseAdmin.from('assessment_tokens').insert({
      candidate_id: candidate.id,
      token,
      expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    })

    const assessmentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/assessment/${token}`

    // 4. Send email
    await resend.emails.send({
      from: 'Support <no-reply@metisassessments.com>', // ← Change to your verified domain
      to: email,
      subject: `Assessment Invitation - ${name}`,
      react: AssessmentInvite({
        candidateName: name,
        assessmentUrl,
        companyName: "Metis Assessments",
      }),
    })

    return { success: true }
  } catch (error: any) {
    console.error('Failed to create candidate:', error)
    return { success: false, error: error.message }
  }
}