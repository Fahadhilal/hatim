'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Label, Select } from '@/components/ui';
import { LockKeyhole, Landmark } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const [type, setType] = useState<'admin' | 'school'>('school');
    const [schools, setSchools] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const res = await fetch('/api/public/schools');
                if (res.ok) {
                    const data = await res.json();
                    setSchools(data);
                }
            } catch (err) {
                console.error('Failed to fetch schools');
            }
        };
        fetchSchools();
    }, []);

    useEffect(() => {
        // Reset username when switching types
        setUsername('');
    }, [type]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, type }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.role === 'admin') router.push('/admin');
                else router.push('/dashboard');
            } else {
                setError(data.error || 'خطأ في اسم المستخدم أو كلمة المرور');
            }
        } catch (err) {
            setError('حدث خطأ فني، يرجى المحاولة لاحقاً');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-800 rounded-full mb-6 shadow-inner">
                        <Landmark className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 border-b-2 border-blue-800 pb-2 inline-block">نظام ترشيح الكادر التعليمي</h1>
                    <p className="mt-4 text-slate-600 font-medium">سجل دخولك لمتابعة المهام الرسمية</p>
                </div>

                <Card className="shadow-lg border-t-4 border-t-blue-800">
                    <div className="flex bg-slate-100 rounded-md p-1 mb-8 border border-slate-200">
                        <button
                            onClick={() => setType('school')}
                            className={`flex-1 py-2 rounded text-sm font-bold transition-all ${type === 'school'
                                ? 'bg-white text-blue-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            دخول مدرسة
                        </button>
                        <button
                            onClick={() => setType('admin')}
                            className={`flex-1 py-2 rounded text-sm font-bold transition-all ${type === 'admin'
                                ? 'bg-white text-blue-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            دخول الإدارة
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <Label htmlFor="username">{type === 'admin' ? 'اسم المستخدم المسجل' : 'اختر المدرسة'}</Label>
                            {type === 'admin' ? (
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="admin"
                                />
                            ) : (
                                <Select
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>-- اختر اسم المدرسة --</option>
                                    {schools.map((school) => (
                                        <option key={school.id} value={school.name}>
                                            {school.name}
                                        </option>
                                    ))}
                                </Select>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="password">كلمة المرور</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="أدخل الرمز السري"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border-r-4 border-red-700 text-red-800 px-4 py-3 text-sm font-bold">
                                {error}
                            </div>
                        )}

                        <Button type="submit" disabled={loading} className="w-full py-3">
                            {loading ? 'جاري التحقق...' : 'دخول النظام'}
                        </Button>
                    </form>
                </Card>

                <div className="mt-10 text-center text-slate-500 text-sm">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <LockKeyhole size={14} />
                        <span>نظام محمي ومعتمد</span>
                    </div>
                    <p>جميع الحقوق محفوظة &copy; 2026</p>
                </div>
            </div>
        </div>
    );
}
