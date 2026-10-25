import { createContext, useContext, useEffect, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import type { Movie, Theme } from "../types";
import * as storage from "../utils/storage";

interface State {
  favorites: Movie[];
  theme: Theme;
}

type Action =
  | { type: "TOGGLE_FAVOURITE"; payload: Movie }
  | { type: "SET_THEME"; payload: Theme };

interface AppContextValue extends State {
  toggleTheme: () => void;
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (id: number) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_FAVOURITE":
      storage.toggleFavourites(action.payload);
      return { ...state, favorites: storage.getFavourites() };
    case "SET_THEME":
      return { ...state, theme: action.payload };
  }
}

function createInitialState(): State {
  return { favorites: storage.getFavourites(), theme: storage.getTheme() };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch]: [State, Dispatch<Action>] = useReducer(
    reducer,
    undefined,
    createInitialState,
  );

  useEffect(() => {
    storage.setTheme(state.theme);
  }, [state.theme]);

  function toggleTheme() {
    dispatch({ type: "SET_THEME", payload: state.theme === "dark" ? "light" : "dark" });
  }

  function toggleFavorite(movie: Movie) {
    dispatch({ type: "TOGGLE_FAVOURITE", payload: movie });
  }

  const value: AppContextValue = {
    ...state,
    toggleTheme,
    toggleFavorite,
    isFavorite: (id) => state.favorites.some((movie) => Number(movie.id) === Number(id)),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
