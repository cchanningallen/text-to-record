import RecordTimelineItem from './RecordTimelineItem';

export default function RecordTimeline({ records }) {
    if (!records) {
        return;
    }

    return (
        <div className="w-full max-w-md flex flex-col">
            {records.map(({ id, title, text, type, createdAt }, i) => (
                <RecordTimelineItem
                    key={id}
                    title={title}
                    createdAt={createdAt}
                    type={type}
                    text={text}
                    first={i == 0}
                    last={i == records.length - 1}
                />
            ))}
        </div>
    );
}
