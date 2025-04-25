import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth Callback - Event:', event)
      console.log('Auth Callback - Session:', !!session)

      if (event === 'SIGNED_IN' && session) {
        // Wait a brief moment to ensure session is properly set
        await new Promise(resolve => setTimeout(resolve, 1000))
        router.push('/properties/map')
      }
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Completing login...</h2>
        <p className="text-muted-foreground">Please wait while we verify your login.</p>
      </div>
    </div>
  )
}
