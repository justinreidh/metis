// components/LogoutButton.tsx
'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <Button 
      variant="ghost" 
      className="w-full justify-start text-muted-foreground hover:text-foreground"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4 mr-3" />
      Sign Out
    </Button>
  )
}