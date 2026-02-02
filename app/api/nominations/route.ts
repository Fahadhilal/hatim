import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;

    let where: any = {};
    if (year) where.year = year;

    if (session.role === 'school') {
        where.schoolId = session.id;
    }

    const nominations = await prisma.nomination.findMany({
        where,
        include: { school: true },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(nominations);
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session || session.role !== 'school') {
        return NextResponse.json({ error: 'Only schools can nominate' }, { status: 403 });
    }

    const { teacherName, phone, subject, role, year } = await request.json();

    if (!teacherName || !year) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    try {
        const nomination = await prisma.nomination.create({
            data: {
                teacherName,
                phone,
                subject,
                role,
                status: false, // Default to not approved/not candidate?
                year: parseInt(year),
                schoolId: session.id as number,
            },
        });
        return NextResponse.json(nomination);
    } catch (e) {
        return NextResponse.json({ error: 'Nomination failed or duplicate' }, { status: 400 });
    }
}
