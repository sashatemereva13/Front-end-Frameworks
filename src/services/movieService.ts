import { SAMPLE_MOVIES } from "../data/sampleMovies";

export function getFallBackMovies(search) {
  const query = search.trim().toLowerCase();

  const results = query
    ? SAMPLE_MOVIES.filter((movie) => {
        return (
          movie.title.toLowerCase().includes(query) ||
          movie.overview.toLowerCase().includes(query) ||
          movie.original_title.toLowerCase().includes(query)
        );
      })
    : SAMPLE_MOVIES;

  return {
    results,
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
  } = {}) {
    const apiKey = import.meta.env.TMDB_API_KEY;
    const TMDB_BASE_URL = import.meta.env.TMDB_BASE_URL;

    if (!apiKey) {
      return getFallBackMovies(search);
    }

    const endpoint = search.trim() ? "/search/movie" : "/movie/popular";

    const params = new URLSearchParams({
      page: String(page),
      language: "en-US",
    });

    if (search.trim()) {
      params.set("query", search.trim());
    }

    const response = await fetch(
      `${TMDB_BASE_URL}${endpoint}?${params}`,

      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: `application/json`,
        },
        signal,
      },
    );

    if (!response.ok) {
      throw new Error(`TMDB request failed: ${response.status}`);
    }

    const data = await response.json();

    return {
      results: data.results,
      total_pages: data.total_pages,
      total_results: data.total_results,
      isLiveApi: true,
    };
  },
};
