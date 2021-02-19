import Record from './Record';
import { recordTypes } from '../constants';

export default function RecordTimelineItem({
    id,
    title,
    createdAt,
    type,
    text,
    first,
    last,
}) {
    const styles = getStylesForType(type);

    return (
        <div className="flex">
            <div className="w-12 opa flex-grow-0 flex items-center justify-center relative">
                <div
                    className={`absolute w-3 h-3 rounded-full z-20 ${styles.indicator}`}
                />
                <div className="border-2 w-6 h-6 rounded-full bg-gray-50 z-10" />

                <div className="absolute h-full flex flex-col">
                    <div className="flex-grow">
                        {!first && <div className="h-full border" />}
                    </div>
                    <div className="flex-grow">
                        {!last && <div className="h-full border" />}
                    </div>
                </div>
            </div>

            <Record
                className={`flex-auto my-2 ${styles.record}`}
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
