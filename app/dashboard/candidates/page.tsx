// app/dashboard/candidates/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Eye, Copy, Search, Plus, Trophy } from 'lucide-react'
import Link from 'next/link'
import CandidateItem from '@/components/CandidateItem'

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const supabase = createClient()

  useEffect(() => {
    async function fetchCandidates() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) return

      const { data, error } = await supabase
        .from('candidates')
        .select(`
          *,
          results (overall_score)
        `)
        .eq('company_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!error) {
        setCandidates(data || [])
      }
      setLoading(false)
    }

    fetchCandidates()
  }, [supabase])

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const generateLink = async (candidateId: string) => {
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
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-muted-foreground">Loading candidates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Candidates</h1>
            <p className="text-muted-foreground mt-2">
              Manage all your candidates and their assessment progress
            </p>
          </div>

          <Button asChild>
            <Link href="/dashboard/add">
              <Plus className="mr-2 h-5 w-5" />
              Add New Candidate
            </Link>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search candidates by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 py-6 text-lg"
          />
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>All Candidates ({filteredCandidates.length})</CardTitle>
            <CardDescription>
              View status, scores, and assessment links
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg">No candidates found</p>
                <p className="mt-2">Try adjusting your search or add a new candidate.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCandidates.map((candidate) => (
                <CandidateItem
                    key={candidate.id}
                    candidate={candidate}
                    onCopyLink={generateLink}
                />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}