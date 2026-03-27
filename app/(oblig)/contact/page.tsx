// app/contact/page.tsx
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="mb-10" asChild>
          <Link href="/">← Back to Home</Link>
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground">
            We'd love to hear from you. Reach out anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Email */}
          <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Mail className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Email Us</h3>
            <a 
              href="mailto:hello@metistalent.com" 
              className="text-primary hover:underline text-lg font-medium"
            >
              hello@metistalent.com
            </a>
            <p className="text-sm text-muted-foreground mt-4">
              We usually respond within one business day.
            </p>
          </div>

          {/* Phone */}
          <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-md transition-shadow">
            <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Phone className="h-7 w-7 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Call Us</h3>
            <a 
              href="tel:+15551234567" 
              className="text-primary hover:underline text-lg font-medium"
            >
              (555) 123-4567
            </a>
            <p className="text-sm text-muted-foreground mt-4">
              Monday – Friday, 9am – 5pm MST
            </p>
          </div>

          
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Prefer to talk? Feel free to reach out via email or phone. 
            We're here to help you find better talent.
          </p>
        </div>
      </div>
    </div>
  )
}