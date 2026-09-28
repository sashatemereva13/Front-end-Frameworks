import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <main className="app-layout">
      <div className="main-container">
        <h1>About CineGrid</h1>
        <p>Discover and explore movies.</p>

        <Link to="/">Back to Home</Link>
      </div>
    </main>
  );
}

export default AboutPage;
