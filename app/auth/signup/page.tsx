'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client' // Adapt path to your setup

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/welcome`, // Redirect after confirmation; whitelist in dashboard
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Check your email for the confirmation link!')
      console.log('User signed up:', data.user)
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p>{message}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}