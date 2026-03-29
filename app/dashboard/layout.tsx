import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  // If there's an error or no authenticated user → redirect to login
  if (error || !user) {
    redirect('/auth/login') 
  }

  // User is authenticated → render the layout + children (pages)
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}