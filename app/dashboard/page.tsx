'use client'

import { createClient } from '@/lib/supabase/client'  // ← browser client
import { useEffect, useState, FormEvent } from 'react'

export default function Dashboard() {
  const [candidates, setCandidates] = useState<any[]>([]) // TODO: replace 'any' with your Candidate type
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()  

  useEffect(() => {
    async function fetchCandidates() {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()

      if (!session?.user) {
        setError('Not authenticated')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('company_id', session.user.id)  // safer: use session.user.id

      if (error) {
        console.error('Fetch error:', error)
        setError(error.message)
      } else {
        setCandidates(data || [])
      }
      setLoading(false)
    }

    fetchCandidates()
  }, [supabase]) // supabase is stable, but included for completeness

  async function handleAddCandidate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value

    if (!name || !email) {
      alert('Name and email are required')
      return
    }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      alert('Not authenticated')
      return
    }

    const { error } = await supabase.from('candidates').insert({
      company_id: session.user.id,
      name,
      email,
      // status: 'pending', // add default if needed
    })

    if (error) {
      console.error('Insert error:', error)
      alert('Failed to add candidate: ' + error.message)
    } else {
      alert('Candidate added!')
      form.reset()
      // Optional: refetch candidates
      // fetchCandidates() or update state optimistically
    }
  }

  async function generateLink(candidateId: number | string) {
    const { data, error } = await supabase
      .from('candidates')
      .select('token')
      .eq('id', candidateId)
      .single()

    if (error || !data?.token) {
      alert('Failed to get token: ' + (error?.message || 'No token'))
      return
    }

    const link = `${window.location.origin}/test?token=${data.token}`
    try {
      await navigator.clipboard.writeText(link)
      alert(`Link copied to clipboard!\n\n${link}`)
      // Optional: you can later replace alert with a toast / UI feedback
    } catch (err) {
      console.error('Failed to copy:', err)
      // Fallback: still show the link so user can manually copy
      alert(`Could not copy automatically (browser may block it).\n\nLink:\n${link}\n\nPlease copy it manually.`)
    }
    // In production: call a server action or API route to email it securely
  }

  if (loading) return <div>Loading candidates...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>Dashboard</h1>

      <ul>
        <form onSubmit={handleAddCandidate}>
            <input name="name" placeholder="Candidate Name" required />
            <input name="email" type="email" placeholder="Candidate Email" required />
            <button type="submit">Add Candidate</button>
        </form>
        <h1>Candidates</h1>
        {candidates.map((c) => (
          <li key={c.id}>
            {c.name} - Status: {c.status || 'N/A'}
            <button onClick={() => generateLink(c.id)}>Send Link</button>
            <a href={`/candidate/${c.id}`}>View Results</a>
          </li>
        ))}
      </ul>

      
    </div>
  )
}