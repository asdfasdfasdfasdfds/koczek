// components/BackButton.tsx
'use client';

import React from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';

const BackButton: React.FC = () => {
    const router = useRouter();

    const handleBack = () => {
        router.back(); // This navigates to the previous page
    };

    return (
        <Button
            label="Geri Dön"
            icon="pi pi-arrow-left"
            onClick={handleBack}
            text
            style={{
                position: 'relative', // or 'fixed' if you want it always visible
                zIndex: 50, // Ensure this is higher than other elements
            }}
        />
    );
};

export default BackButton;
