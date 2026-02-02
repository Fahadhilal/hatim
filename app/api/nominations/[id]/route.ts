import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getSession();

    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { status } = await request.json();

        const nomination = await prisma.nomination.update({
            where: { id: parseInt(id) },
            data: { status: !!status },
        });

        return NextResponse.json(nomination);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update nomination' }, { status: 500 });
    }
}
