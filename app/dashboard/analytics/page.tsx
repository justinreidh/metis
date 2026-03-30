// app/dashboard/analytics/page.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export default function AnalyticsPage() {
  // Mock data - replace with real data from Supabase later
  const stats = {
    totalCandidates: 47,
    completionRate: 89,
    avgOverallScore: 76,
    topTrait: "Conscientiousness",
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">Insights from your assessments</p>
      </div>

      {/* KPI Cards */}
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.completionRate}%</div>
            <Progress value={stats.completionRate} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.avgOverallScore}</div>
            <p className="text-sm text-muted-foreground mt-1">out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Strongest Trait</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{stats.topTrait}</div>
            <Badge variant="secondary" className="mt-2">Most Predictive</Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
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

      {/* Future: Add charts here with Recharts or Tremor when you're ready */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        More advanced analytics (charts, filters, export) coming soon.
      </div>
    </div>
  )
}