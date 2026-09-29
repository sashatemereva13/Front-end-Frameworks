import type { Movie } from "../types";
import MovieCard from "./MovieCard";

interface MovieListProps {
  movies: Movie[];
  onMovieClick?: (movie: Movie) => void;
  isFavourite?: (movie: Movie) => boolean;
  onToggleFavourite?: (movie: Movie) => void;
}

const MovieList = ({
  movies,
  onMovieClick,
  isFavourite,
  onToggleFavourite,
}: MovieListProps) => {
  if (movies.length === 0) {
    return <p> No movies found.</p>;
  }

  return (
    <div className="movies-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => onMovieClick?.(movie)}
          isFavourite={isFavourite?.(movie)}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  );
};

export default MovieList;
