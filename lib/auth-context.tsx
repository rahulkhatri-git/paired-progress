'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type AuthContextType = {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'auth-context.tsx:22',message:'auth init start',data:{},timestamp:Date.now(),hypothesisId:'A,E'})}).catch(()=>{});
    // #endregion

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'auth-context.tsx:24',message:'getSession resolved',data:{hasSession:!!session,userId:session?.user?.id},timestamp:Date.now(),hypothesisId:'A,E'})}).catch(()=>{});
      // #endregion
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'auth-context.tsx:28',message:'setLoading(false) called',data:{hasSession:!!session,userId:session?.user?.id},timestamp:Date.now(),hypothesisId:'A,E'})}).catch(()=>{});
      // #endregion
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // #region agent log
      fetch('http://127.0.0.1:7505/ingest/332df1e0-c4c9-4bf4-912e-2754c0aa630c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'41908d'},body:JSON.stringify({sessionId:'41908d',location:'auth-context.tsx:33',message:'auth state change',data:{event:_event,hasSession:!!session,userId:session?.user?.id},timestamp:Date.now(),hypothesisId:'A,E'})}).catch(()=>{});
      // #endregion
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
