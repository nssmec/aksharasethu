import { prisma } from '@/lib/prisma'
import DocumentCard from '@/components/shared/DocumentCard'
import FilterSidebar from '@/components/shared/FilterSidebar'
import SearchBar from '@/components/shared/SearchBar'

interface LibraryPageProps {
    searchParams: Promise<{
        search?: string
        category?: string
        department?: string
        semester?: string
    }>
}

export default async function LibraryPage({ searchParams }: LibraryPageProps) {
    // Resolve runtime route search params parameters safely
    const resolvedParams = await searchParams
    const searchString = resolvedParams.search || ''
    const catFilter = resolvedParams.category || ''
    const deptFilter = resolvedParams.department || ''
    const semFilter = resolvedParams.semester || ''

    // Execute database lookup pipelines concurrently
    const [categories, documents] = await Promise.all([
        prisma.category.findMany({ select: { id: true, name: true } }),
        prisma.document.findMany({
            where: {
                status: 'APPROVED', // Only render documents verified by admin moderators
                AND: [
                    searchString ? {
                        OR: [
                            { title: { contains: searchString, mode: 'insensitive' } },
                            { subject: { contains: searchString, mode: 'insensitive' } },
                            { author: { contains: searchString, mode: 'insensitive' } },
                        ]
                    } : {},
                    catFilter ? { categoryId: catFilter } : {},
                    deptFilter
                        ? {
                            departments: {
                                has: deptFilter,
                            },
                        }
                        : {},
                    semFilter ? { semester: { equals: semFilter, mode: 'insensitive' } } : {},
                ]
            },
            include: { category: { select: { name: true } } },
            orderBy: { createdAt: 'desc' }
        })
    ])

    return (
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-16 min-h-screen space-y-10 bg-[#fafafa]">
            {/* Search Bar Header */}
            <div className="space-y-4 max-w-xl">
                <h1 className="text-3xl font-serif font-normal tracking-tight text-neutral-900">Resource Registry</h1>
                <p className="text-neutral-500 text-xs leading-relaxed">
                    Search across study modules, syllabi references, and evaluation worksheets approved for the current academic session.
                </p>
                <SearchBar />
            </div>

            <div className="flex flex-col md:flex-row gap-8 pt-2">
                {/* Sidebar Navigation */}
                <FilterSidebar categories={categories} />

                {/* Document Asset Grid */}
                <div className="grow">
                    {documents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {documents.map((doc) => (
                                <DocumentCard key={doc.id} document={doc} />
                            ))}
                        </div>
                    ) : (
                        <div className="h-75 bg-white rounded-2xl border border-neutral-100 flex flex-col items-center justify-center text-center p-6 shadow-[0_4px_24px_rgba(0,0,0,0.01)]">
                            <p className="text-sm font-serif text-neutral-800 font-medium">No assets matched your filter rules</p>
                            <p className="text-xs text-neutral-400 mt-1 max-w-60">
                                Try broad terms or clearing active filters to expand your search.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}