// app/dashboard/page.tsx
'use client'

import { useEffect, useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Copy, Eye, Loader2, Plus, AlertCircle, Trophy } from 'lucide-react'

export default function Dashboard() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    async function fetchCandidates() {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        setError('Please sign in to view your dashboard')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('candidates')
        .select(`
          *,
          results (overall_score)
        `)
        .eq('company_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fetch error:', error)
        setError(error.message)
      } else {
        setCandidates(data || [])
      }
      setLoading(false)
    }

    fetchCandidates()
  }, [supabase])

  async function handleAddCandidate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setAdding(true)
    setError(null)

    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value.trim()
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value.trim()

    if (!name || !email) {
      setError('Name and email are required')
      setAdding(false)
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      setError('Not authenticated')
      setAdding(false)
      return
    }

    const { error } = await supabase.from('candidates').insert({
      company_id: session.user.id,
      name,
      email,
    })

    if (error) {
      setError(error.message)
    } else {
      form.reset()
      // Refresh list
      const { data } = await supabase
        .from('candidates')
        .select('*, results (overall_score)')
        .eq('company_id', session.user.id)
        .order('created_at', { ascending: false })
      setCandidates(data || [])
    }
    setAdding(false)
  }

  async function generateLink(candidateId: number | string) {
    const { data, error } = await supabase
      .from('candidates')
      .select('token')
      .eq('id', candidateId)
      .single()

    if (error || !data?.token) {
      alert('Failed to generate link')
      return
    }

    const link = `${window.location.origin}/test?token=${data.token}`

    try {
      await navigator.clipboard.writeText(link)
      alert(`Assessment link copied!\n\n${link}`)
    } catch {
      alert(`Could not copy automatically.\n\nLink: ${link}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-6">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Your Dashboard
            </h1>
            <p className="text-xl text-muted-foreground mt-2">
              Manage candidates and assessments
            </p>
          </div>
        </div>

        {/* Add Candidate Card */}
        <Card className="mb-10 border-none shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl">Add New Candidate</CardTitle>
            <CardDescription>
              Invite a candidate to complete an assessment. We'll send them a secure link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCandidate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required disabled={adding} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="candidate@company.com"
                    required
                    disabled={adding}
                  />
                </div>
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
                className="w-full md:w-auto px-10 py-6 text-lg"
                disabled={adding}
              >
                {adding ? (
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
          </CardContent>
        </Card>

        {/* Candidates List */}
        <Card className="border-none shadow-xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl">
              Candidates ({candidates.length})
            </CardTitle>
            <CardDescription>
              View status, scores, and assessment links
            </CardDescription>
          </CardHeader>
          <CardContent>
            {candidates.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No candidates yet.</p>
                <p className="mt-2">Add your first candidate above to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {candidates.map((c) => {
                  const overallScore = c.results?.[0]?.overall_score
                  const hasScore = overallScore !== null && overallScore !== undefined

                  return (
                    <div
                      key={c.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all duration-200"
                    >
                      <div className="mb-4 sm:mb-0">
                        <div className="font-semibold text-lg text-foreground">{c.name}</div>
                        <div className="text-sm text-muted-foreground">{c.email}</div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        {/* Status */}
                        <Badge 
                          variant={c.status === 'completed' ? 'default' : c.status === 'in_progress' ? 'secondary' : 'outline'}
                          className="px-4 py-1"
                        >
                          {c.status ? c.status.replace('_', ' ') : 'Pending'}
                        </Badge>

                        {/* Overall Score - Show only when available */}
                        {hasScore && (
                          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full font-medium">
                            <Trophy className="h-4 w-4" />
                            Score: <span className="font-bold">{overallScore}</span>/100
                          </div>
                        )}

                        {/* Copy Link - Only show if no score yet */}
                        {!hasScore && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => generateLink(c.id)}
                          >
                            <Copy className="h-4 w-4" />
                            Copy Link
                          </Button>
                        )}

                        {/* View Results Button */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:text-primary/80 hover:bg-primary/5"
                          asChild
                        >
                          <a href={`/dashboard/candidate/${c.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </a>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}