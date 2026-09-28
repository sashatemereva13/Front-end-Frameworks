import type { Movie } from "../types";
import { getPosterUrl } from "../data/sampleMovies";
import { useState } from "react";

// describes the shape of the props
interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}


const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const [isFavourite, setIsFavourite] = useState(false);

  const handleFavouriteOnClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    setIsFavourite(!isFavourite);
  };
  return (
    <div className="movie-card" onClick={onClick} tabIndex={0} role="button">
      <div className="poster-wrapper">
        <img
          className="poster-img"
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
        />
        <div className="poster-overlay">
          <div className="card-top-badges">
            <span className="rating-badge">
              {movie.vote_average.toFixed(1)}
            </span>

            <button
              className={`favorite-btn ${isFavourite ? "is-favorite" : ""}`}
              type="button"
              onClick={handleFavouriteOnClick}
              aria-label={
                isFavourite ? "Remove from favourites" : "Add to favourites"
              }
            >
              {isFavourite ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </div>

      <div className="movie-card-info">
        <h2 className="movie-card-title">{movie.title}</h2>

        <div className="movie-card-meta">
          <span>{movie.release_date}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
