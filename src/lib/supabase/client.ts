import { createBrowserClient } from '@supabase/ssr'

/**
 * Singleton instance constructor to safely interact with Supabase auth sessions
 * and storage systems from inside Next.js Client Components ('use client').
 */
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}