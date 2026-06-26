'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uploadDocumentAction } from '@/actions/documents'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UploadCloud, Loader2 } from 'lucide-react'

interface CategoryItem {
    id: string
    name: string
}

// Fixed institution department structures including specific reading day variations
const ACADEMIC_DEPARTMENTS = ['CS', 'CU', 'EC', 'EEE', 'MECH', 'EB', 'EV']

export default function UploadPage() {
    const router = useRouter()
    const [categories, setCategories] = useState<CategoryItem[]>([])
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
    const [selectedDepts, setSelectedDepts] = useState<string[]>([])
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const initializePage = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                router.push('/login')
                return
            }
            setIsCheckingAuth(false)

            try {
                const res = await fetch('/api/categories')
                const data = await res.json()
                setCategories(data)
            } catch (err) {
                console.error('Failed to load categories context maps:', err)
            }
        }

        initializePage()
    }, [router])

    // Toggle department inside array selection map state
    const toggleDepartment = (dept: string) => {
        setSelectedDepts((prev) =>
            prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
        )
    }

    const selectedCategoryName = categories.find(c => c.id === selectedCategoryId)?.name || ''
    const isAcademicSelected = selectedCategoryName.toLowerCase() === 'academics'

    if (isCheckingAuth) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
                <span className="text-xs text-neutral-400">Verifying volunteer token mappings...</span>
            </div>
        )
    }

    return (
        <main className="max-w-2xl mx-auto py-16 px-6 min-h-screen bg-[#fafafa]">
            <div className="space-y-2 mb-10">
                <h1 className="text-3xl font-serif font-normal tracking-tight text-neutral-900">
                    Digital Library Ingestion Desk
                </h1>
                <p className="text-neutral-500 text-xs leading-relaxed font-light">
                    Reading Day digital archive portal. Volunteers can seamlessly contribute text files, novels, reference manuals, and local publications.
                </p>
            </div>

            <form
                onSubmit={() => setIsSubmitting(true)}
                action={uploadDocumentAction}
                className="space-y-6 bg-white p-8 rounded-2xl border border-neutral-100 shadow-[0_8px_30px_rgb(0,0,0,0.012)]"
            >
                {/* Core Metadata Frame */}
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

                {/* Dynamic Section: Renders academic controls exclusively when Academics is focused */}
                {isAcademicSelected ? (
                    <div className="space-y-6 p-5 bg-neutral-50/70 border border-neutral-100 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="pb-1 border-b border-neutral-200/60">
                            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">Institutional Curricular Tags</span>
                        </div>

                        {/* Multi-Select Department Badges Block */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Select Departments (Select all that apply)</label>
                            <div className="flex flex-wrap gap-2">
                                {ACADEMIC_DEPARTMENTS.map((dept) => {
                                    const isSelected = selectedDepts.includes(dept)
                                    return (
                                        <button
                                            key={dept}
                                            type="button"
                                            onClick={() => toggleDepartment(dept)}
                                            className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-150 outline-none ${isSelected
                                                ? 'bg-neutral-900 border-neutral-900 text-white shadow-sm'
                                                : 'bg-white border-neutral-200 text-neutral-600 hover:border-neutral-400'
                                                }`}
                                        >
                                            {dept}
                                        </button>
                                    )
                                })}
                            </div>
                            {/* Encoded payload sent safely across form bounds */}
                            <input type="hidden" name="departments" value={JSON.stringify(selectedDepts)} />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Semester Dropdown */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Semester</label>
                                <select
                                    name="semester"
                                    required
                                    className="w-full h-10 rounded-xl border border-neutral-200 text-xs px-3 bg-white outline-none focus:border-neutral-950 transition-all"
                                >
                                    <option value="" disabled selected>Select Sem...</option>
                                    {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map((sem) => (
                                        <option key={sem} value={sem}>{sem}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Subject Code Input */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Subject Code</label>
                                <Input name="subject" required placeholder="e.g., CST 202" className="rounded-xl border-neutral-200 text-sm h-10 bg-white" />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Fallback parameters to prevent Form-Data key loss on general books */
                    <>
                        <input type="hidden" name="departments" value="[]" />
                        <input type="hidden" name="semester" value="" />
                        <input type="hidden" name="subject" value="" />
                    </>
                )}

                {/* Form Description */}
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Short Abstract / Review (Optional)</label>
                    <textarea
                        name="description"
                        placeholder="Provide a brief introductory breakdown of the literature contents..."
                        className="w-full h-20 rounded-xl border border-neutral-200 text-sm p-3 bg-white outline-none focus:border-neutral-950 transition-all resize-none"
                    />
                </div>

                {/* Dropzone Upload Mechanism */}
                <div className="border border-dashed border-neutral-200 rounded-2xl p-8 text-center bg-neutral-50/40 hover:bg-neutral-50 transition-all duration-200">
                    <UploadCloud className="mx-auto h-7 w-7 text-neutral-400 mb-2" />
                    <input
                        type="file"
                        name="file"
                        accept="application/pdf"
                        required
                        className="text-xs text-neutral-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-neutral-900 file:text-white hover:file:bg-neutral-800 cursor-pointer"
                    />
                    <p className="text-[10px] text-neutral-400 mt-2">Only multi-page PDF records up to 25MB are parsed securely.</p>
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl h-11 font-medium text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Ingesting Asset Stream...
                        </>
                    ) : (
                        'Publish to Reading Day Staging Registry'
                    )}
                </Button>
            </form>
        </main>
    )
}