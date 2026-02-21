'use client'

import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const handleLogout = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) console.error('Logout error:', error.message)
    else window.location.href = '/'
  }

  return <button onClick={handleLogout}>Log Out</button>
}