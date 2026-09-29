import { useEffect } from "react";
import { Heart, X, Youtube } from "lucide-react";
import type { Movie } from "../types";
import { getBackdropUrl, getPosterUrl } from "../data/sampleMovies";
import { getGenreNames } from "../data/genres";

interface MovieModalProps {
  movie: Movie;
  isFavourite: boolean;
  onClose: () => void;
  onToggleFavourite: (movie: Movie) => void;
}

function MovieModal({
  movie,
  isFavourite,
  onClose,
  onToggleFavourite,
}: MovieModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleBackdropClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(
    `${movie.title} trailer`,
  )}`;

  return (
    <div className="modal-overlay active" onClick={handleBackdropClick}>
      <section
        className="modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-modal-title"
      >
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close movie details"
        >
          <X />
        </button>

        <div
          className="modal-backdrop-hero"
          style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})` }}
        />

        <div className="modal-body">
          <img
            className="modal-poster"
            src={getPosterUrl(movie.poster_path)}
            alt={`${movie.title} poster`}
          />

          <div className="modal-content-details">
            <h2 id="movie-modal-title" className="modal-title">{movie.title}</h2>

            <div className="modal-meta-row">
              <span className="modal-meta-item">{movie.release_date}</span>
              <span className="modal-meta-item">Rating: {movie.vote_average.toFixed(1)}</span>
            </div>

            <div className="movie-genres-tags">
              {getGenreNames(movie.genre_ids).map((genreName) => (
                <span className="genre-tag" key={genreName}>{genreName}</span>
              ))}
            </div>

            <p className="modal-overview">{movie.overview}</p>

            <div className="modal-footer-actions">
              <button className="btn-primary" type="button" onClick={() => onToggleFavourite(movie)}>
                <Heart fill={isFavourite ? "currentColor" : "none"} />
                {isFavourite ? "Remove from favourites" : "Add to favourites"}
              </button>
              <a className="btn-secondary" href={trailerUrl} target="_blank" rel="noreferrer">
                <Youtube />
                Find trailer on YouTube
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MovieModal;
