class Requests {
    constructor({ host }) {
        this._host = host;
    }

    get(url, config = {}) {
        return fetch(this._absoluteURL(url), config);
    }

    post(url, config = {}) {
        return fetch(this._absoluteURL(url), {
            method: 'POST',
            ...config,
        });
    }

    _absoluteURL(url) {
        return `${this._host}${url}`;
    }
}

// TODO: Push into .env
const host =
    process.env.NODE_ENV !== 'production'
        ? 'http://localhost:3000'
        : 'https://text-to-record.cchanningallen.vercel.app';

export default new Requests({
    host,
});