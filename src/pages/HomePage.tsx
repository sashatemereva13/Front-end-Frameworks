import { useState } from "react";
import MovieCard from "../components/MovieCard";

import { useMovies } from "../hooks/useMovies";
import type { Movie, SortOption, ViewMode } from "../types";
import FilterBar from "../components/FilterBar";
import Header from "../components/Header";

import ApiConfigModal from "../components/ApiConfigModal";
import StatsBanner from "../components/StatsBanner";
import MovieModal from "../components/MovieModal";

import { useAppContext } from "../context/AppContext";
import { getRecommendations } from "../utils/recommendations";
import { getGenreNames } from "../data/genres";

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
            <section aria-labelledby="recommendations-title">
              <h2 id="recommendations-title">Recommended for you</h2>

              {recommendations.length === 0 ? (
                <p>
                  {favorites.length === 0
                    ? "Add some movies to your favorites to get personalised recommendations."
                    : "No recommendations match these movies. Try a different search or genre."}
                </p>
              ) : (
                // favorites-only cannot produce recommendations
                // because then it stops being a recommendation
                <div className="movies-grid">
                  {recommendations.map(({ movie, matchedGenreIds }) => (
                    <div key={movie.id}>
                      {/* clicking a recommendation reuses the same modal */}
                      <MovieCard
                        movie={movie}
                        onClick={() => setSelectedMovie(movie)}
                      />
                      <p>
                        Because you like{" "}
                        {getGenreNames(matchedGenreIds).join(", ")}
                      </p>
                    </div>
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
