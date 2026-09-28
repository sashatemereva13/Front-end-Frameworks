const FAVOURITES_KEY = "cinegrid_favourites";
const THEME_KEY = "cinegrid_theme";
const API_KEY = "cinegrid_api_key";

export function getFavourites() {
  try {
    return JSON.parse(localStorage.getItem(FAVOURITES_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleFavourites(movie) {
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
    localStorage.setItem(FAVOURITES_KEY, JSON.stringify(updatedFavourites));
  } catch {}

  return updatedFavourites;
}

export function getTheme() {
  const theme = localStorage.getItem(THEME_KEY);

  return theme === "light" ? "light" : "dark";
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export function getApiKey(key) {
  return localStorage.getItem(API_KEY) || "";
}

export function setApiKey(key) {
  localStorage.setItem(API_KEY, key.trim());
}
