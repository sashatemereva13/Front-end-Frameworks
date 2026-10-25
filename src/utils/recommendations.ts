import type { Movie } from "../types";

export interface Recommendation {
  movie: Movie;
  score: number;
  matchedGenreIds: number[];
}

// the caller must provide a list of movies to consider
export function getRecommendations(
  candidates: Movie[],
  favorites: Movie[],
  limit = 3,
): Recommendation[] {
  // favorites is an array of Movie objects
  // we want a collection of just their ids
  // set keeps each value only once
  const favoriteIds = new Set(favorites.map((movie) => movie.id));
  // the preference map
  const genrePreferenceCounts = new Map<number, number>();

  for (const favorite of favorites) {
    // count a genre at most once for each movie in favorites
    const uniqueGenreIds = new Set(favorite.genre_ids);

    // how often each genre appears in users favorites
    for (const genreId of uniqueGenreIds) {
      const currentCount = genrePreferenceCounts.get(genreId) ?? 0;
      genrePreferenceCounts.set(genreId, currentCount + 1);
    }
  }
  // for each movie that isn't already a favorite
  // add the counts for its genres
  // that match those preferences
  return candidates
    .filter((movie) => !favoriteIds.has(movie.id)) // is it already in favorites?
    .map((movie) => {
      const uniqueGenreIds = new Set(movie.genre_ids);
      const matchedGenreIds = [...uniqueGenreIds].filter(
        (genreId) => genrePreferenceCounts.has(genreId), // for each candidate movie, which os that movie's genres are present in the preference map?
      );

      // add up preference counts for all candidate movie's matching genres
      const score = matchedGenreIds.reduce(
        (total, genreId) => total + (genrePreferenceCounts.get(genreId) ?? 0),
        0, // result -> a recommendation score for every genre
      );

      return { movie, score, matchedGenreIds };
    }) // only keep movies with a score > 0
    .filter((recommendation) => recommendation.score > 0)
    .sort(
      // sort them with the highest score first
      (first, second) =>
        second.score - first.score ||
        second.movie.popularity - first.movie.popularity ||
        first.movie.title.localeCompare(second.movie.title),
    )
    .slice(0, limit);
}
