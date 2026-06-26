import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/actions/auth'
import { Button } from '@/components/ui/button'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 lg:px-16 h-16 flex items-center justify-between transition-all">
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                        <span className="text-white font-serif text-sm font-semibold">A</span>
                    </div>
                    <span className="font-medium text-sm tracking-tight text-neutral-900 font-sans">
                        aksharasethu
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-500">
                    <Link href="/library" className="hover:text-neutral-900 transition-colors">Browse Catalog</Link>
                    <Link href="/collections" className="hover:text-neutral-900 transition-colors">Curated Hubs</Link>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                        <Link href="/upload">
                            <Button size="sm" className="h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs px-3 font-medium transition-all shadow-sm">
                                Upload Asset
                            </Button>
                        </Link>
                        <Link href="/profile" className="text-xs text-neutral-600 hover:text-neutral-900 font-medium">
                            Dashboard
                        </Link>
                        <form action={signOut}>
                            <button type="submit" className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors">
                                Sign Out
                            </button>
                        </form>
                    </div>
                ) : (
                    <Link href="/login">
                        <Button size="sm" variant="ghost" className="h-8 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-lg px-3">
                            Volunteer Login
                        </Button>
                    </Link>
                )}
            </div>
        </header>
    )
}