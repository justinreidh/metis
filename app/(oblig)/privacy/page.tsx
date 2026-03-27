// app/privacy/page.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="mb-8" asChild>
          <Link href="/">← Back to Home</Link>
        </Button>

        <div className="prose prose-gray max-w-none">
          <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
          
          <p className="text-muted-foreground mb-8">
            Last updated: March 26, 2026
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              At Metis Talent, we are committed to protecting your privacy. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website and use our pre-employment 
              assessment platform.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-medium mt-6 mb-3">Information from Employers/Recruiters</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Account information (name, email, company details)</li>
              <li>Billing information (processed securely via Stripe)</li>
              <li>Candidate data you upload or invite (name, email, assessment results)</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">Information from Candidates</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Assessment responses (cognitive and personality test answers)</li>
              <li>Basic contact information (email)</li>
              <li>Assessment completion metadata (time taken, etc.)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide and improve our assessment services</li>
              <li>To generate candidate reports and insights for employers</li>
              <li>To communicate with you about your account and assessments</li>
              <li>To process payments and manage subscriptions</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
            <p className="mb-4">
              We do not sell your personal data. We may share information in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>With your explicit consent (e.g., sharing assessment results with an employer)</li>
              <li>With service providers (Stripe for payments, hosting providers)</li>
              <li>When required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data, 
              including encryption, access controls, and regular security reviews. However, no system is completely secure.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Access, correct, or delete your personal data</li>
              <li>Object to or restrict processing</li>
              <li>Withdraw consent at any time</li>
              <li>Request data portability</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
            <p>
              We use essential cookies to operate the site and optional analytics cookies to improve user experience. 
              You can manage your cookie preferences through your browser settings.
            </p>
          </section>

          {/*<section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mt-3 font-medium">
              privacy@metistalent.com
            </p>
          </section>*/}

          <div className="text-xs text-muted-foreground border-t border-border pt-8 mt-12">
            This Privacy Policy is governed by the laws of the United States. We may update this policy from time to time. 
            Continued use of our services after changes constitutes acceptance of the updated policy.
          </div>
        </div>
      </div>
    </div>
  )
}