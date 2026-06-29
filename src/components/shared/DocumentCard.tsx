import Link from 'next/link'
import { FileText, ArrowUpRight, HardDrive } from 'lucide-react'

interface DocumentCardProps {
    document: {
        id: string
        title: string
        departments: string[]
        semester: string | null
        subject: string | null
        size: number
        category: { name: string }
    }
}

export default function DocumentCard({ document }: DocumentCardProps) {
    // Convert binary file bytes to standard, readable MB allocations
    const fileSizeInMB = (document.size / (1024 * 1024)).toFixed(2)

    return (
        <div className="group relative bg-white border border-neutral-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.02)] hover:border-neutral-200 flex flex-col justify-between min-h-47.5">
            <div className="space-y-3">
                {/* Upper Tags Array Group */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-medium tracking-wide text-neutral-500 bg-neutral-50 border border-neutral-150 px-2 py-0.5 rounded-md">
                        {document.category.name}
                    </span>
                    <span className="text-[10px] font-medium tracking-wide text-neutral-400">
                        {document.departments.join(' • ')} • {document.semester}
                    </span>
                </div>

                {/* Core Typography Title Mapping */}
                <Link href={`/library/${document.id}`} className="block focus:outline-none">
                    <h3 className="font-serif font-medium text-base text-neutral-900 leading-snug tracking-tight group-hover:text-neutral-700 transition-colors flex items-start gap-1">
                        <span className="line-clamp-2">{document.title}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-150 transition-all text-neutral-400 shrink-0 mt-0.5" />
                    </h3>
                </Link>
            </div>

            {/* Footer Meta Metrics Block */}
            <div className="border-t border-neutral-50 pt-4 mt-4 flex items-center justify-between text-[11px] text-neutral-400 font-sans">
                <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-neutral-300" />
                    <span className="truncate max-w-30 font-medium text-neutral-500">{document.subject}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3 text-neutral-300" /> {fileSizeInMB} MB
                    </span>
                </div>
            </div>
        </div>
    )
}