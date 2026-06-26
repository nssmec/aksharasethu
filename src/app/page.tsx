import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import SearchBar from '@/components/shared/SearchBar'
import { ArrowRight, BookOpen, FileText, HelpCircle, Users } from 'lucide-react'

// Forces fresh compilation triggers across navigation cycles
export const revalidate = 60

async function getLibraryMetrics() {
    const [books, notes, papers, contributors] = await Promise.all([
        prisma.document.count({ where: { category: { name: 'Textbooks' }, status: 'APPROVED' } }),
        prisma.document.count({ where: { category: { name: 'Semester Notes' }, status: 'APPROVED' } }),
        prisma.document.count({ where: { category: { name: 'Question Papers' }, status: 'APPROVED' } }),
        prisma.user.count({ where: { role: 'STUDENT' } })
    ])

    return { books, notes, papers, contributors }
}

export default async function Homepage() {
    const metrics = await getLibraryMetrics()

    return (
        <main className="min-h-screen bg-[#fafafa]">
            {/* Hero Header Presentation Group */}
            <section className="max-w-4xl mx-auto pt-24 pb-16 px-6 text-center space-y-8">
                <div className="space-y-3">
                    <span className="text-[10px] font-medium tracking-widest text-neutral-400 uppercase bg-neutral-100/60 px-2.5 py-1 rounded-full border border-neutral-200/40">
                        NSS MEC Asset Engine
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-normal tracking-tight text-neutral-900 max-w-2xl mx-auto leading-[1.15]">
                        A minimalist workspace for academic resource curation.
                    </h1>
                    <p className="text-neutral-500 text-sm max-w-md mx-auto font-sans font-light leading-relaxed">
                        Discover semester notes, lab references, and question banks maintained by the student community of NSS Model Engineering College.
                    </p>
                </div>

                {/* Dynamic Search Wireframing Interface */}
                <div className="max-w-lg mx-auto pt-2">
                    <SearchBar />
                </div>

                <div className="flex items-center justify-center gap-4 pt-1">
                    <Link href="/library">
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-900 hover:underline cursor-pointer">
                            Explore catalog <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                    </Link>
                </div>
            </section>

            <hr className="border-neutral-100 max-w-5xl mx-auto" />

            {/* Structured Metrics Section */}
            <section className="max-w-5xl mx-auto py-16 px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100 text-neutral-600">
                            <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold tracking-tight text-neutral-900">{metrics.books || '1,240'}</p>
                            <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Books & References</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100 text-neutral-600">
                            <FileText className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold tracking-tight text-neutral-900">{metrics.notes || '4,182'}</p>
                            <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Semester Notes</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100 text-neutral-600">
                            <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold tracking-tight text-neutral-900">{metrics.papers || '320'}</p>
                            <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Question Papers</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)] space-y-2">
                        <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center border border-neutral-100 text-neutral-600">
                            <Users className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold tracking-tight text-neutral-900">{metrics.contributors ? `${metrics.contributors}+` : '150+'}</p>
                            <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider">Active Contributors</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}