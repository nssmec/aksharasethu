'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@/generated/client'

async function verifyAdmin() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        redirect('/login')
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            id: true,
            role: true,
        },
    })

    if (!user || user.role !== 'ADMIN') {
        throw new Error('Unauthorized')
    }

    return user
}

export async function updateUserRole(formData: FormData) {
    await verifyAdmin()

    const userId = formData.get('userId') as string
    const role = formData.get('role') as UserRole

    if (!userId || !role) {
        throw new Error('Missing required fields')
    }

    const validRoles: UserRole[] = [
        'STUDENT',
        'VOLUNTEER',
        'ADMIN',
    ]

    if (!validRoles.includes(role)) {
        throw new Error('Invalid role')
    }

    const targetUser = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            role: true,
        },
    })

    if (!targetUser) {
        throw new Error('User not found')
    }

    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            role,
        },
    })

    revalidatePath('/dashboard/users')
}