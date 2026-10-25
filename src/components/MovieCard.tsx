import type { Movie } from "../types";
import { getPosterUrl } from "../data/sampleMovies";
import { useAppContext } from "../context/AppContext";
import styles from "./MovieCard.module.css";

// describes the shape of the props
interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

const MovieCard = ({
  movie,
  onClick,
}: MovieCardProps) => {
  const { isFavorite, toggleFavorite } = useAppContext();
  const favouriteActive = isFavorite(movie.id);

  const handleFavouriteOnClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    toggleFavorite(movie);
  };
  return (
    <div className={styles.movieCard} onClick={onClick} tabIndex={0} role="button">
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
              className={`${styles.favoriteBtn} ${favouriteActive ? styles.isFavorite : ""}`}
              type="button"
              onClick={handleFavouriteOnClick}
              aria-label={
                favouriteActive
                  ? "Remove from favourites"
                  : "Add to favourites"
              }
            >
              {favouriteActive ? "♥" : "♡"}
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
