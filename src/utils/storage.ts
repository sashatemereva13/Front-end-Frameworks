const FAVORITES_KEY = "cinegrid_favorites";
const LEGACY_FAVOURITES_KEY = "cinegrid_favourites";
const THEME_KEY = "cinegrid_theme";
const API_KEY = "cinegrid_api_key";

export function getFavourites(): Movie[] {
  try {
    const saved = localStorage.getItem(FAVORITES_KEY);
    if (saved !== null) return JSON.parse(saved);

    const legacySaved = localStorage.getItem(LEGACY_FAVOURITES_KEY);
    if (legacySaved !== null) {
      localStorage.setItem(FAVORITES_KEY, legacySaved);
      return JSON.parse(legacySaved);
    }
    return [];
  } catch {
    return [];
  }
}

export function toggleFavourites(movie: Movie): Movie[] {
  const favourites = getFavourites();

  const alreadyFavourite = favourites.some(
    (favourite) => Number(favourite.id) === Number(movie.id),
  );

  const updatedFavourites = alreadyFavourite
    ? favourites.filter(
        (favourite) => Number(favourite.id) !== Number(movie.id),
      )
    : [movie, ...favourites];

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavourites));
  } catch {
    // Keep the updated favourites in React state if localStorage is unavailable.
  }

  return updatedFavourites;
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
