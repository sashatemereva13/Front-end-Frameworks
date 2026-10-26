import { Link } from "react-router-dom";
import { ArrowLeft, Clapperboard, Heart, Search } from "lucide-react";
import styles from "./AboutPage.module.css";

function AboutPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link className={styles.backLink} to="/">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to movies
        </Link>

        <section className={styles.hero} aria-labelledby="about-title">
          <div className={styles.heroIcon} aria-hidden="true">
            <Clapperboard size={30} />
          </div>
          <p className={styles.eyebrow}>YOUR NEXT MOVIE NIGHT STARTS HERE</p>
          <h1 id="about-title">About CineGrid</h1>
          <p className={styles.intro}>
            A place to discover films, explore new genres, and keep track of
            the stories you want to watch.
          </p>
        </section>

        <section className={styles.features} aria-label="What you can do">
          <article className={styles.featureCard}>
            <span className={styles.featureIcon} aria-hidden="true">
              <Search size={20} />
            </span>
            <h2>Find your next favorite</h2>
            <p>
              Search movies, browse genres, and sort the results to find
              something worth watching.
            </p>
          </article>
          <article className={styles.featureCard}>
            <span className={styles.featureIcon} aria-hidden="true">
              <Heart size={20} />
            </span>
            <h2>Keep a watchlist</h2>
            <p>
              Save movies to your favorites and get recommendations based on
              the genres you enjoy.
            </p>
          </article>
        </section>

        <p className={styles.note}>
          Movie information is provided by TMDB. CineGrid is a student project
          and is not affiliated with TMDB.
        </p>
      </div>
    </main>
  );
}

export default AboutPage;
