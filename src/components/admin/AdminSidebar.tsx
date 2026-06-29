'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    BookOpen,
    Users,
    CheckCircle2,
    Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Pending Documents',
        href: '/dashboard/documents',
        icon: BookOpen,
    },
    {
        title: 'Users',
        href: '/dashboard/users',
        icon: Users,
    },
    {
        title: 'Approved Documents',
        href: '/dashboard/approved',
        icon: CheckCircle2,
    },
    {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
    },
]

export default function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-72 border-r border-neutral-200 bg-white h-screen sticky top-0 flex flex-col">
            <div className="px-6 py-8 border-b border-neutral-100">
                <h1 className="text-xl font-semibold tracking-tight">
                    Aksharasethu
                </h1>

                <p className="text-xs text-neutral-500 mt-1">
                    Administration Panel
                </p>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {items.map((item) => {
                    const Icon = item.icon

                    const active =
                        pathname === item.href ||
                        pathname.startsWith(item.href + '/')

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
                                active
                                    ? 'bg-neutral-900 text-white'
                                    : 'text-neutral-600 hover:bg-neutral-100'
                            )}
                        >
                            <Icon className="w-5 h-5" />

                            {item.title}
                        </Link>
                    )
                })}
            </nav>

            <div className="border-t border-neutral-100 p-5">
                <p className="text-xs text-neutral-400">
                    Aksharasethu Admin v1.0
                </p>
            </div>
        </aside>
    )
}