import { createContext, useContext, useEffect, useReducer } from "react";
import type { Dispatch, ReactNode } from "react";
import type { Movie, Theme } from "../types";
import * as storage from "../utils/storage";

interface State {
  favorites: Movie[];
  theme: Theme;
}


// the shared property named type
// is the disriminant
// its exact string value tells TS all secrets

// disriminated union
// either action is allowed
type Action =
  | { type: "TOGGLE_FAVORITE"; payload: Movie }
  | { type: "SET_THEME"; payload: Theme };

  // TS narrows action to {type:...; payload:...}
  // so action.payload is a moie

interface AppContextValue extends State {
  toggleTheme: () => void;
  toggleFavorite: (movie: Movie) => void;
  isFavorite: (id: number) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);


// reducer reduces
// a sequence of actions
// into one current state

// not safe to call twice
// like in react strict mode
// cuz it calls twice in development
function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_FAVORITE": {
      const isAlreadyFavorite = state.favorites.some(
        (favorite) => Number(favorite.id) === Number(action.payload.id),
      );
      const favorites = isAlreadyFavorite
        ? state.favorites.filter(
            (favorite) => Number(favorite.id) !== Number(action.payload.id),
          )
        : [action.payload, ...state.favorites];

      return { ...state, favorites };
    }
    case "SET_THEME":
      return { ...state, theme: action.payload };
  }
}

// get initial state for the useReducer
function createInitialState(): State {
  return { favorites: storage.getFavorites(), theme: storage.getTheme() };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch]: [State, Dispatch<Action>] = useReducer(
    reducer,
    undefined,
    createInitialState,
  );


  useEffect(() => {
    storage.setTheme(state.theme);
    // runs after the initial render and whenever the theme changes
  }, [state.theme]);

  useEffect(() => {
    storage.setFavorites(state.favorites);
  }, [state.favorites]);

  // helper function to get dispatch values
  function toggleTheme() {
    dispatch({
      type: "SET_THEME",
      payload: state.theme === "dark" ? "light" : "dark",
    });
  }

  function toggleFavorite(movie: Movie) {
    dispatch({ type: "TOGGLE_FAVORITE", payload: movie });
  }

  const value: AppContextValue = {
    ...state,
    toggleTheme,
    toggleFavorite,
    isFavorite: (id) =>
      state.favorites.some((movie) => Number(movie.id) === Number(id)),
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
