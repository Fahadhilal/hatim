import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { login } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password, type } = body;

        if (!username || !password) {
            return NextResponse.json({ error: 'يرجى إدخال اسم المستخدم وكلمة المرور' }, { status: 400 });
        }

        if (type === 'admin') {
            const admin = await prisma.admin.findUnique({
                where: { username },
            });

            if (admin && (await bcrypt.compare(password, admin.password))) {
                await login({ id: admin.id, role: 'admin', name: admin.username });
                return NextResponse.json({ success: true, role: 'admin' });
            }
        } else if (type === 'school') {
            const school = await prisma.school.findUnique({
                where: { name: username },
            });

            if (school && (await bcrypt.compare(password, school.password))) {
                await login({ id: school.id, role: 'school', name: school.name });
                return NextResponse.json({ success: true, role: 'school' });
            }
        }

        return NextResponse.json({ error: 'خطأ في اسم المستخدم أو كلمة المرور' }, { status: 401 });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({
            error: 'حدث خطأ في النظام',
            details: error.message
        }, { status: 500 });
    }
}
