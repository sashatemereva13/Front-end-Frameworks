import { useState } from "react";
import MovieCard from "../components/MovieCard";

import { useMovies } from "../hooks/useMovies";
import { useGenres } from "../hooks/useGenres";
import type { Movie, SortOption, ViewMode } from "../types";
import FilterBar from "../components/FilterBar";
import Header from "../components/Header";

import ApiConfigModal from "../components/ApiConfigModal";
import StatsBanner from "../components/StatsBanner";
import MovieModal from "../components/MovieModal";

import { useAppContext } from "../context/AppContext";
import { getRecommendations } from "../utils/recommendations";
import { getGenreNames } from "../data/genres";
import { Sparkles } from "lucide-react";
import styles from "./HomePage.module.css";

function HomePage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState<SortOption>("popularity");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { favorites } = useAppContext();

  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { movies, isLoading, error, isLiveApi } = useMovies({
    search: query,
    genre,
    sort,
    onlyFavorites,
    refreshKey,
  });

  const {
    genres,
    isLoading: isLoadingGenres,
    error: genresError,
  } = useGenres(refreshKey);

  // calculated every time, not saved separately
  // when search/genre/favorites state change, the
  // recommendations become re-calculated
  const recommendations = getRecommendations(movies, favorites);

  return (
    <>
      <Header
        search={query}
        onSearch={setQuery}
        onlyFavorites={onlyFavorites}
        onToggleFavorites={() => setOnlyFavorites(!onlyFavorites)}
        onOpenApiConfig={() => setIsApiConfigOpen(true)}
      />

      <main className="app-layout">
        <div className="main-container">
          <h1> Movies </h1>

          <FilterBar
            genre={genre}
            genres={genres}
            onGenreChange={setGenre}
            sort={sort}
            onSortChange={setSort}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {isApiConfigOpen && (
            <ApiConfigModal
              onClose={() => setIsApiConfigOpen(false)}
              onSaved={() => setRefreshKey((currentKey) => currentKey + 1)}
            />
          )}

          <StatsBanner movies={movies} genre={genre} isLiveApi={isLiveApi} />

          {!isLoading && !error && !onlyFavorites && (
            <section
              className={styles.recommendations}
              aria-labelledby="recommendations-title"
            >
              <div className={styles.recommendationsHeader}>
                <span className={styles.recommendationsIcon} aria-hidden="true">
                  <Sparkles size={20} />
                </span>
                <div>
                  <p className={styles.eyebrow}>PERSONALIZED PICKS</p>
                  <h2 id="recommendations-title">Recommended for you</h2>
                </div>
              </div>

              {recommendations.length === 0 ? (
                <p className={styles.emptyMessage}>
                  {favorites.length === 0
                    ? "Add some movies to your favorites to get personalised recommendations."
                    : "No recommendations match these movies. Try a different search or genre."}
                </p>
              ) : (
                <div className={styles.recommendationGrid}>
                  {recommendations.map(({ movie, matchedGenreIds }) => (
                    <article
                      className={styles.recommendationCard}
                      key={movie.id}
                    >
                      <MovieCard
                        movie={movie}
                        onClick={() => setSelectedMovie(movie)}
                      />
                      <p className={styles.recommendationReason}>
                        <span>Matches your taste</span>
                        {getGenreNames(matchedGenreIds).join(", ")}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {isLoading && <p> Loading them movies...</p>}
          {error && <p role="alert">{error}</p>}

          {!isLoading && !error && (
            <div
              className={`movies-grid ${viewMode === "list" ? "compact-view" : ""}`}
            >
              {movies.length === 0 ? (
                <p> NO movies found</p>
              ) : (
                movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onClick={() => setSelectedMovie(movie)}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </>
  );
}

export default HomePage;
