import type { Movie } from "../types";
import { MovieCard } from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
}

export const MovieList = ({ movies }: MovieListProps) => {
  if (movies.length === 0) {
    return <p> No movies found.</p>;
  }

  return (
    <div className="movies-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};
