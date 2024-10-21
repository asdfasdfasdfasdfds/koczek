
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { SessionProvider } from 'next-auth/react';
import BackButton from '@/demo/components/BackButton';
import { GlobalProvider } from '@/layout/context/global-provider';
import { useAppSelector } from '@/redux/hooks';
import { Metadata } from 'next';

interface RootLayoutProps {
    children: React.ReactNode;
}
export const metadata: Metadata = {
    title: 'Koç Zek-Ai',
    description: 'KoçZek-Ai, öğrencilere kişiselleştirilmiş eğitim programları sunar.',
    robots: { index: false, follow: false },
    openGraph: {
        type: 'website',
        title: 'Koç Zek-Ai',
        url: 'https://koczekai.com',
        description: 'KoçZek-Ai, öğrencilere kişiselleştirilmiş eğitim programları sunar.',
        images: ['https://koczekai.com/assets/images/logo/logo-white.svg'],
        ttl: 604800
    },
    icons: {
        icon: 'https://koczekai.com/assets/images/ai-brain-icon-48x48.ico'
    }
};
export default function RootLayout({ children }: RootLayoutProps) {

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider>
                    <LayoutProvider>
                            <GlobalProvider>
                                {children}
                                
                            </GlobalProvider>

                    </LayoutProvider>
                </PrimeReactProvider>

            </body>
        </html>
    );
}
