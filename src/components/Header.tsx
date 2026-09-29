import { NavLink } from "react-router-dom";
import type { Theme } from "../types";
import { Heart, Moon, Search, Settings, Sun } from "lucide-react";

interface HeaderProps {
  search: string;
  onSearch: (search: string) => void;
  onlyFavourites: boolean;
  onToggleFavourites: () => void;
  theme: Theme;
  onToggleTheme: () => void;
  favCount: number;
  onOpenApiConfig: () => void;
}

function Header({
  search,
  onSearch,
  onlyFavourites,
  onToggleFavourites,
  theme,
  onToggleTheme,
  favCount,
  onOpenApiConfig,
}: HeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" end className="brand-logo">
          <span className="logo-dot" />
          <span className="logo-text">CineGrid</span>
          <span className="brand-badge">Movies</span>
        </NavLink>

        <nav className="header-nav" aria-label="Main navigation">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>

        <label className="header-search">
          <span className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              className="search-input"
              type="text"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search movies..."
              aria-label="Search movies"
            />
          </span>
        </label>

        <div className="header-actions">
          <button
            type="button"
            className={`btn-icon-label ${onlyFavourites ? "active" : ""}`}
            onClick={onToggleFavourites}
          >
            <Heart fill={onlyFavourites ? "currentColor" : "none"} size={18} />
            <span>Favourites</span>
            <span className="count-badge">{favCount}</span>
          </button>
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            className="btn-icon-label"
            onClick={onOpenApiConfig}
          >
            <Settings size={18} />
            <span>API Key</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
