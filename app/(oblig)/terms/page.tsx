// app/terms/page.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="mb-8" asChild>
          <Link href="/">← Back to Home</Link>
        </Button>

        <div className="prose prose-gray max-w-none">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
          
          <p className="text-muted-foreground mb-8">
            Last updated: March 26, 2026
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Metis Talent's website and services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p>
              Metis Talent provides a SaaS platform offering pre-employment assessments, including cognitive ability tests 
              and personality assessments based on the Big Five model. Our services help employers and recruiters make 
              more informed hiring decisions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="mb-4">
              To use certain features of our service, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide accurate and complete information when registering</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Subscriptions and Payments</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Subscriptions are billed on a recurring basis as selected during signup</li>
              <li>All payments are processed securely through Stripe</li>
              <li>You can cancel your subscription at any time through your account settings</li>
              <li>No refunds will be issued for partial months of service</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Candidate Assessments</h2>
            <p>
              When you invite candidates to take assessments:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>You are responsible for obtaining appropriate consent from candidates</li>
              <li>We process assessment data solely on your behalf as a data processor</li>
              <li>Candidates' personal data is handled according to our Privacy Policy</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">6. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to reverse engineer or copy our assessment content</li>
              <li>Share assessment links with unauthorized parties</li>
              <li>Interfere with the security or proper functioning of the service</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p>
              All content, assessments, reports, and technology provided by Metis Talent are protected by copyright, 
              trademark, and other intellectual property laws. You are granted a limited, non-exclusive license to use 
              our services during your subscription period.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account if you violate these Terms. Upon termination, 
              your right to use the service will cease immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Metis Talent shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages arising from your use of our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without 
              regard to conflict of law principles.
            </p>
          </section>

          {/*<section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-3 font-medium">
              legal@metistalent.com
            </p>
          </section>*/}

          <div className="text-xs text-muted-foreground border-t border-border pt-8 mt-12">
            These Terms of Service constitute the entire agreement between you and Metis Talent regarding the use of our services. 
            We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the updated terms.
          </div>
        </div>
      </div>
    </div>
  )
}