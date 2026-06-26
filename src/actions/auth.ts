'use lock'
'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signInWithGoogle() {
    const supabase = await createClient()
    const origin = (await headers()).get('origin') ?? 'http://localhost:3000'

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            // Redirect back straight to your API router callback endpoint
            redirectTo: `${origin}/api/auth/callback`,
        },
    })

    if (error) {
        console.error('OAuth initiation breakdown:', error.message)
        redirect('/login?error=initiation_failed')
    }

    if (data.url) {
        redirect(data.url) // Hands over execution to the 303 redirect
    }
}
export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/')
}