import useSWR from 'swr';
import RecordTimeline from '../components/RecordTimeline';
import PageLayout from '../components/PageLayout';
import LoadingScreen from '../components/LoadingScreen';
import RecordTimelineItem from '../components/RecordTimelineItem';
import { useAuthContext } from '../components/AuthWrapper';
import { recordTypes } from '../constants';

export default function Home() {
    const { data, error } = useSWR('/api/get-records', (url) =>
        fetch(url).then((res) => res.json())
    );
    const authCtx = useAuthContext();

    if (!!error) {
        return <PageLayout simple>failed to load</PageLayout>;
    }
    if (!data || !authCtx) {
        return <LoadingScreen />;
    }

    // TODO: Rewrite this, it's trash
    if (!data.records) {
        let greeting = '👋  Welcome';
        if (authCtx.name) {
            const firstName = authCtx.name.split(' ')[0];
            greeting += `, ${firstName}`;
        }
        greeting += '!';

        return (
            <PageLayout simple>
                <h1 className="text-xl font-semibold mb-6">{greeting}</h1>
                <p className="mb-4 text-lg">
                    Let's get started! Just send a text to:
                </p>
                <div className="bg-white rounded py-2 px-4 font-semibold text-indigo-600 text-xl mb-8">
                    <code>757-210-5564</code>
                </div>
                <p className="mb-4 text-lg">
                    T2R really shines through its shorthand. Some examples:
                </p>
                <div className="flex justify-center items-center mb-4 w-full max-w-md">
                    <div className="mr-4 text-lg italic w-40">m5</div>
                    <div className="w-full">
                        <RecordTimelineItem
                            type={recordTypes.meditation}
                            title="Meditated for 5 minutes"
                        />
                    </div>
                </div>
                <div className="flex justify-center items-center mb-12 w-full max-w-md">
                    <div className="mr-4 text-lg italic w-40">
                        <p>Ran 5k</p>
                        <p>Time: 22:47</p>
                    </div>
                    <div className="w-full">
                        <RecordTimelineItem
                            type={recordTypes.exercise}
                            title="Exercise"
                            text={'Ran 5k\nTime: 22:47'}
                        />
                    </div>
                </div>
                <p className="text-lg">💬🚀 Go ahead - try it out!</p>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <RecordTimeline records={data.records} />
        </PageLayout>
    );
}
