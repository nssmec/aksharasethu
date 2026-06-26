'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FilterSidebarProps {
    categories: { id: string; name: string }[]
}

export default function FilterSidebar({ categories }: FilterSidebarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== 'ALL') {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`/library?${params.toString()}`)
    }

    return (
        <aside className="w-full md:w-64 shrink-0 space-y-6 bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] self-start">
            <div className="pb-2 border-b border-neutral-50">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Refine Catalog</h4>
            </div>

            {/* Category Dropdown Selection Filter */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-500">Resource Category</label>
                <Select
                    value={searchParams.get('category') || 'ALL'}
                    onValueChange={(val) => updateFilter('category', val)}
                >
                    <SelectTrigger className="w-full rounded-xl border-neutral-200 text-xs h-9 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-neutral-150">
                        <SelectItem value="ALL" className="text-xs">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id} className="text-xs">{cat.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Department Dropdown Selection Filter */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-500">Academic Department</label>
                <Select
                    value={searchParams.get('department') || 'ALL'}
                    onValueChange={(val) => updateFilter('department', val)}
                >
                    <SelectTrigger className="w-full rounded-xl border-neutral-200 text-xs h-9 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-neutral-150">
                        <SelectItem value="ALL" className="text-xs">All Departments</SelectItem>
                        <SelectItem value="CSE" className="text-xs">Computer Science (CSE)</SelectItem>
                        <SelectItem value="ECE" className="text-xs">Electronics & Comm (ECE)</SelectItem>
                        <SelectItem value="EEE" className="text-xs">Electrical & Electronics (EEE)</SelectItem>
                        <SelectItem value="MECH" className="text-xs">Mechanical Eng (MECH)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Semester Dropdown Selection Filter */}
            <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-neutral-500">Target Semester</label>
                <Select
                    value={searchParams.get('semester') || 'ALL'}
                    onValueChange={(val) => updateFilter('semester', val)}
                >
                    <SelectTrigger className="w-full rounded-xl border-neutral-200 text-xs h-9 focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="All Semesters" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-neutral-150">
                        <SelectItem value="ALL" className="text-xs">All Semesters</SelectItem>
                        {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map((sem) => (
                            <SelectItem key={sem} value={sem} className="text-xs">{sem}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Clear Active Filters Quick-Action Helper */}
            {searchParams.toString() && (
                <button
                    onClick={() => router.push('/library')}
                    className="w-full text-center text-[11px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors pt-2 block"
                >
                    Clear all active parameters
                </button>
            )}
        </aside>
    )
}