import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Clandestine Vault | Batch 001',
  description: 'Exclusive access page for Batch 001 allocation.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Batch001Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#E0E6ED] antialiased">
      {children}
    </div>
  )
}