import React, { useState } from 'react';
import { useRouter } from 'next/router';
import RecordForm from '../components/RecordForm';
import requests from '../util/requests';

export default function AddRecord() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const onSubmit = (formData) => {
        setLoading(true);
        requests
            .post('/api/create-record', {
                body: JSON.stringify(formData),
            })
            .then((res) => {
                setLoading(false);
                if (!res.ok) throw res;
                router.push('/');
            })
            .catch((error) => {
                alert(
                    "😬 Something's amiss! Sorry about that 😅\n\n👉 Please poke an admin to investigate 👈"
                );
            });
    };

    return (
        <div className="flex justify-center min-h-screen">
            <RecordForm
                headerText={'Add Record'}
                loading={loading}
                onSubmit={onSubmit}
            />
        </div>
    );
}
