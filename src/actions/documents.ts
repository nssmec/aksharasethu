'use server'

import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Extracts a unique file ID from common Google Drive link structures
 */
function extractDriveFileId(url: string): string {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (!match || !match[1]) {
        throw new Error('Validation failure: Invalid Google Drive file URL format.')
    }
    return match[1]
}

export async function uploadDocumentAction(formData: FormData) {
    let successfullyUploaded = false

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        if (!session) {
            redirect('/login')
        }

        const user = session.user
        const driveUrl = formData.get('driveUrl') as string
        const title = formData.get('title') as string
        const categoryId = formData.get('categoryId') as string
        const author = formData.get('author') as string || ''
        const description = formData.get('description') as string || ''

        if (!driveUrl) throw new Error('Validation failure: Missing sharing URL.')

        // 1. Isolate target tracking markers using regex constraints
        const driveFileId = extractDriveFileId(driveUrl)

        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            select: { id: true, name: true }
        })
        if (!category) throw new Error('Validation error: Invalid classification target.')

        const isAcademic = category.name.toLowerCase() === 'academics'
        let departments: string[] = []
        let semester: string | null = null
        let subject: string | null = null

        if (isAcademic) {
            const departmentsRaw = formData.get('departments') as string
            departments = departmentsRaw ? JSON.parse(departmentsRaw) : []
            if (departments.length === 0) throw new Error('Please link at least one department.')

            semester = (formData.get('semester') as string || '').trim().toUpperCase()
            subject = (formData.get('subject') as string || '').trim().toUpperCase()
            if (!semester || !subject) throw new Error('Missing academic indexing definitions.')
        }

        // 2. Map cleanly directly down to Supabase without moving files
        await prisma.document.create({
            data: {
                title: title.trim(),
                description: description.trim() || `Shared inside ${category.name} track collection index.`,
                departments,
                semester,
                subject,
                author: author.trim() || 'Shared Contributor',
                driveFileId,
                driveLink: `https://drive.google.com/file/d/${driveFileId}/view?usp=sharing`,
                previewLink: `https://drive.google.com/file/d/${driveFileId}/preview`,
                size: 0, // Assigned 0 bytes since hosted externally
                status: 'PENDING',
                uploadedBy: user.id,
                categoryId: category.id,
            },
        })

        successfullyUploaded = true
        revalidatePath('/library')
        revalidatePath('/')
    } catch (error: unknown) {
        console.error('Link registration fault:', (error as Error).message)
        redirect(`/upload?error=${encodeURIComponent((error as Error).message || 'Registration failure')}`)
    }

    if (successfullyUploaded) {
        redirect('/library?upload_success=true')
    }
}