import Record from './Record';

export default function RecordTimeline({ records }) {
    if (!records) {
        return;
    }

    return (
        <div className="w-full max-w-md flex flex-col">
            {records.map(({ title, time, type, text }, i) => (
                <RecordTimelineItem
                    key={i}
                    title={title}
                    time={time}
                    type={type}
                    text={text}
                    first={i == 0}
                    last={i == records.length - 1}
                />
            ))}
        </div>
    );
}

function RecordTimelineItem({ title, time, type, text, first, last }) {
    return (
        <div className="flex">
            <div className="w-12 flex-grow-0 flex items-center justify-center relative">
                <div className="border-2 w-6 h-6 rounded-full bg-gray-50 z-10" />
                <div className="absolute h-full border" />
            </div>
            <Record
                className="flex-auto"
                title={title}
                time={time}
                type={type}
                text={text}
            />
        </div>
    );
}
