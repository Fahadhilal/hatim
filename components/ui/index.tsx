import React from 'react';

export function Button({
    className = '',
    variant = 'primary',
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'danger' | 'secondary' | 'outline' }) {
    const variants = {
        primary: 'btn-formal',
        secondary: 'bg-slate-600 text-white hover:bg-slate-700 font-bold px-6 py-2 rounded-md transition-all',
        danger: 'btn-formal-danger',
        outline: 'btn-formal-outline'
    };

    return (
        <button
            className={`${variants[variant]} ${className}`}
            {...props}
        />
    );
}

export function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className={`formal-input ${className}`}
            {...props}
        />
    );
}

export function Card({ children, className = '', title }: { children: React.ReactNode; className?: string; title?: string }) {
    return (
        <div className={`formal-card ${className}`}>
            {title && <h2 className="section-title">{title}</h2>}
            <div>{children}</div>
        </div>
    );
}

export function Label({ children, htmlFor, className = '' }: { children: React.ReactNode; htmlFor?: string; className?: string }) {
    return (
        <label htmlFor={htmlFor} className={`block text-sm font-bold text-slate-700 mb-2 ${className}`}>
            {children}
        </label>
    );
}

export function Select({ className = '', children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            className={`formal-input cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-10 ${className}`}
            {...props}
        >
            {children}
        </select>
    );
}

export function Modal({ isOpen, onClose, children, title }: { isOpen: boolean; onClose: () => void; children: React.ReactNode; title: string }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none">&times;</button>
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    );
}
