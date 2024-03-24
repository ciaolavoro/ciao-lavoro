export const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

export function fetchBackend(url, options) {
    return fetch(`${BACKEND_URL}${url}`, options);
}