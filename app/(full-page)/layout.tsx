import { Metadata } from 'next';
import AppConfig from '../../layout/AppConfig';
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/slices/authSlice';
import { useSession } from 'next-auth/react';

interface SimpleLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'Koç Zek-Ai',
    description: 'KoçZek-Ai, öğrencilere kişiselleştirilmiş eğitim programları sunar.'
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {

    return (
        <React.Fragment>
            {children}
            <AppConfig simple />
        </React.Fragment>
    );
}
