import useSWR from 'swr';
import RecordTimeline from '../components/RecordTimeline';

export default function Home() {
    const { data, error } = useSWR('/api/get-records', (url) =>
        fetch(url).then((res) => res.json())
    );
    const mainStyles = 'flex justify-center p-4';

    if (!!error) {
        return <div className={mainStyles}>failed to load</div>;
    }
    if (!data) {
        return <div className={mainStyles}>loading...</div>;
    }

    return (
        <div className={mainStyles}>
            <RecordTimeline records={data.records} />
        </div>
    );
}
