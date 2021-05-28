class Requests {
    constructor({ host }) {
        this._host = host;
    }

    get(url, config = {}) {
        return fetch(this.absoluteURL(url), config);
    }

    post(url, config = {}) {
        return fetch(this.absoluteURL(url), {
            method: 'POST',
            ...config,
        });
    }

    put(url, config = {}) {
        return fetch(this.absoluteURL(url), {
            method: 'PUT',
            ...config,
        });
    }

    absoluteURL(url) {
        return `${this._host}${url}`;
    }
}

export default new Requests({
    host: process.env.NEXT_PUBLIC_ROOT_URL,
});
