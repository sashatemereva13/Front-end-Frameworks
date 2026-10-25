import { useState } from "react";
import MovieCard from "../components/MovieCard";

import { useMovies } from "../hooks/useMovies";
import type { Movie, SortOption, ViewMode } from "../types";
import FilterBar from "../components/FilterBar";
import Header from "../components/Header";

import ApiConfigModal from "../components/ApiConfigModal";
import StatsBanner from "../components/StatsBanner";
import MovieModal from "../components/MovieModal";

function HomePage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState<SortOption>("popularity");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [onlyFavourites, setOnlyFavourites] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [isApiConfigOpen, setIsApiConfigOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { movies, isLoading, error, isLiveApi } = useMovies({
    search: query,
    genre,
    sort,
    onlyFavourites,
    refreshKey,
  });

  return (
    <>
      <Header
        search={query}
        onSearch={setQuery}
        onlyFavourites={onlyFavourites}
        onToggleFavourites={() => setOnlyFavourites(!onlyFavourites)}
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

          {isLoading && <p> Loading them movies...</p>}
          {error && <p role="alert">{error}</p>}

          {!isLoading && !error && (
            <div className={`movies-grid ${viewMode === "list" ? "compact-view" : ""}`}>
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
