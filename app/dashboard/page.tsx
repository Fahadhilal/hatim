'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, Label, Select } from '@/components/ui';
import { LogOut, PlusCircle, LayoutList, CheckCircle2, FileText, Info, User, Phone, BookOpen, CheckCircle, XCircle } from 'lucide-react';

export default function SchoolDashboard() {
    const router = useRouter();
    const [nominations, setNominations] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');

    const [formData, setFormData] = useState({
        teacherName: '',
        phone: '',
        subject: '',
        role: '',
        year: new Date().getFullYear()
    });
    const [msg, setMsg] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchNominations();
    }, []); // eslint-disable-line

    const fetchNominations = async () => {
        const res = await fetch('/api/nominations');
        if (res.ok) setNominations(await res.json());
        else if (res.status === 401) router.push('/login');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg({ text: '', type: '' });

        if (!formData.role) {
            setMsg({ text: 'يرجى اختيار مسمى المهمة (مصحح أو مراقب)', type: 'error' });
            return;
        }

        const res = await fetch('/api/nominations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setMsg({ text: 'تم تسجيل طلب الترشيح بنجاح وإرساله للاعتماد', type: 'success' });
            setFormData(prev => ({ ...prev, teacherName: '', phone: '', subject: '', role: '' }));
            fetchNominations();
            setTimeout(() => {
                setActiveTab('list');
                setMsg({ text: '', type: '' });
            }, 2000);
        } else {
            setMsg({ text: 'خطأ: تعذر إرسال الطلب، يرجى التأكد من البيانات أو عدم التكرار', type: 'error' });
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const subjects = [
        "اللغة العربية", "اللغة الإنجليزية", "الرياضيات", "العلوم", "التربية الإسلامية",
        "الدراسات الاجتماعية", "الحاسب الآلي", "التربية الفنية", "التربية البدنية", "أخرى"
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Official Header */}
            <header className="bg-blue-800 text-white shadow-md border-b-4 border-blue-900">
                <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded shadow-inner">
                            <FileText className="text-blue-800 w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">بوابة مدراء المدارس</h1>
                            <p className="text-blue-100 text-sm">نظام ترشيح الكادر التعليمي السنوي</p>
                        </div>
                    </div>
                    <Button onClick={handleLogout} variant="danger" className="text-sm">
                        <div className="flex items-center gap-2">
                            <LogOut size={16} />
                            <span>خروج من النظام</span>
                        </div>
                    </Button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Navigation Tabs */}
                <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`flex items-center gap-3 px-8 py-4 rounded-lg font-bold transition-all border-2 ${activeTab === 'create'
                            ? 'bg-blue-800 text-white border-blue-900 shadow-md transform -translate-y-1'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        <PlusCircle size={22} />
                        رفع طلب ترشيح جديد
                    </button>
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`flex items-center gap-3 px-8 py-4 rounded-lg font-bold transition-all border-2 ${activeTab === 'list'
                            ? 'bg-blue-800 text-white border-blue-900 shadow-md transform -translate-y-1'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        <LayoutList size={22} />
                        سجل الترشيحات المرسلة
                    </button>
                </div>

                <div className="max-w-4xl">
                    {activeTab === 'create' && (
                        <Card title="بيانات المعلم المرشح">
                            <div className="mb-8 p-4 bg-blue-50 border-r-4 border-blue-800 flex items-start gap-3">
                                <Info className="text-blue-800 mt-1 shrink-0" size={20} />
                                <p className="text-sm text-blue-900 font-medium leading-relaxed">
                                    يرجى ملء كافة البيانات بدقة تامة. سيتم مراجعة الطلب من قبل الإدارة التعليمية واعتماده بناءً على البيانات المدخلة هنا.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <Label className="flex items-center gap-2">
                                            <User size={16} className="text-blue-600" />
                                            الاسم الرباعي للمعلم
                                        </Label>
                                        <Input
                                            value={formData.teacherName}
                                            onChange={e => setFormData({ ...formData, teacherName: e.target.value })}
                                            required
                                            placeholder="أدخل الاسم الرباعي"
                                        />
                                    </div>
                                    <div>
                                        <Label className="flex items-center gap-2">
                                            <Phone size={16} className="text-blue-600" />
                                            رقم الهاتف
                                        </Label>
                                        <Input
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            required
                                            placeholder="أدخل رقم الجوال"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <Label className="flex items-center gap-2">
                                            <BookOpen size={16} className="text-blue-600" />
                                            معلم مادة
                                        </Label>
                                        <Select
                                            value={formData.subject}
                                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                            required
                                        >
                                            <option value="" disabled>-- اختر المادة --</option>
                                            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>مسمى المهمة</Label>
                                        <div className="flex gap-6 mt-2">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="مصحح"
                                                    checked={formData.role === 'مصحح'}
                                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                    className="w-5 h-5 accent-blue-800 opacity-0 absolute"
                                                />
                                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.role === 'مصحح' ? 'bg-blue-800 border-blue-800' : 'border-slate-300 group-hover:border-blue-500'}`}>
                                                    {formData.role === 'مصحح' && <CheckCircle2 size={16} className="text-white" />}
                                                </div>
                                                <span className="font-bold text-slate-700">مصحح</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value="مراقب"
                                                    checked={formData.role === 'مراقب'}
                                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                                    className="w-5 h-5 accent-blue-800 opacity-0 absolute"
                                                />
                                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${formData.role === 'مراقب' ? 'bg-blue-800 border-blue-800' : 'border-slate-300 group-hover:border-blue-500'}`}>
                                                    {formData.role === 'مراقب' && <CheckCircle2 size={16} className="text-white" />}
                                                </div>
                                                <span className="font-bold text-slate-700">مراقب</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8 border-t pt-8">
                                    <div>
                                        <Label>السنة المستهدفة</Label>
                                        <Input
                                            type="number"
                                            value={formData.year}
                                            onChange={e => setFormData({ ...formData, year: parseInt(e.target.value) })}
                                            required
                                            className="font-bold text-blue-800"
                                        />
                                    </div>
                                </div>

                                {msg.text && (
                                    <div className={`p-4 rounded border-r-4 animate-in slide-in-from-right duration-300 ${msg.type === 'success'
                                        ? 'bg-green-50 border-green-700 text-green-800 font-bold'
                                        : 'bg-red-50 border-red-700 text-red-800 font-bold'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            {msg.type === 'success' && <CheckCircle2 size={24} />}
                                            {msg.text}
                                        </div>
                                    </div>
                                )}

                                <Button type="submit" className="w-full py-4 text-xl">
                                    إرسال للاعتماد
                                </Button>
                            </form>
                        </Card>
                    )}

                    {activeTab === 'list' && (
                        <Card title="الطلبات">
                            <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3 text-slate-500 text-sm">
                                <Info size={16} />
                                تفاصيل الترشيحات وحالة الاعتماد من الإدارة التعليمية
                            </div>

                            <div className="space-y-4">
                                {nominations.map(nom => (
                                    <div key={nom.id} className="border rounded-lg bg-white overflow-hidden hover:border-blue-300 transition-all group">
                                        <div className="bg-slate-50 p-4 border-b flex justify-between items-center group-hover:bg-blue-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-blue-800 text-white text-xs font-bold rounded">سنة {nom.year}</span>
                                                <span className="text-slate-500 text-xs font-bold">{new Date(nom.createdAt).toLocaleDateString('ar-EG')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-400">حالة الترشيح:</span>
                                                {nom.status ? (
                                                    <div className="flex items-center gap-1 text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200 shadow-sm animate-pulse">
                                                        <CheckCircle size={14} className="fill-green-700 text-white" />
                                                        <span className="text-xs font-black">مرشح</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 opacity-60">
                                                        <XCircle size={14} />
                                                        <span className="text-xs font-bold">غير مرشح</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="grid md:grid-cols-3 gap-6">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">اسم المعلم</p>
                                                    <h3 className="text-lg font-bold text-slate-900">{nom.teacherName}</h3>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">رقم الهاتف</p>
                                                    <p className="text-slate-700 font-mono font-bold">{nom.phone || '-'}</p>
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">المادة / المهمة</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded border border-blue-100 text-sm font-bold">{nom.subject}</span>
                                                        <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded border border-slate-200 text-sm font-bold">بصفة {nom.role}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {nominations.length === 0 && (
                                    <div className="text-center py-24 border-2 border-dashed rounded-lg bg-slate-50">
                                        <LayoutList className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                                        <p className="text-slate-500 text-xl font-bold italic">لا تتوفر أي طلبات مرسلة حالياً</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </main>

            <footer className="max-w-6xl mx-auto px-6 py-12 text-center text-slate-400 border-t border-slate-200 text-sm italic">
                تم استخراج هذه البيانات عبر نظام الترشيح الموحد &bull; الإدارة التعليمية العامة
            </footer>
        </div>
    );
}
