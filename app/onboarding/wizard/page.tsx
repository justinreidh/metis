// app/onboarding/wizard/page.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Users, Send, BarChart3, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function GetStartedWizard() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const totalSteps = 3

  const handleAddFirstCandidate = async () => {
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) throw new Error('Not authenticated')

      const { error } = await supabase.from('candidates').insert({
        company_id: session.user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
      })

      if (error) throw error

      setSuccess(true)
      setStep(3)

    } catch (err: any) {
      alert(err.message || 'Failed to add candidate')
    } finally {
      setLoading(false)
    }
  }

  const progress = Math.round((step / totalSteps) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Getting Started</span>
            <span>Step {step} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="border-none shadow-2xl">
          {step === 1 && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="h-9 w-9 text-primary" />
                </div>
                <CardTitle className="text-3xl">Let's add your first candidate</CardTitle>
                <CardDescription className="text-lg">
                  This will help you see how the assessment process works.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Sarah Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    placeholder="sarah@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={() => setStep(2)} 
                  className="w-full py-6 text-lg"
                  disabled={!name || !email}
                >
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Ready to send the assessment?</CardTitle>
                <CardDescription>
                  We'll email {name} a secure link to complete the test.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-8">
                <Button 
                  onClick={handleAddFirstCandidate} 
                  className="w-full py-7 text-lg"
                  disabled={loading}
                >
                  {loading ? "Sending invitation..." : `Send Assessment to ${name}`}
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
              </CardContent>
            </>
          )}

          {step === 3 && success && (
            

            <>
                <CardHeader className="text-center pb-8">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    
                    <CardTitle className="text-3xl">Great! You're all set.</CardTitle>
                    <CardDescription className="mt-3 text-lg">
                    {name} has been invited. You'll be notified when they complete the assessment.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                    <Button 
                    onClick={() => router.push('/dashboard')} 
                    className="w-full py-6 text-lg"
                    >
                    Go to Dashboard
                    </Button>
                </CardContent>
                </>
          )}
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Step {step} of {totalSteps} • You can skip this anytime
        </p>
      </div>
    </div>
  )
}