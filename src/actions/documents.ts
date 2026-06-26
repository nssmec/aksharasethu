'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { uploadToDrive } from '@/services/google-drive'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

/**
 * Server Action to handle secure background streaming of volunteer uploads 
 * directly to category-specific Google Drive folders and Supabase metadata maps.
 */
export async function uploadDocumentAction(formData: FormData) {
    let successfullyUploaded = false

    try {
        // 1. Authenticate Request Domain
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            throw new Error('Authentication session expired. Please sign in again.')
        }

        // 2. Extract and Validate Form Payload Data
        const file = formData.get('file') as File | null
        const title = formData.get('title') as string
        const categoryId = formData.get('categoryId') as string
        const department = formData.get('department') as string
        const semester = formData.get('semester') as string
        const subject = formData.get('subject') as string
        const academicYear = formData.get('academicYear') as string
        const author = formData.get('author') as string || ''

        if (!file || file.size === 0) {
            throw new Error('Payload error: No valid document file found.')
        }

        if (file.type !== 'application/pdf') {
            throw new Error('Validation error: Only native multi-page PDF assets are permitted.')
        }

        // Guard Constraint: Enforce 25MB file ceiling limits
        const MAX_SIZE = 25 * 1024 * 1024
        if (file.size > MAX_SIZE) {
            throw new Error('Payload allocation error: File size cannot exceed 25MB.')
        }

        // 3. Resolve Category Target Name for Dynamic Drive Folder Trees
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            select: { id: true, name: true }
        })

        if (!category) {
            throw new Error('Validation error: Selected asset placement category is invalid.')
        }

        // 4. Convert Native File Array Buffer into Node.js Buffer Stream Chunk
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // 5. Stream Direct to Google Drive Category Folder System
        const driveAsset = await uploadToDrive(
            buffer,
            file.name,
            file.type,
            category.name
        )

        // 6. Map Metadata Localized inside Supabase Postgres Tables
        await prisma.document.create({
            data: {
                title: title.trim(),
                description: `Uploaded directly into ${category.name} collection tracking stream.`,
                department: department.trim().toUpperCase(),
                semester: semester.trim().toUpperCase(),
                subject: subject.trim().toUpperCase(),
                academicYear: academicYear.trim(),
                author: author.trim() || 'Community Contributor',
                driveFileId: driveAsset.fileId,
                driveLink: driveAsset.driveLink,
                previewLink: driveAsset.previewLink,
                size: file.size,
                status: 'PENDING', // Holds for admin panel curation check releases
                uploadedBy: user.id,
                categoryId: category.id,
            },
        })

        successfullyUploaded = true
        revalidatePath('/library')
        revalidatePath('/')
    } catch (error: unknown) {
        console.error('Fatal Upload Pipeline Action Fault:', (error as Error).message)
        // Redirect with error tracking parameter if execution fails
        redirect(`/upload?error=${encodeURIComponent((error as Error).message || 'Fatal service failure')}`)
    }

    // Redirect to discovery engine upon successful data creation hook
    if (successfullyUploaded) {
        redirect('/library?upload_success=true')
    }
}