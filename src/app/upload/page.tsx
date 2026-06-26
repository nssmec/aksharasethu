import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { uploadDocumentAction } from '@/actions/documents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadCloud } from 'lucide-react'

export default async function UploadPage() {
    // Guard Boundary: Ensure only logged-in volunteers can access this staging path
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Pull your active category entities concurrently on the server
    const categories = await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
    })

    return (
        <main className="max-w-2xl mx-auto py-16 px-6 min-h-screen bg-[#fafafa]">
            <div className="space-y-2 mb-10">
                <h1 className="text-3xl font-serif font-normal tracking-tight text-neutral-900">Volunteer Upload Workspace</h1>
                <p className="text-neutral-500 text-xs leading-relaxed">
                    Staging channel for Aksharasethu library assets. Uploads will be automatically organized into target Google Drive cloud sub-folders on submission.
                </p>
            </div>

            <form action={uploadDocumentAction} className="space-y-6 bg-white p-8 rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Document Title</label>
                    <Input name="title" required placeholder="e.g., Operating Systems Complete Lecture Repository" className="rounded-xl border-neutral-200 text-sm h-10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Asset Category</label>
                        <select name="categoryId" required className="w-full h-10 rounded-xl border border-neutral-200 text-xs px-3 bg-white outline-none focus:border-neutral-950 transition-all">
                            <option value="" disabled selected>Select catalog placement...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Academic Department</label>
                        <Input name="department" required placeholder="e.g., CSE / ECE" className="rounded-xl border-neutral-200 text-sm h-10" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Semester</label>
                        <Input name="semester" required placeholder="e.g., S4 / Open Resource" className="rounded-xl border-neutral-200 text-sm h-10" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Subject Code / Name</label>
                        <Input name="subject" required placeholder="e.g., CST 202" className="rounded-xl border-neutral-200 text-sm h-10" />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Academic Session Year</label>
                        <Input name="academicYear" required placeholder="e.g., 2026-2027" className="rounded-xl border-neutral-200 text-sm h-10" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Author / Resource Origin</label>
                        <Input name="author" placeholder="Optional" className="rounded-xl border-neutral-200 text-sm h-10" />
                    </div>
                </div>

                {/* Streaming Dropzone Box */}
                <div className="border border-dashed border-neutral-200 rounded-2xl p-8 text-center bg-neutral-50/40 hover:bg-neutral-50 transition-all duration-200">
                    <UploadCloud className="mx-auto h-7 w-7 text-neutral-400 mb-2" />
                    <input
                        type="file"
                        name="file"
                        accept="application/pdf"
                        required
                        className="text-xs text-neutral-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-neutral-900 file:text-white hover:file:bg-neutral-800 cursor-pointer"
                    />
                    <p className="text-[10px] text-neutral-400 mt-2">Only native multi-page PDF documents up to 25MB are compiled.</p>
                </div>

                <Button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl h-11 font-medium text-xs shadow-sm transition-all">
                    Push Asset to Google Drive & Supabase
                </Button>
            </form>
        </main>
    )
}