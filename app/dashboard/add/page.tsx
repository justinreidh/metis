'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Plus, Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { createCandidateWithEmail } from '@/app/actions/candidate-actions'

export default function AddCandidatePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  // Server Action
  async function addCandidate(formData: FormData) {
    setLoading(true)
    setError(null)

    try {
      const name = formData.get('name') as string
      const email = formData.get('email') as string

      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        throw new Error('You must be signed in to add candidates')
      }

      // Call Server Action
      const result = await createCandidateWithEmail({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        company_id: session.user.id,
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      setSuccess(true)
      setName('')
      setEmail('')

      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/candidates')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Failed to add candidate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Add Candidate
            </h1>
            <p className="text-muted-foreground mt-2">
              Invite a new candidate to take your assessment
            </p>
          </div>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Candidate Details</CardTitle>
            <CardDescription>
              Enter the candidate’s information. They will automatically receive an assessment invitation.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success ? (
              <div className="py-16 text-center">
                <div className="mx-auto w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">Candidate Added Successfully!</h3>
                <p className="text-muted-foreground">
                  Invitation email has been sent. Redirecting...
                </p>
              </div>
            ) : (
              <form action={addCandidate} className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    required
                    disabled={loading}
                    className="py-6 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    required
                    disabled={loading}
                    className="py-6 text-lg"
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
                  className="w-full py-6 text-lg"
                  disabled={loading || !name || !email}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Adding Candidate & Sending Invite...
                    </>
                  ) : (
                    <>
                      Add Candidate & Send Invite <Plus className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}