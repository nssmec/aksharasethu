import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' }
        })
        return NextResponse.json(categories)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to stream categories contexts' }, { status: 500 })
    }
}