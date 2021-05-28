import React from 'react';
import { useSession } from 'next-auth/client';
import useSWR from 'swr';
import SignIn from './SignIn';
import Loader from './Loader';
import PageLayout from './PageLayout';
import AddPhone from './AddPhone';

export default function AuthWrapper({ children }) {
    const [session, loading] = useSession();
    const { data, error } = useSWR('/api/get-auth-status', (url) =>
        fetch(url).then((res) => res.json())
    );

    if (loading) {
        return (
            <PageLayout>
                <Loader className="w-8" />
            </PageLayout>
        );
    }

    if (!session) {
        return (
            <PageLayout simple>
                <SignIn />
            </PageLayout>
        );
    }

    if (data && !data.phone) {
        return (
            <PageLayout simple>
                <AddPhone userID={data.id} />
            </PageLayout>
        );
    }

    if (data && !data.emailVerified) {
        return (
            <PageLayout simple>
                <div className="p-16 bg-white max-w-md w-full rounded flex flex-col items-center">
                    <h1 className="text-2xl font-semibold mb-4">
                        🎉 Almost there!
                    </h1>
                    <p className="mb-2">
                        🔎 Our team is authenticating your profile
                    </p>
                    <p>⏳ Expect access within the next 24 hours</p>
                </div>
            </PageLayout>
        );
    }

    return children;
}
