import { createClient } from '@/lib/supabase/server' // Use server client
import LogoutButton from '../components/LogoutButton'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return <p>Please log in to access the dashboard.</p>
  }

  return (
    <div>
        <h1>Welcome, {user.email}!</h1>
        <LogoutButton />
    </div>
  )
}