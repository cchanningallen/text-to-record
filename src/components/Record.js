export default function Record({ className, title, time, type, text }) {
    return (
        <div
            className={`${className} bg-white w-full border-2 rounded-md flex flex-col p-4 mb-4`}
        >
            <h3 className="flex-auto text-xl font-semibold">{title}</h3>
            <div className="text-sm">
                {time} | {type}
            </div>
            <div className="whitespace-pre-wrap">{text}</div>
        </div>
    );
}
