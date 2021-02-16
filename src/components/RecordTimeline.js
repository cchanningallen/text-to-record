import Record from './Record';
import { recordTypes } from '../constants';

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

function RecordTimelineItem({ id, title, createdAt, type, text, first, last }) {
    const styles = getStylesForType(type);

    return (
        <div className="flex">
            <div className="w-12 opa flex-grow-0 flex items-center justify-center relative">
                <div
                    className={`absolute w-3 h-3 rounded-full z-20 ${styles.indicator}`}
                />
                <div className="border-2 w-6 h-6 rounded-full bg-gray-50 z-10" />
                <div className="absolute h-full border" />
            </div>
            <Record
                className={`flex-auto ${styles.record}`}
                id={id}
                title={title}
                createdAt={createdAt}
                type={type}
                text={text}
            />
        </div>
    );
}

function getStylesForType(type) {
    switch (type) {
        case recordTypes.exercise:
            return {
                indicator: 'bg-green-400',
                record: '',
            };
        case recordTypes.thought:
            return {
                indicator: 'bg-yellow-400',
                record: '',
            };
        case recordTypes.meditation:
            return {
                indicator: 'bg-blue-400',
                record: '',
            };
        case recordTypes.test:
            return {
                indicator: '',
                record: 'opacity-50',
            };
        default:
            return {
                indicator: '',
                record: '',
            };
    }
}
