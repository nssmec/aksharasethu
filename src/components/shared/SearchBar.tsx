'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search, Loader2 } from 'lucide-react'

export default function SearchBar() {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [isPending, startTransition] = useTransition()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return

        startTransition(() => {
            router.push(`/library?search=${encodeURIComponent(query.trim())}`)
        })
    }

    return (
        <form onSubmit={handleSearch} className="relative w-full group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400 group-focus-within:text-neutral-900 transition-colors">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents by subject, title, code, or department..."
                className="w-full h-12 pl-11 pr-4 bg-white border border-neutral-200 focus:border-neutral-950 text-sm rounded-xl placeholder:text-neutral-400 outline-none transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.01)] focus:shadow-[0_4px_16px_rgba(0,0,0,0.02)] font-sans"
            />
        </form>
    )
}