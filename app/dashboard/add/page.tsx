// app/dashboard/add/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ArrowLeft, Loader2, Plus, AlertCircle } from 'lucide-react'

export default function AddCandidatePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        setError('You must be signed in to add candidates')
        setLoading(false)
        return
      }

      const { error: insertError } = await supabase.from('candidates').insert({
        company_id: session.user.id,
        name: name.trim(),
        email: email.trim().toLowerCase(),
      })

      if (insertError) throw insertError

      setSuccess(true)
      
      // Reset form
      setName('')
      setEmail('')

      // Redirect back to dashboard after short delay
      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)

    } catch (err: any) {
      setError(err.message || 'Failed to add candidate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-2xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-8 text-primary hover:text-primary/80" 
          onClick={() => router.push('/dashboard')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="border-none shadow-xl">
          <CardHeader className="pb-8">
            <CardTitle className="text-3xl">Add New Candidate</CardTitle>
            <CardDescription className="text-lg">
              Invite a candidate to take the assessment. We'll send them a secure link.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="py-12 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Plus className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Candidate Added Successfully</h3>
                <p className="text-muted-foreground">
                  The candidate has been added and can now be invited to take the assessment.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    required
                    disabled={loading}
                    className="text-lg py-6"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    required
                    disabled={loading}
                    className="text-lg py-6"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full py-7 text-lg"
                  disabled={loading || !name || !email}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Adding Candidate...
                    </>
                  ) : (
                    <>
                      Add Candidate <Plus className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          The candidate will receive an email with a secure link to complete the assessment.
        </p>
      </div>
    </div>
  )
}