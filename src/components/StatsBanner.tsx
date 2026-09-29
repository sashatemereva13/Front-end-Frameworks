import type { Movie } from "../types";
import { GENRES } from "../data/genres";
import { Clapperboard, Radio, Star, Tag } from "lucide-react";

interface StatsBannerProps {
  movies: Movie[];
  genre: string;
  isLiveApi: boolean;
}

function StatsBanner({ movies, genre, isLiveApi }: StatsBannerProps) {
  const averageRating =
    movies.length === 0
      ? 0
      : movies.reduce((total, movie) => total + movie.vote_average, 0) /
        movies.length;

  const genreName =
    genre === "all" ? "All genres" : GENRES[Number(genre)] || "Other";

  return (
    <section className="stats-banner">
      <div className="stat-card">
        <span className="stat-icon"><Clapperboard size={20} /></span>
        <span className="stat-info"><strong className="stat-value">{movies.length}</strong><span className="stat-label">Results</span></span>
      </div>
      <div className="stat-card">
        <span className="stat-icon"><Star size={20} /></span>
        <span className="stat-info"><strong className="stat-value">{averageRating.toFixed(1)}</strong><span className="stat-label">Average rating</span></span>
      </div>
      <div className="stat-card">
        <span className="stat-icon"><Tag size={20} /></span>
        <span className="stat-info"><strong className="stat-value">{genreName}</strong><span className="stat-label">Active genre</span></span>
      </div>
      <div className="stat-card">
        <span className="stat-icon"><Radio size={20} /></span>
        <span className="stat-info"><strong className="stat-value">{isLiveApi ? "Live" : "Local"}</strong><span className="stat-label">Data source</span></span>
      </div>
    </section>
  );
}

export default StatsBanner;
