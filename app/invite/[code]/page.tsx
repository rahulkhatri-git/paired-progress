"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useInvitations } from "@/lib/hooks/usePartnership"

export default function InvitePage({ params }: { params: { code: string } }) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { acceptInvitation } = useInvitations()
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for invalid code
    if (!params.code || params.code === 'undefined' || params.code.length < 6) {
      setError('Invalid invitation code. Please ask your partner for a new invite link.')
      return
    }

    if (authLoading) return

    // Not logged in - redirect to home with invite code in URL
    if (!user) {
      router.push(`/?invite=${params.code}`)
      return
    }

    // Logged in - auto-accept invitation
    handleAutoAccept()
  }, [user, authLoading, params.code, router])

  const handleAutoAccept = async () => {
    if (accepting) return
    
    setAccepting(true)
    setError(null)

    try {
      const success = await acceptInvitation(params.code)
      
      if (success) {
        // Refresh page to show partnership
        window.location.href = '/dashboard'
      } else {
        setError('Failed to accept invitation. The code may be invalid or expired.')
      }
    } catch (err: any) {
      console.error('Error accepting invitation:', err)
      setError(err.message || 'An error occurred while accepting the invitation.')
    } finally {
      setAccepting(false)
    }
  }

  if (authLoading || accepting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            {authLoading ? 'Loading...' : 'Accepting Invitation...'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {authLoading ? 'Checking authentication...' : 'Setting up your partnership...'}
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 mx-auto">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-foreground">Invitation Failed</h2>
          <p className="mb-6 text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return null
}
