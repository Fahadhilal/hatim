import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const schools = await prisma.school.findMany({
        select: { id: true, name: true, nominations: true },
    });
    return NextResponse.json(schools);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, password } = await request.json();
    if (!name || !password) {
        return NextResponse.json({ error: 'Missing name or password' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const school = await prisma.school.create({
            data: {
                name,
                password: hashedPassword,
            },
        });
        return NextResponse.json(school);
    } catch (e) {
        return NextResponse.json({ error: 'School already exists' }, { status: 409 });
    }
}
