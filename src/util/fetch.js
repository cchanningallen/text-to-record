export default function (url, config) {
    // TODO: Push into .env
    const host =
        process.env.NODE_ENV !== 'production'
            ? 'http://localhost:3000'
            : 'https://text-to-record.cchanningallen.vercel.app';
    const absoluteURL = `${host}${url}`;

    return fetch(absoluteURL, config);
}
