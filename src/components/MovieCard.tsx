import type { Movie } from "../types";

// describes the shape of the props
interface MovieCardProps {
  movie: Movie;
}

export const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div>
      <h2>{movie.title}</h2>
      <img src={movie.poster_path} alt={movie.title} />
    </div>
  );
};
