import moment from 'moment';

export default function Record({ className, title, createdAt, type, text }) {
    const formattedTime = moment(createdAt).calendar();

    let renderedText = text;
    if (text.startsWith('http')) {
        renderedText = (
            <a className="link" href="text">
                {text}
            </a>
        );
    }

    return (
        <div
            className={`${className} bg-white w-full border-2 rounded-md flex flex-col p-4`}
        >
            <h3 className="flex-auto text-xl font-semibold">{title}</h3>
            <div className="text-xs pb-2">{formattedTime}</div>
            <div className="whitespace-pre-wrap break-all">{renderedText}</div>
        </div>
    );
}
