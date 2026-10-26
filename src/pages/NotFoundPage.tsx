import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Clapperboard, House } from "lucide-react";
import styles from "./NotFoundPage.module.css";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="not-found-title">
        <div className={styles.icon} aria-hidden="true">
          <Clapperboard size={30} />
        </div>
        <h1 id="not-found-title">404 — page not found</h1>
        <p className={styles.message}>go home walter</p>
        <Link className={styles.homeLink} to="/">
          <House size={17} aria-hidden="true" />
          Back to CineGrid
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
