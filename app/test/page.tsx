// app/test/page.tsx
import { Suspense } from 'react'
import TestClient from './TestClient'

export default function TestPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading assessment...</p>
        </div>
      </div>
    }>
      <TestClient />
    </Suspense>
  )
}