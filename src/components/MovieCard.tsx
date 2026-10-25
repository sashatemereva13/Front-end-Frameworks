import type { Movie } from "../types";
import { getPosterUrl } from "../data/sampleMovies";
import { useAppContext } from "../context/AppContext";
import styles from "./MovieCard.module.css";

// describes the shape of the props
interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

const MovieCard = ({ movie, onClick }: MovieCardProps) => {
  const { isFavorite, toggleFavorite } = useAppContext();
  const favoriteActive = isFavorite(movie.id);

  const handleFavoriteOnClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    toggleFavorite(movie);
  };
  return (
    <div
      className={styles.movieCard}
      onClick={onClick}
      tabIndex={0}
      role="button"
    >
      <div className={styles.posterWrapper}>
        <img
          className={styles.posterImg}
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
        />
        <div className={styles.posterOverlay}>
          <div className={styles.cardTopBadges}>
            <span className={styles.ratingBadge}>
              {movie.vote_average.toFixed(1)}
            </span>

            <button
              className={`${styles.favoriteBtn} ${favoriteActive ? styles.isFavorite : ""}`}
              type="button"
              onClick={handleFavoriteOnClick}
              aria-label={
                favoriteActive ? "Remove from favorites" : "Add to favorites"
              }
            >
              {favoriteActive ? "♥" : "♡"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.movieCardInfo}>
        <h2 className={styles.movieCardTitle}>{movie.title}</h2>

        <div className={styles.movieCardMeta}>
          <span>{movie.release_date}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
