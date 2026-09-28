import { useState } from "react";
import MovieList from "../components/MovieList";
import SearchBar from "../components/SearchBar";
import { useMovies } from "../hooks/useMovies";

function HomePage() {
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);

  const { movies, isLoading, error } = useMovies();

  const filteredMovies = movies.filter((movie) => {
    const matchesQuery = movie.title
      .toLowerCase()
      .includes(query.toLowerCase());

    const matchesRating = movie.vote_average >= minRating;

    return matchesQuery && matchesRating;
  });

  return (
    <main className="app-layout">
      <div className="main-container">
        <h1> Movies </h1>
        <section className="filter-bar">
          <SearchBar query={query} onChange={setQuery} />

          <label className="filter-actions-right">
            Minimum Rating
            <input
              className="sort-select"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={minRating}
              onChange={(event) => setMinRating(Number(event.target.value))}
            />
          </label>
        </section>

        {isLoading && <p> Loading them movies...</p>}
        {error && <p role="alert">{error}</p>}
        {!isLoading && !error && <MovieList movies={filteredMovies} />}
      </div>
    </main>
  );
}

export default HomePage;
