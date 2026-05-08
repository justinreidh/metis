// app/dashboard/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'

type Profile = {
  first_name: string
  last_name: string
  company_name: string
  subscription_status: string
  trial_ends_at: string | null
  next_invoice_at: string | null
  cancel_at_period_end: boolean
}

export default function SettingsPage() {
  const supabase = createClient()

  const [profile, setProfile] = useState<Profile>({
    first_name: '',
    last_name: '',
    company_name: '',
    subscription_status: '',
    trial_ends_at: null,
    next_invoice_at: null,
    cancel_at_period_end: false,
  })

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      try {
        setLoading(true)
        setError(null)

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !user) {
          throw new Error('You must be logged in to view settings')
        }

        setEmail(user.email ?? '')

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            first_name,
            last_name,
            company_name,
            subscription_status,
            trial_ends_at,
            next_invoice_at,
            cancel_at_period_end
          `)
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        setProfile({
          first_name: profileData?.first_name ?? '',
          last_name: profileData?.last_name ?? '',
          company_name: profileData?.company_name ?? '',
          subscription_status: profileData?.subscription_status ?? '',
          trial_ends_at: profileData?.trial_ends_at ?? null,
          next_invoice_at: profileData?.next_invoice_at ?? null,
          cancel_at_period_end: profileData?.cancel_at_period_end ?? false,
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
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('profiles').upsert({
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

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session')
      }

      window.location.href = data.url
    } catch (err: any) {
      alert(err.message)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'

    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        Loading your settings...
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-red-500">{error}</div>
    )
  }

  const showNextBillingDate =
    !!profile.next_invoice_at &&
    !profile.cancel_at_period_end &&
    profile.subscription_status !== 'canceled'

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account and organization preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full px-4 sm:px-6 lg:px-8">
        <TabsList className="mb-10 grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your account details
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        first_name: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={profile.last_name}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        last_name: e.target.value,
                      })
                    }
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

        <TabsContent value="company">
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your organization details
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={profile.company_name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      company_name: e.target.value,
                    })
                  }
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Saving...' : 'Update Company Info'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>
                Manage your plan and payment method
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex justify-between items-center p-6 border rounded-2xl bg-card">
                <div>
                  <p className="font-medium text-lg">Professional Plan</p>
                  <p className="text-muted-foreground">
                    $99/month • Billed monthly
                  </p>
                </div>

                <Badge
                  variant={
                    profile.subscription_status === 'active'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {profile.subscription_status
                    ? profile.subscription_status.charAt(0).toUpperCase() +
                      profile.subscription_status.slice(1)
                    : 'Inactive'}
                </Badge>
              </div>

              <div className="space-y-4">
                {profile.subscription_status === 'trialing' &&
                  profile.trial_ends_at && (
                    <div className="p-4 border rounded-xl bg-muted/30">
                      <p className="font-medium">Free Trial Ends</p>
                      <p className="text-muted-foreground">
                        {formatDate(profile.trial_ends_at)}
                      </p>
                    </div>
                  )}

                {profile.cancel_at_period_end &&
                  profile.trial_ends_at && (
                    <div className="p-4 border rounded-xl bg-yellow-50">
                      <p className="font-medium">Trial Canceled</p>
                      <p className="text-muted-foreground">
                        Your free trial will end on{' '}
                        {formatDate(profile.trial_ends_at)}.
                        You will not be billed.
                      </p>
                    </div>
                  )}

                {showNextBillingDate && (
                  <div className="p-4 border rounded-xl bg-muted/30">
                    <p className="font-medium">Next Billing Date</p>
                    <p className="text-muted-foreground">
                      {formatDate(profile.next_invoice_at)}
                    </p>
                  </div>
                )}
              </div>

              {profile.subscription_status !== 'inactive' && (
                <Button
                  variant="outline"
                  onClick={handleManageSubscription}
                >
                  Manage Subscription
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}