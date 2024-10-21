"use client";
import { useEffect, useState } from 'react';
import Layout from '../../layout/layout';
import { useAppSelector } from '@/redux/hooks';
import LoginPage from '../(full-page)/auth/login/page';
import { ClipLoader } from 'react-spinners';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { user } = useAppSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [isUserChecked, setIsUserChecked] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            setIsUserChecked(true); // Update this only after loading
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (user !== null) {
            setIsLoading(false); // User is authenticated, hide loading
            setIsUserChecked(true); // Ensure user check is complete
        }
    }, [user]);

    // Show loading spinner until loading is done
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column'
            }}>
                <ClipLoader color="#3498db" loading={true} size={50} />
                <p style={{ marginTop: '20px', fontSize: '1.2rem', color: '#333' }}>Loading...</p>
            </div>
        );
    }

    // After loading is done, check if the user is authenticated
    if (!isUserChecked) {
        return null; // Prevent flicker before user check is done
    }

    // Show login page if user is not authenticated
    if (user === null) {
            return <LoginPage />;

    }

    // Render the main layout if user is authenticated
    return <Layout>{children}</Layout>;
}
