'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function verifyAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        throw new Error('Unauthorized')
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            role: true,
        },
    })

    if (user?.role !== 'ADMIN') {
        throw new Error('Forbidden')
    }

    return session.user
}

export async function approveDocument(documentId: string) {
    await verifyAdmin()

    await prisma.document.update({
        where: {
            id: documentId,
        },
        data: {
            status: 'APPROVED',
        },
    })

    revalidatePath('/library')
    revalidatePath('/admin')
    revalidatePath('/admin/documents')
}

export async function rejectDocument(documentId: string) {
    await verifyAdmin()

    await prisma.document.update({
        where: {
            id: documentId,
        },
        data: {
            status: 'REJECTED',
        },
    })

    revalidatePath('/admin')
    revalidatePath('/admin/documents')
}

export async function restoreDocument(documentId: string) {
    await verifyAdmin()

    await prisma.document.update({
        where: {
            id: documentId,
        },
        data: {
            status: 'PENDING',
        },
    })

    revalidatePath('/admin')
    revalidatePath('/admin/documents')
}

export async function deleteDocument(documentId: string) {
    await verifyAdmin()

    await prisma.document.delete({
        where: {
            id: documentId,
        },
    })

    revalidatePath('/library')
    revalidatePath('/admin')
    revalidatePath('/admin/documents')
}