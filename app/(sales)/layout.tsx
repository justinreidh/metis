// app/(marketing)/layout.tsx
import Navbar from '@/components/Navbar'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-20">
        {children}
      </main>
    </div>
  )
}