import React from 'react';
import { useRouter } from 'next/router';
import RecordForm from '../components/RecordForm';
import requests from '../util/requests';

export default function AddRecord() {
    const router = useRouter();

    const onSubmit = (formData) =>
        requests
            .post('/api/create-record', {
                body: JSON.stringify(formData),
            })
            .then(() => {
                router.push('/');
            });

    return (
        <div className="flex justify-center min-h-screen">
            <RecordForm
                headerText={'Add Record'}
                onSubmit={onSubmit}
                onClose={() => router.push('/')}
            />
        </div>
    );
}
