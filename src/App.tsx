import { useState } from "react";
import type { Movie } from "./types";
import { SAMPLE_MOVIES } from "./data/sampleMovies";
import MovieList from "./components/MovieList";
import SearchBar from "./components/SearchBar";

function App() {
  // creates react state named movies
  // sample movies is the starting value
  // useState<Movie[]> -  state must be an array of movie objects
  const [movies] = useState<Movie[]>(SAMPLE_MOVIES);
  const [query, setQuery] = useState("");
  const [minRating, setMinRating] = useState(0);

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
        <h1>Movie App</h1>

        <section className="filter-bar">
          <SearchBar query={query} onChange={setQuery} />

          <label className="filter-actions-right">
            Minimum minRating
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
        <MovieList movies={filteredMovies} />
      </div>
    </main>
  );
}

export default App;
