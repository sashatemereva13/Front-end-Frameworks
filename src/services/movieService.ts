import { SAMPLE_MOVIES } from "../data/sampleMovies";
import type { Movie, SortOption } from "../types";
import { getApiKey, getFavourites } from "../utils/storage";

function matchesSearch(movie: Movie, search: string) {
  const query = search.trim().toLowerCase();

  if (!query) {
    return true;
  }

  return (
    movie.title.toLowerCase().includes(query) ||
    movie.overview.toLowerCase().includes(query) ||
    movie.original_title?.toLowerCase().includes(query)
  );
}

function matchesGenres(movie: Movie, genre: string) {
  return genre === "all" || movie.genre_ids.includes(Number(genre));
}

export function sortMovies(movies: Movie[], sort: SortOption = "popularity") {
  return [...movies].sort((firstMovie, secondMovie) => {
    if (sort === "title") {
      return firstMovie.title.localeCompare(secondMovie.title);
    }

    if (sort === "release_date") {
      return (
        new Date(secondMovie.release_date).getTime() -
        new Date(firstMovie.release_date).getTime()
      );
    }

    return secondMovie[sort] - firstMovie[sort];
  });
}

function getLocalMovies(search: string, genre: string, sort: SortOption) {
  const results = SAMPLE_MOVIES.filter((movie) => {
    return matchesSearch(movie, search) && matchesGenres(movie, genre);
  });

  return {
    results: sortMovies(results, sort),
    total_pages: 1,
    total_results: results.length,
    isLiveApi: false,
  };
}

export const movieService = {
  async fetchMovies({
    search = "",
    genre = "all",
    sort = "popularity",
    onlyFavourites = false,
    page = 1,
    signal,
  }: {
    search?: string;
    genre?: string;
    sort?: SortOption;
    onlyFavourites?: boolean;
    page?: number;
    signal?: AbortSignal;
  } = {}) {
    if (onlyFavourites) {
      const results = getFavourites().filter((movie: Movie) =>
        matchesSearch(movie, search),
      );

      return {
        results: sortMovies(results, sort),
        total_pages: 1,
        total_results: results.length,
        isLiveApi: false,
      };
    }

    const apiKey = getApiKey();

    if (!apiKey) {
      return getLocalMovies(search, genre, sort);
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      page: String(page),
    });

    let endpoint = "/movie/popular";

    if (search.trim()) {
      endpoint = "/search/movie";
      params.set("query", search.trim());
    } else if (genre !== "all") {
      endpoint = "/discover/movie";
      params.set("with_genres", genre);
    }

    const response = await fetch(
      `https://api.themoviedb.org/3${endpoint}?${params}`,
      { signal },
    );

    if (!response.ok) {
      throw new Error(`TMDB request failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      results: sortMovies(data.results, sort),
      total_pages: data.total_pages,
      total_results: data.total_results,
      isLiveApi: true,
    };
  },
};
