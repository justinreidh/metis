// app/dashboard/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  first_name: string
  last_name: string
  company_name: string
  subscription_status: string
}

export default function SettingsPage() {
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile>({
    first_name: '',
    last_name: '',
    company_name: '',
    subscription_status: '',
  })

  const [email, setEmail] = useState<string>('')
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch real user data from Supabase
  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true)
        setError(null)

        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
          throw new Error('You must be logged in to view settings')
        }

        setEmail(user.email ?? '')

        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name, company_name, subscription_status')
          .eq('id', user.id)
          .single()

        setProfile({
          first_name: profileData?.first_name ?? '',
          last_name: profileData?.last_name ?? '',
          company_name: profileData?.company_name ?? '',
          subscription_status: profileData?.subscription_status ?? '',
        })

        

      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [supabase])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profile.first_name || null,
          last_name: profile.last_name || null,
          company_name: profile.company_name || null,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      alert('✅ Profile updated successfully!')
    } catch (err: any) {
      alert('Error updating profile: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-center">Loading your settings...</div>
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-8 text-red-500">{error}</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and organization preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-10 grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name}
                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={profile.last_name}
                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} disabled />
              </div>

              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Tab */}
        <TabsContent value="company">
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Update your organization details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={profile.company_name}
                  onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Update Company Info'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Manage your plan and payment method</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center p-6 border rounded-2xl bg-card">
                <div>
                  <p className="font-medium text-lg">Professional Plan</p>
                  <p className="text-muted-foreground">$99/month • Billed monthly</p>
                </div>
                <Badge variant={subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                  {profile.subscription_status 
                    ? profile.subscription_status.charAt(0).toUpperCase() + profile.subscription_status.slice(1)
                    : 'Inactive'
                  }
                </Badge>
              </div>
            

              <div className="flex gap-4">
                <Button variant="outline">Manage Subscription</Button>
                <Button variant="outline">Update Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}