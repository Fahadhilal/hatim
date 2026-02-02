'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Label, Select, Modal } from '@/components/ui';
import { LogOut, PlusCircle, School, UserCheck, Key, FileDown, Printer, ShieldCheck, CheckCircle, XCircle } from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();
    const [schools, setSchools] = useState<any[]>([]);
    const [nominations, setNominations] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'schools' | 'nominations'>('schools');

    const [newSchoolName, setNewSchoolName] = useState('');
    const [newSchoolPassword, setNewSchoolPassword] = useState('');
    const [createMsg, setCreateMsg] = useState('');

    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('all');

    const [resetModal, setResetModal] = useState<{ isOpen: boolean; schoolId: number | null; schoolName: string }>({
        isOpen: false,
        schoolId: null,
        schoolName: ''
    });
    const [newPassword, setNewPassword] = useState('');
    const [resetMsg, setResetMsg] = useState('');

    useEffect(() => {
        fetchSchools();
        fetchNominations();
    }, []); // eslint-disable-line

    useEffect(() => {
        fetchNominations();
    }, [selectedYear]); // eslint-disable-line

    const fetchSchools = async () => {
        const res = await fetch('/api/schools');
        if (res.ok) setSchools(await res.json());
        else if (res.status === 401) router.push('/login');
    };

    const fetchNominations = async () => {
        const res = await fetch(`/api/nominations?year=${selectedYear}`);
        if (res.ok) setNominations(await res.json());
    };

    const handleCreateSchool = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/schools', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newSchoolName, password: newSchoolPassword }),
        });
        if (res.ok) {
            setCreateMsg('تمت إضافة المدرسة بنجاح');
            setNewSchoolName('');
            setNewSchoolPassword('');
            fetchSchools();
            setTimeout(() => setCreateMsg(''), 3000);
        } else {
            setCreateMsg('فشل الإضافة: هذا الاسم مسجل مسبقاً');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resetModal.schoolId) return;

        const res = await fetch(`/api/schools/${resetModal.schoolId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: newPassword }),
        });

        if (res.ok) {
            setResetMsg('تم تغيير كلمة المرور بنجاح');
            setTimeout(() => {
                setResetModal({ isOpen: false, schoolId: null, schoolName: '' });
                setNewPassword('');
                setResetMsg('');
            }, 1500);
        } else {
            setResetMsg('فشل التحديث، يرجى المحاولة لاحقاً');
        }
    };

    const toggleStatus = async (nomId: number, currentStatus: boolean) => {
        const res = await fetch(`/api/nominations/${nomId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: !currentStatus }),
        });
        if (res.ok) {
            fetchNominations();
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const exportPDF = async () => {
        const html2pdf = (await import('html2pdf.js')).default;
        const element = document.getElementById('nominations-report');
        if (!element) return;

        const opt = {
            margin: 10,
            filename: `تقرير_الترشيحات_${selectedYear}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        (html2pdf() as any).set(opt).from(element).save();
    };

    const filteredNominations = selectedSchoolFilter === 'all'
        ? nominations
        : nominations.filter(n => n.schoolId === parseInt(selectedSchoolFilter));

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-blue-800 text-white shadow-md mb-8">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded shadow-inner">
                            <ShieldCheck className="text-blue-800 w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="official-title">الإدارة التعليمية</h1>
                            <p className="text-blue-100 text-sm font-medium">نظام المتابعة السنوي للترشيحات</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-900/50 px-4 py-2 rounded border border-blue-700">
                            <span className="text-sm font-bold">المشرف الإداري</span>
                        </div>
                        <Button onClick={handleLogout} variant="danger" className="text-sm">
                            <div className="flex items-center gap-2">
                                <LogOut size={16} />
                                <span>تسجيل خروج</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pb-20">
                <div className="flex gap-2 mb-8 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('schools')}
                        className={`px-8 py-3 font-bold transition-all border-b-4 ${activeTab === 'schools' ? 'border-blue-800 text-blue-800 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <div className="flex items-center gap-2">
                            <School size={20} />
                            منشآت المدارس
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('nominations')}
                        className={`px-8 py-3 font-bold transition-all border-b-4 ${activeTab === 'nominations' ? 'border-blue-800 text-blue-800 bg-white' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <div className="flex items-center gap-2">
                            <UserCheck size={20} />
                            سجل الترشيحات العام
                        </div>
                    </button>
                </div>

                {activeTab === 'schools' && (
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <Card title="إضافة منشأة تعليمية">
                                <form onSubmit={handleCreateSchool} className="space-y-6">
                                    <div>
                                        <Label>المسمى الرسمي للمدرسة</Label>
                                        <Input value={newSchoolName} onChange={e => setNewSchoolName(e.target.value)} required placeholder="مثال: مدرسة النهضة الأساسية" />
                                    </div>
                                    <div>
                                        <Label>الرمز السري الأولي</Label>
                                        <Input type="password" value={newSchoolPassword} onChange={e => setNewSchoolPassword(e.target.value)} required placeholder="••••••••" />
                                    </div>
                                    {createMsg && (
                                        <div className={`p-3 text-sm font-bold rounded ${createMsg.includes('بنجاح') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                            {createMsg}
                                        </div>
                                    )}
                                    <Button type="submit" className="w-full py-3">
                                        <PlusCircle size={18} className="ml-2" />
                                        تفعيل حساب المدرسة
                                    </Button>
                                </form>
                            </Card>
                        </div>

                        <div className="lg:col-span-2">
                            <Card title="قائمة المدارس التابعة">
                                <div className="border rounded-md overflow-hidden">
                                    <table className="modern-table">
                                        <thead>
                                            <tr>
                                                <th className="p-4 bg-slate-100 border-b">اسم المنشأة</th>
                                                <th className="p-4 bg-slate-100 border-b text-center">الترشيحات الحالية</th>
                                                <th className="p-4 bg-slate-100 border-b text-left">خيارات التحكم</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schools.map(school => (
                                                <tr key={school.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 font-bold text-slate-800">{school.name}</td>
                                                    <td className="p-4 text-center">
                                                        <span className="bg-slate-100 px-3 py-1 rounded-full text-sm font-bold text-slate-700 border">
                                                            {school.nominations?.length || 0}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-left">
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => setResetModal({ isOpen: true, schoolId: school.id, schoolName: school.name })}
                                                            className="text-xs px-3 py-1"
                                                        >
                                                            <Key size={14} className="ml-1" />
                                                            إعادة ضبط الرمز
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'nominations' && (
                    <div className="space-y-6">
                        <Card>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8 bg-slate-50 p-6 rounded-lg border">
                                <div className="flex flex-wrap gap-4 items-center">
                                    <div className="flex items-center gap-3">
                                        <Label className="mb-0 whitespace-nowrap">عرض المدرسة:</Label>
                                        <Select
                                            value={selectedSchoolFilter}
                                            onChange={e => setSelectedSchoolFilter(e.target.value)}
                                            className="w-64"
                                        >
                                            <option value="all">كافة المدارس التابعة</option>
                                            {schools.map(school => (
                                                <option key={school.id} value={school.id}>{school.name}</option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Label className="mb-0 whitespace-nowrap">السنة المالية:</Label>
                                        <Input
                                            type="number"
                                            value={selectedYear}
                                            onChange={e => setSelectedYear(parseInt(e.target.value))}
                                            className="w-28 font-bold"
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={exportPDF} className="bg-emerald-700 hover:bg-emerald-800">
                                        <FileDown size={18} className="ml-2" />
                                        تحميل كـ PDF
                                    </Button>
                                    <Button onClick={() => window.print()} variant="outline">
                                        <Printer size={18} className="ml-2" />
                                        طباعة التقرير
                                    </Button>
                                </div>
                            </div>

                            <div id="nominations-report" className="pdf-bg-white" dir="rtl">
                                <div className="hidden print:block mb-8 text-center border-b-2 border-black pb-4">
                                    <h2 className="text-3xl font-bold mb-2">تقرير ترشيح المعلمين السنوي</h2>
                                    <p className="text-lg">للعام الدراسي: {selectedYear}</p>
                                    <p className="text-slate-600 mt-2">تاريخ الإصدار: {new Date().toLocaleDateString('ar-EG')}</p>
                                </div>

                                <div className="overflow-x-auto border-2 pdf-border-slate rounded-lg">
                                    <table className="w-full text-right border-collapse">
                                        <thead>
                                            <tr className="pdf-bg-slate-light">
                                                <th className="p-4 border pdf-border-slate font-bold">المدرسة</th>
                                                <th className="p-4 border pdf-border-slate font-bold">اسم المعلم</th>
                                                <th className="p-4 border pdf-border-slate font-bold">رقم الهاتف</th>
                                                <th className="p-4 border pdf-border-slate font-bold">المادة</th>
                                                <th className="p-4 border pdf-border-slate font-bold">المهمة</th>
                                                <th className="p-4 border pdf-border-slate font-bold">الحالة</th>
                                                <th className="p-4 border pdf-border-slate font-bold print:hidden text-center">الإجراء</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y pdf-border-slate">
                                            {filteredNominations.map(nom => (
                                                <tr key={nom.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 border pdf-border-slate font-bold text-blue-900">{nom.school?.name}</td>
                                                    <td className="p-4 border pdf-border-slate font-bold">{nom.teacherName}</td>
                                                    <td className="p-4 border pdf-border-slate font-mono">{nom.phone || '---'}</td>
                                                    <td className="p-4 border pdf-border-slate">{nom.subject || '---'}</td>
                                                    <td className="p-4 border pdf-border-slate">{nom.role || '---'}</td>
                                                    <td className="p-4 border pdf-border-slate">
                                                        <div className="flex items-center gap-2">
                                                            {nom.status ? (
                                                                <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded text-xs font-bold border border-green-200">
                                                                    <CheckCircle size={12} /> مرشح
                                                                </span>
                                                            ) : (
                                                                <span className="flex items-center gap-1 text-slate-400 bg-slate-100 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                                                                    <XCircle size={12} /> غير مرشح
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 border pdf-border-slate print:hidden text-center">
                                                        <button
                                                            onClick={() => toggleStatus(nom.id, nom.status)}
                                                            className={`px-3 py-1 rounded text-xs font-bold transition-all ${nom.status ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-600 text-white hover:bg-green-700'}`}
                                                        >
                                                            {nom.status ? 'إلغاء الترشيح' : 'اعتماد كمرشح'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="hidden print:flex justify-between mt-12 px-10 font-bold">
                                    <div className="text-center">
                                        <p className="mb-8">ختم وتوقيع مدير المدرسة</p>
                                        <p className="pdf-text-slate">..............................</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="mb-8">اعتماد الإدارة التعليمية</p>
                                        <p className="pdf-text-slate">..............................</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </main>

            <Modal
                isOpen={resetModal.isOpen}
                onClose={() => {
                    setResetModal({ isOpen: false, schoolId: null, schoolName: '' });
                    setNewPassword('');
                    setResetMsg('');
                }}
                title={`إعادة ضبط رمز الدخول - ${resetModal.schoolName}`}
            >
                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                        <Label>الرمز السري الجديد</Label>
                        <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="أدخل الرمز الجديد للمدرسة" />
                    </div>
                    {resetMsg && <div className={`p-3 text-sm font-bold rounded ${resetMsg.includes('بنجاح') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{resetMsg}</div>}
                    <Button type="submit" className="w-full">اعتماد الرمز الجديد</Button>
                </form>
            </Modal>

            <footer className="max-w-7xl mx-auto px-6 py-10 text-center text-slate-400 border-t border-slate-200 text-sm">
                نظام ترشيح الكادر التعليمي - تقرير رسمي صادر عن الإدارة التعليمية &copy; 2026
            </footer>
        </div>
    );
}
