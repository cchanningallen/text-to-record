import React from 'react';
import Loader from './Loader';
import PageLayout from './PageLayout';

export default function LoadingScreen() {
    return (
        <PageLayout>
            <Loader className="w-8" />
        </PageLayout>
    );
}
