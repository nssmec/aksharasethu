import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DocumentNotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-[#fafafa]">
            <div className="space-y-3 max-w-sm">
                <h2 className="text-xl font-serif font-medium text-neutral-900">Resource unavailable</h2>
                <p className="text-xs text-neutral-500 leading-relaxed">
                    The requested asset could not be located, or it is currently undergoing structural verification checking by library administration.
                </p>
                <div className="pt-2">
                    <Link href="/library">
                        <Button size="sm" className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs px-4 h-9">
                            Return to Catalog Explorer
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}