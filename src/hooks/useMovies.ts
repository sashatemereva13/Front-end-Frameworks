import { useEffect, useState } from "react";
import type { Movie } from "../types";
import { movieService } from "../services/movieService";

export function useMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadMovies() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await movieService.fetchMovies({
          signal: controller.signal,
        });

        if (!cancelled) {
          setMovies(data.results);
        }
      } catch (error) {
        const wasAborted =
          error instanceof DOMException && error.name === "AbortError";

        if (!cancelled && !wasAborted) {
          setError("Unable to load movies. Please try again later");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return { movies, isLoading, error };
}
