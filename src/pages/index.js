import useSWR from 'swr';
import RecordTimeline from '../components/RecordTimeline';
import Loader from '../components/Loader';

export default function Home() {
    const { data, error } = useSWR('/api/get-records', (url) =>
        fetch(url).then((res) => res.json())
    );
    const mainStyles = 'flex justify-center p-4 min-h-screen';

    if (!!error) {
        return <div className={mainStyles}>failed to load</div>;
    }
    if (!data) {
        return (
            <div className={mainStyles}>
                <Loader className="w-8" />
            </div>
        );
    }

    return (
        <div className={mainStyles}>
            <RecordTimeline records={data.records} />
        </div>
    );
}
