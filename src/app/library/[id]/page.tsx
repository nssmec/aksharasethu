import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink, Calendar, HardDrive, Eye, Download } from 'lucide-react'

interface DocumentPageProps {
    params: Promise<{ id: string }>
}

export default async function DocumentDetailPage({ params }: DocumentPageProps) {
    const { id } = await params

    // 1. Fetch document and update views concurrently
    const document = await prisma.document.update({
        where: { id },
        data: { views: { increment: 1 } },
        include: {
            category: { select: { name: true } },
            uploader: { select: { name: true } }
        }
    }).catch(() => null)

    if (!document || document.status !== 'APPROVED') {
        notFound()
    }

    const fileSizeInMB = (document.size / (1024 * 1024)).toFixed(2)

    return (
        <main className="min-h-screen bg-[#fafafa] py-12 px-6 lg:px-16 max-w-7xl mx-auto space-y-8">
            {/* Top Breadcrumb Navigation */}
            <Link href="/library" className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-900 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to registry catalog
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column: Information Pane */}
                <section className="space-y-6 bg-white p-8 rounded-2xl border border-neutral-100 shadow-[0_4px_24px_rgba(0,0,0,0.01)] lg:sticky lg:top-24">
                    <div className="space-y-3">
                        <span className="text-[10px] font-medium tracking-wide text-neutral-500 bg-neutral-50 border border-neutral-150 px-2 py-0.5 rounded-md">
                            {document.category.name}
                        </span>
                        <h1 className="text-2xl font-serif font-medium tracking-tight text-neutral-900 leading-snug">
                            {document.title}
                        </h1>
                        <p className="text-xs text-neutral-400 font-sans">
                            Contributed by <span className="font-medium text-neutral-600">{document.uploader.name}</span>
                        </p>
                    </div>

                    {document.description && (
                        <p className="text-xs text-neutral-500 leading-relaxed pt-2 border-t border-neutral-50">
                            {document.description}
                        </p>
                    )}

                    {/* Metadata Matrix Grid */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-50 text-[11px] font-sans">
                        <div className="space-y-0.5">
                            <span className="text-neutral-400 font-medium">Department</span>
                            <p className="font-medium text-neutral-800">{document.departments}</p>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-neutral-400 font-medium">Semester</span>
                            <p className="font-medium text-neutral-800">{document.semester}</p>
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-neutral-400 font-medium">Subject Module</span>
                            <p className="font-medium text-neutral-800 truncate max-w-30">{document.subject}</p>
                        </div>
                    </div>

                    {/* Core Interactor Action Options */}
                    <div className="space-y-3 pt-4">
                        <a href={document.driveLink} target="_blank" rel="noopener noreferrer" className="block">
                            <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium h-10 rounded-xl shadow-sm flex items-center justify-center gap-2">
                                <Download className="w-3.5 h-3.5" /> Download Asset File
                            </Button>
                        </a>

                        <a href={document.driveLink} target="_blank" rel="noopener noreferrer" className="block">
                            <Button variant="outline" className="w-full text-xs font-medium h-10 rounded-xl border-neutral-200 hover:bg-neutral-50 text-neutral-600 flex items-center justify-center gap-2">
                                Open in Google Drive <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                            </Button>
                        </a>
                    </div>

                    {/* Quick Telemetry Indicators */}
                    <div className="flex items-center justify-around text-[11px] text-neutral-400 border-t border-neutral-50 pt-4 font-sans">
                        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {document.views} Views</span>
                        <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" /> {fileSizeInMB} MB</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(document.createdAt).toLocaleDateString()}</span>
                    </div>
                </section>

                {/* Right Column: PDF Embed Reader Frame */}
                <section className="lg:col-span-2 w-full h-150 lg:h-190 bg-white rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.01)] overflow-hidden relative group">
                    <iframe
                        src={document.previewLink}
                        className="w-full h-full border-none rounded-2xl"
                        allow="autoplay; encrypted-media"
                        loading="lazy"
                        title={`Preview iframe workspace - ${document.title}`}
                    />
                </section>
            </div>
        </main>
    )
}