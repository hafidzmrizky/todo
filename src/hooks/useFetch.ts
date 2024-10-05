import { useEffect, useState } from "react";

const useFetch = (url: string, headers?: HeadersInit) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url, {
                    headers: headers
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setData(data);
            } catch (e) {
                setError(e as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, headers]);

    return { data, loading, error };
}

export default useFetch;