'use client'

import { createClient } from '@/lib/supabase/client'  // ← browser client
import { useEffect, useState, FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export default function Dashboard() {
  const [candidates, setCandidates] = useState<any[]>([]) // TODO: replace 'any' with your Candidate type
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()  

  useEffect(() => {
    async function fetchCandidates() {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        setError('Not authenticated')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('company_id', session.user.id)  // safer: use session.user.id

      if (error) {
        console.error('Fetch error:', error)
        setError(error.message)
      } else {
        setCandidates(data || [])
      }
      setLoading(false)
    }

    fetchCandidates()
  }, [supabase]) // supabase is stable, but included for completeness

  async function handleAddCandidate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value

    if (!name || !email) {
      alert('Name and email are required')
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      alert('Not authenticated')
      return
    }

    const { error } = await supabase.from('candidates').insert({
      company_id: session.user.id,
      name,
      email,
      // status: 'pending', // add default if needed
    })

    if (error) {
      console.error('Insert error:', error)
      alert('Failed to add candidate: ' + error.message)
    } else {
      alert('Candidate added!')
      form.reset()
      // Optional: refetch candidates
      // fetchCandidates() or update state optimistically
    }
  }

  async function generateLink(candidateId: number | string) {
    const { data, error } = await supabase
      .from('candidates')
      .select('token')
      .eq('id', candidateId)
      .single()

    if (error || !data?.token) {
      alert('Failed to get token: ' + (error?.message || 'No token'))
      return
    }

    const link = `${window.location.origin}/test?token=${data.token}`
    try {
      await navigator.clipboard.writeText(link)
      alert(`Link copied to clipboard!\n\n${link}`)
      // Optional: you can later replace alert with a toast / UI feedback
    } catch (err) {
      console.error('Failed to copy:', err)
      // Fallback: still show the link so user can manually copy
      alert(`Could not copy automatically (browser may block it).\n\nLink:\n${link}\n\nPlease copy it manually.`)
    }
    // In production: call a server action or API route to email it securely
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading candidates...</div>
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your candidates and assessments</p>
        </div>
        {/* Add avatar / user menu later */}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Candidate</CardTitle>
          <CardDescription>Enter candidate details to invite them to an assessment.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCandidate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Candidate Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="candidate@example.com" required />
              </div>
            </div>
            <Button type="submit">Add Candidate</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Candidates</CardTitle>
          <CardDescription>Current assessment candidates ({candidates.length})</CardDescription>
        </CardHeader>
        <CardContent>
          {candidates.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No candidates yet. Add one above.</p>
          ) : (
            <div className="space-y-4">
              {candidates.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm text-muted-foreground">{c.email}</div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 sm:mt-0">
                    <Badge variant={c.status === 'completed' ? 'default' : 'secondary'}>
                      {c.status || 'Pending'}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => generateLink(c.id)}>
                      Send Link
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={`/candidate/${c.id}`}>View Results</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}