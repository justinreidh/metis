// app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, Users, Trophy, TrendingUp, Clock } from 'lucide-react'

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    completed: 0,
    avgScore: 0,
  })
  const [recentCandidates, setRecentCandidates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchDashboardData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      // Fetch candidates with their results
      const { data: candidatesData } = await supabase
        .from('candidates')
        .select(`
          id, name, email, status, created_at,
          results (overall_score)
        `)
        .eq('company_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(8)

      if (candidatesData) {
        const total = candidatesData.length
        const completed = candidatesData.filter(c => c.status === 'completed').length
        const scores = candidatesData
          .flatMap(c => c.results?.map((r: any) => r.overall_score) || [])
          .filter(Boolean)

        const avgScore = scores.length 
          ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
          : 0

        setStats({
          totalCandidates: total,
          completed,
          avgScore,
        })

        setRecentCandidates(candidatesData.slice(0, 5))
      }

      setLoading(false)
    }

    fetchDashboardData()
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading your overview...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-xl text-muted-foreground mt-3">
            Here's what's happening with your hiring pipeline
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Candidates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.totalCandidates}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.completed}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {stats.totalCandidates > 0 
                  ? Math.round((stats.completed / stats.totalCandidates) * 100) 
                  : 0}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{stats.avgScore}</div>
              <p className="text-sm text-muted-foreground mt-1">out of 100</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stats.totalCandidates}</div>
              <p className="text-sm text-muted-foreground mt-1">candidates added</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Overall scores across all candidates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 pt-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>80–100 (Excellent)</span>
                  <span className="font-medium">18 candidates</span>
                </div>
                <div className="h-2 bg-primary rounded-full w-[70%]"></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>60–79 (Good)</span>
                  <span className="font-medium">21 candidates</span>
                </div>
                <div className="h-2 bg-primary/70 rounded-full w-[45%]"></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Below 60 (Needs Review)</span>
                  <span className="font-medium">8 candidates</span>
                </div>
                <div className="h-2 bg-muted rounded-full w-[17%]"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Sarah Chen completed assessment</p>
                  <p className="text-sm text-muted-foreground">Overall Score: 88 • 2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-medium">Marcus Okoro completed assessment</p>
                  <p className="text-sm text-muted-foreground">Overall Score: 79 • Yesterday</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-2 h-2 mt-2 bg-amber-500 rounded-full"></div>
                <div>
                  <p className="font-medium">3 candidates invited</p>
                  <p className="text-sm text-muted-foreground">This week</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


        {/* Recent Candidates */}
        <Card className="border-none shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Candidates</CardTitle>
              <CardDescription>Latest additions and their progress</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/candidates">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentCandidates.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">No candidates yet. Add your first one above.</p>
            ) : (
              <div className="space-y-4">
                {recentCandidates.map((c) => {
                  const score = c.results?.[0]?.overall_score
                  return (
                    <div
                      key={c.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-card border border-border rounded-2xl hover:border-primary/30 transition-colors"
                    >
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-sm text-muted-foreground">{c.email}</div>
                      </div>

                      <div className="flex items-center gap-6 mt-4 sm:mt-0">
                        {score !== undefined && (
                          <div className="text-right">
                            <div className="text-xl font-bold">{score}</div>
                            <div className="text-xs text-muted-foreground">Score</div>
                          </div>
                        )}

                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/candidate/${c.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow cursor-pointer" >
            <Link href="/dashboard/add">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Add New Candidate</h3>
                  <p className="text-muted-foreground">Invite someone to take an assessment</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="border-none shadow-xl hover:shadow-2xl transition-shadow cursor-pointer" >
            <Link href="/dashboard/candidates">
              <CardContent className="p-8 flex items-center gap-6">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">View All Candidates</h3>
                  <p className="text-muted-foreground">Browse and manage your full list</p>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}