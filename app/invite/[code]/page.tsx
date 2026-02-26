"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useInvitations } from "@/lib/hooks/usePartnership"

export default function InvitePage() {
  const router = useRouter()
  const params = useParams()
  const code = params?.code as string | undefined
  const { user, loading: authLoading } = useAuth()
  const { acceptInvitation } = useInvitations()
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'invite/[code]/page.tsx:15',message:'useEffect entry',data:{code,authLoading,hasUser:!!user,userId:user?.id},timestamp:Date.now(),hypothesisId:'A,C,E'})}).catch(()=>{});
    // #endregion

    // Check for invalid code
    if (!code || code === 'undefined' || code.length < 6) {
      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'invite/[code]/page.tsx:18',message:'invalid code detected',data:{code,codeLength:code?.length},timestamp:Date.now(),hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      setError('Invalid invitation code. Please ask your partner for a new invite link.')
      return
    }

    if (authLoading) {
      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'invite/[code]/page.tsx:22',message:'early return: authLoading',data:{authLoading},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      return
    }

    // Not logged in - redirect to home with invite code in URL
    if (!user) {
      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'invite/[code]/page.tsx:26',message:'redirect: no user',data:{redirectUrl:`/?invite=${code}`},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      router.push(`/?invite=${code}`)
      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'invite/[code]/page.tsx:27',message:'router.push called',data:{},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return
    }

    // Logged in - auto-accept invitation
    // #region agent log
    fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'invite/[code]/page.tsx:31',message:'calling handleAutoAccept',data:{userId:user.id},timestamp:Date.now(),hypothesisId:'A,C,E'})}).catch(()=>{});
    // #endregion
    handleAutoAccept()
  }, [user, authLoading, code, router])

  const handleAutoAccept = async () => {
    if (accepting || !code) return
    
    setAccepting(true)
    setError(null)

    try {
      const success = await acceptInvitation(code)
      
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
