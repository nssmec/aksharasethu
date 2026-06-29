'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { uploadDocumentAction } from '@/actions/documents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link2, Loader2 } from 'lucide-react'

interface CategoryItem {
    id: string
    name: string
}

const ACADEMIC_DEPARTMENTS = ['CS', 'CU', 'EC', 'EEE', 'MECH', 'EB', 'EV']

export default function UploadPage() {
    const router = useRouter()

    const { data: session, isPending } = useSession()

    const [categories, setCategories] = useState<CategoryItem[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState('')
    const [selectedDepts, setSelectedDepts] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isPending) return

        if (!session) {
            router.replace('/login')
            return
        }

        if (
            session.user.role !== "VOLUNTEER" &&
            session.user.role !== "ADMIN"
        ) {
            router.replace('/');
        }

        const loadCategories = async () => {
            try {
                const res = await fetch('/api/categories')
                const data = await res.json()
                setCategories(data)
            } catch (err) {
                console.error('Failed to load categories:', err)
            }
        }

        loadCategories()
    }, [session, isPending, router])

    const toggleDepartment = (dept: string) => {
        setSelectedDepts(prev =>
            prev.includes(dept)
                ? prev.filter(d => d !== dept)
                : [...prev, dept]
        )
    }

    const selectedCategoryName =
        categories.find(c => c.id === selectedCategoryId)?.name || ''

    const isAcademicSelected =
        selectedCategoryName.toLowerCase() === 'academics'

    if (isPending) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
                <span className="text-xs text-neutral-400">
                    Verifying session...
                </span>
            </div>
        )
    }

    if (!session) return null

    return (
        <main className="max-w-2xl mx-auto py-16 px-6 min-h-screen bg-[#fafafa]">
            <div className="space-y-2 mb-10">
                <h1 className="text-3xl font-serif font-normal tracking-tight text-neutral-900">Digital Library Link Desk</h1>
                <p className="text-neutral-500 text-xs font-light leading-relaxed">
                    Reading Day digital index registry. Paste shared public asset URLs below to submit resources for moderation.
                </p>
            </div>

            <form
                onSubmit={() => setIsSubmitting(true)}
                action={uploadDocumentAction}
                className="space-y-6 bg-white p-8 rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.012)]"
            >
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Book or Document Title</label>
                    <Input name="title" required placeholder="e.g., The Alchemist / Compiler Design Core Handbook" className="rounded-xl border-neutral-200 text-sm h-10" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Primary Classification</label>
                        <select
                            name="categoryId"
                            required
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            className="w-full h-10 rounded-xl border border-neutral-200 text-xs px-3 bg-white outline-none focus:border-neutral-950 transition-all"
                        >
                            <option value="" disabled>Select collection track...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Author / Publisher</label>
                        <Input name="author" required placeholder="e.g., Paulo Coelho / Dr. K.P. Mohanan" className="rounded-xl border-neutral-200 text-sm h-10" />
                    </div>
                </div>

                {isAcademicSelected ? (
                    <div className="space-y-6 p-5 bg-neutral-50/70 border border-neutral-100 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="pb-1 border-b border-neutral-200/60">
                            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Institutional Curricular Tags</span>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Target Departments</label>
                            <div className="flex flex-wrap gap-2">
                                {ACADEMIC_DEPARTMENTS.map((dept) => {
                                    const isSelected = selectedDepts.includes(dept)
                                    return (
                                        <button
                                            key={dept}
                                            type="button"
                                            onClick={() => toggleDepartment(dept)}
                                            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${isSelected ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm' : 'bg-white border-neutral-200 text-neutral-600'
                                                }`}
                                        >
                                            {dept}
                                        </button>
                                    )
                                })}
                            </div>
                            <input type="hidden" name="departments" value={JSON.stringify(selectedDepts)} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Semester</label>
                                <select name="semester" required className="w-full h-10 rounded-xl border border-neutral-200 text-xs px-3 bg-white outline-none">
                                    <option value="" disabled selected>Select Sem...</option>
                                    {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map((sem) => (
                                        <option key={sem} value={sem}>{sem}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Subject Code</label>
                                <Input name="subject" required placeholder="e.g., CST 202" className="rounded-xl border-neutral-200 text-sm h-10 bg-white" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <input type="hidden" name="departments" value="[]" />
                        <input type="hidden" name="semester" value="" />
                        <input type="hidden" name="subject" value="" />
                    </>
                )}

                <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Short Abstract / Review (Optional)</label>
                    <textarea name="description" placeholder="Provide a brief introductory breakdown of the literature contents..." className="w-full h-20 rounded-xl border border-neutral-200 text-sm p-3 bg-white outline-none resize-none" />
                </div>

                {/* URL Sharing Entry Point */}
                <div className="space-y-2 p-5 border border-neutral-200/80 rounded-2xl bg-neutral-50/40">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                        <Link2 className="w-4 h-4 text-neutral-400" />
                        <span>Google Drive Share Link</span>
                    </div>
                    <Input
                        type="url"
                        name="driveUrl"
                        required
                        placeholder="https://drive.google.com/file/d/xxxxxx/view?usp=sharing"
                        className="rounded-xl border-neutral-200 text-xs h-11 bg-white"
                    />
                    <p className="text-[10px] text-neutral-400">
                        Make sure permissions are set to <strong>&quot;Anyone with the link can view&quot;</strong> inside Drive before submitting.
                    </p>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl h-11 font-medium text-xs transition-all flex items-center justify-center gap-2"
                >
                    {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Registering Asset Link...</> : 'Register Asset in Library Registry'}
                </Button>
            </form>
        </main>
    )
}