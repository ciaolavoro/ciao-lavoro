import { useEffect, useMemo, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL;

export function useGetBackendData(endpoint) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const options = useMemo(() => ({
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }), []);

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_URL}${endpoint}`, options)
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => setError(error))
            .finally(() => setLoading(false));
    }, [endpoint, options]);

    return { data, loading, error };
}