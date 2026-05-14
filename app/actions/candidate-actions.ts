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
    

    // 3. Save assessment token
    

    const assessmentUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/test/?token=${candidate.token}`

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