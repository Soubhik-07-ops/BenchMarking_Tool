'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/app/context/AuthContext';

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
            <main className="flex-grow">{children}</main>
        </AuthProvider>
    );
}
