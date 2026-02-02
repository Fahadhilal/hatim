import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { password } = await request.json();
    if (!password) {
        return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const school = await prisma.school.update({
            where: { id: parseInt(id) },
            data: { password: hashedPassword },
        });
        return NextResponse.json({ success: true, school: { id: school.id, name: school.name } });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
}
