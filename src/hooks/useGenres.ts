import { useEffect, useState } from "react";
import type { Genre } from "../types";
import { getApiKey } from "../utils/storage";

interface UseGenresResult {
  genres: Genre[];
  isLoading: boolean;
  error: string | null;
}

export function useGenres(refreshKey = 0): UseGenresResult {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadGenres() {
      setIsLoading(true);
      setError(null);

      const apiKey = getApiKey();

      if (!apiKey) {
        setGenres([]);
        setError("Add your TMDB key to load genres.");
        setIsLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams({ api_key: apiKey });
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?${params}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`TMDB genre request failed: ${response.status}`);
        }

        const data: { genres: Genre[] } = await response.json();

        if (!cancelled) {
          setGenres(data.genres);
        }
      } catch (error) {
        const wasAborted =
          error instanceof DOMException && error.name === "AbortError";

        if (!cancelled && !wasAborted) {
          setError(
            "Unable to load genres. Please check your API key and try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadGenres();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [refreshKey]);

  return { genres, isLoading, error };
}
