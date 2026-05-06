// app/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, Users, Trophy, TrendingUp, Clock, AlertCircle } from 'lucide-react'
import CandidateItem from '@/components/CandidateItem'

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    completed: 0,
    avgScore: 0,
  })
  const [recentCandidates, setRecentCandidates] = useState<any[]>([])
  const [scoreDistribution, setScoreDistribution] = useState({
    excellent: 0,   // 80-100
    good: 0,        // 60-79
    needsReview: 0  // < 60
  })
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    async function fetchDashboardData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      // Fetch all candidates with results
      const { data: candidatesData, error } = await supabase
        .from('candidates')
        .select(`
          id, name, email, status, created_at,
          results (overall_score)
        `)
        .eq('company_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching dashboard data:', error)
        setLoading(false)
        return
      }

      if (candidatesData) {
        const total = candidatesData.length
        const completed = candidatesData.filter(c => c.status === 'completed').length
        
        // Calculate average score
        const allScores = candidatesData
          .flatMap(c => c.results?.map((r: any) => r.overall_score) || [])
          .filter(Boolean)

        const avgScore = allScores.length 
          ? Math.round(allScores.reduce((a: number, b: number) => a + b, 0) / allScores.length)
          : 0

        // Calculate score distribution
        let excellent = 0, good = 0, needsReview = 0
        
        allScores.forEach(score => {
          if (score >= 80) excellent++
          else if (score >= 60) good++
          else needsReview++
        })

        setStats({
          totalCandidates: total,
          completed,
          avgScore,
        })

        setScoreDistribution({
          excellent,
          good,
          needsReview,
        })

        setRecentCandidates(candidatesData.slice(0, 6))
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
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Assessments</CardTitle>
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
              <div className="text-4xl font-bold text-primary">
                {stats.totalCandidates}
              </div>
              <p className="text-sm text-muted-foreground mt-1">candidates added</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Real Score Distribution */}
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
                    <span className="font-medium">{scoreDistribution.excellent} candidates</span>
                  </div>
                  <div 
                    className="h-3 bg-primary rounded-full" 
                    style={{ width: `${stats.totalCandidates > 0 ? (scoreDistribution.excellent / stats.totalCandidates) * 100 : 0}%` }}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>60–79 (Good)</span>
                    <span className="font-medium">{scoreDistribution.good} candidates</span>
                  </div>
                  <div 
                    className="h-3 bg-primary/70 rounded-full" 
                    style={{ width: `${stats.totalCandidates > 0 ? (scoreDistribution.good / stats.totalCandidates) * 100 : 0}%` }}
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Below 60 (Needs Review)</span>
                    <span className="font-medium">{scoreDistribution.needsReview} candidates</span>
                  </div>
                  <div 
                    className="h-3 bg-muted rounded-full" 
                    style={{ width: `${stats.totalCandidates > 0 ? (scoreDistribution.needsReview / stats.totalCandidates) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity - Limited to 3 most recent events */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest candidate activity</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-hidden">
              {recentCandidates.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center">
                  <p className="text-muted-foreground">No recent activity yet.</p>
                </div>
              ) : (
                <div className="h-full overflow-y-auto pr-2 space-y-6 custom-scroll">
                  {recentCandidates
                    .slice(0, 3)                    // ← Only show the 3 most recent
                    .map((c) => {
                      const score = c.results?.[0]?.overall_score
                      const isCompleted = c.status === 'completed'

                      return (
                        <div key={c.id} className="flex gap-4">
                          <div className={`w-2 h-2 mt-2.5 rounded-full flex-shrink-0 ${isCompleted ? 'bg-green-500' : 'bg-amber-500'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {c.name} {isCompleted ? 'completed' : 'was invited to'} the assessment
                            </p>
                            {score && (
                              <p className="text-sm text-muted-foreground">
                                Overall Score: <span className="font-semibold text-foreground">{score}</span>
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(c.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )
                    })}

                  {recentCandidates.length > 3 && (
                    <div className="text-center pt-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/candidates">
                          View all activity →
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
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
              <Link href="/dashboard/candidates">View All Candidates</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentCandidates.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">No candidates yet. Add your first one to get started.</p>
            ) : (
              <div className="space-y-4">
                {recentCandidates.map((candidate) => (
                    <CandidateItem
                    key={candidate.id}
                    candidate={candidate}
                    />
                ))}
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