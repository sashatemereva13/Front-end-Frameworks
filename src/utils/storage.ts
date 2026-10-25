const FAVORITES_KEY = "cinegrid_favorites";
const LEGACY_FAVORITES_KEY = "cinegrid_favorites";
const THEME_KEY = "cinegrid_theme";
const API_KEY = "cinegrid_api_key";

export function getFavorites(): Movie[] {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved !== null) return JSON.parse(saved);

    const legacySaved = localStorage.getItem(LEGACY_FAVORITES_KEY);
    if (legacySaved !== null) {
      localStorage.setItem(FAVORITES_KEY, legacySaved);
      return JSON.parse(legacySaved);
    }
    return [];
  } catch {
    return [];
  }
}

export function toggleFavorites(movie: Movie): Movie[] {
  const favorites = getFavorites();

  const alreadyFavorite = favorites.some(
    (favorite) => Number(favorite.id) === Number(movie.id),
  );

  const updatedFavorites = alreadyFavorite
    ? favorites.filter((favorite) => Number(favorite.id) !== Number(movie.id))
    : [movie, ...favorites];

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
  } catch {
    // Keep the updated favorites in React state if localStorage is unavailable.
  }

  return updatedFavorites;
}

export function getTheme(): Theme {
  const theme = localStorage.getItem(THEME_KEY);

  return theme === "light" ? "light" : "dark";
}

export function setTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export function getApiKey(): string {
  return localStorage.getItem(API_KEY) || "";
}

export function setApiKey(key: string) {
  localStorage.setItem(API_KEY, key.trim());
}
import type { Movie, Theme } from "../types";
