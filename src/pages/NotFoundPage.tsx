import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="app-layout">
      <div className="main-container">
        <h1> 404 - page not found</h1>
        <p> the page you requested wasnt found soz</p>

        <Link to="/"> go home walter</Link>
      </div>
    </main>
  );
}

export default NotFoundPage;
