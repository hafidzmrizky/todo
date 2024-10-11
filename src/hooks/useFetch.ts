import { useCallback, useEffect, useState } from "react";

const useFetch = (initialUrl: string, initialHeaders: HeadersInit = {}) => {
  const [url, setUrl] = useState(initialUrl);
  const [headers, setHeaders] = useState(initialHeaders);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [url, headers]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback((newUrl?: string, newHeaders?: HeadersInit) => {
    if (newUrl) setUrl(newUrl);
    if (newHeaders) setHeaders(newHeaders);
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

export default useFetch;