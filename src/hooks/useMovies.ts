import { useEffect, useState } from "react";
import type { Movie, SortOption } from "../types";
import { movieService } from "../services/movieService";

interface UseMoviesOptions {
  search?: string;
  genre?: string;
  sort?: SortOption;
  onlyFavourites?: boolean;
  page?: number;
  refreshKey?: number;
}

export function useMovies({
  search = "",
  genre = "all",
  sort = "popularity",
  onlyFavourites = false,
  page = 1,
  refreshKey = 0,
}: UseMoviesOptions = {}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiveApi, setIsLiveApi] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function loadMovies() {
      try {
        setIsLoading(true);
        setError(null);

        const data = await movieService.fetchMovies({
          search,
          genre,
          sort,
          onlyFavourites,
          page,
          signal: controller.signal,
        });

        if (!cancelled) {
          setMovies(data.results);
          setIsLiveApi(data.isLiveApi);
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
  }, [search, genre, sort, onlyFavourites, page, refreshKey]);

  return { movies, isLoading, error, isLiveApi };
}
