import useSWR from 'swr';
import RecordTimeline from '../components/RecordTimeline';

export default function Home() {
    const { data, error } = useSWR('/api/get-records', (url) =>
        fetch(url).then((res) => res.json())
    );
    const mainStyles =
        'flex items-center justify-center min-h-screen p-4 bg-gray-100';

    if (!!error) {
        return <div className={mainStyles}>failed to load</div>;
    }
    if (!data) {
        return <div className={mainStyles}>loading...</div>;
    }

    // Sort by createdAt desc
    const sortedRecords = data.records.sort(
        (r1, r2) => new Date(r2.createdAt) - new Date(r1.createdAt)
    );

    return (
        <div className={mainStyles}>
            <RecordTimeline records={sortedRecords} />
        </div>
    );
}
