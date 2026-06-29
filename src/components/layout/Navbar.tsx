'use client' // 👈 Essential for hooks

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSession, signOut } from '@/lib/auth-client'
import Image from 'next/image'

export default function Navbar() {
    // Better Auth client hook
    const { data: session, isPending } = useSession()

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-100 px-6 lg:px-16 h-16 flex items-center justify-between transition-all">
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <Image src="/logo.png" alt="Aksharasethu Logo" width={32} height={32} className="rounded-full" />
                    <span className="font-medium text-sm tracking-tight text-neutral-900 font-sans">
                        aksharasethu
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-500">
                    <Link href="/library" className="hover:text-neutral-900 transition-colors">Browse Catalog</Link>
                    <Link href="/collections" className="hover:text-romans-neutral-900 transition-colors">Curated Hubs</Link>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                {isPending ? (
                    <div className="w-20 h-8 bg-neutral-100 animate-pulse rounded-lg" />
                ) : session ? (
                    <div className="flex items-center gap-4">
                        {(session.user.role === "VOLUNTEER" || session.user.role === "ADMIN") && (
                            <Link href="/upload">
                                <Button size="sm" className="h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs px-3 font-medium transition-all shadow-sm">
                                    Upload Asset
                                </Button>
                            </Link>
                        )}
                        {session.user.role === "ADMIN" && (
                            <Link href="/dashboard" className="text-xs text-neutral-600 hover:text-neutral-900 font-medium">
                                Admin Panel
                            </Link>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-neutral-400 hover:text-red-600 transition-colors"
                            onClick={async () => await signOut()}
                        >
                            Sign Out
                        </Button>
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