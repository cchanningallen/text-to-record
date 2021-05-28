import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { useAuthContext } from '../components/AuthWrapper';
import PageLayout from '../components/PageLayout';
import LoadingScreen from '../components/LoadingScreen';
import TestSMSForm from '../components/TestSMSForm';
import requests from '../util/requests';

function TestSms() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const auth = useAuthContext();

    if (!auth) {
        return <LoadingScreen />;
    }

    if (auth.role != 'admin') {
        router.push('/');
        return <LoadingScreen />;
    }

    const onSubmit = (payload) => {
        setLoading(true);
        requests
            .post('/api/twilio-sms', {
                body: JSON.stringify(payload),
            })
            .then((res) => {
                if (!res.ok) throw res;
                router.push('/');
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                alert(
                    "😬 Something's amiss! Sorry about that 😅\n\n👉 Please poke an admin to investigate 👈"
                );
            });
    };

    return (
        <PageLayout simple>
            <TestSMSForm
                headerText={'Test SMS'}
                loading={loading}
                onSubmit={onSubmit}
            />
        </PageLayout>
    );
}

export default TestSms;
