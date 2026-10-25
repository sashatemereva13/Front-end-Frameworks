# Milestone 2 Evaluation Guide

Evaluation topics: React Router, SPA navigation, data fetching, effects, Promises, and loading/error UI states.

## 1. BrowserRouter and SPA Navigation

In `src/App.tsx`, `BrowserRouter` wraps the route configuration:

```tsx
<AppProvider>
  <BrowserRouter>
    <Routes>
      {/* routes go here */}
    </Routes>
  </BrowserRouter>
</AppProvider>
```

`BrowserRouter` connects React Router to the browser URL and history. After the app is loaded, router links can change the URL and displayed page without reloading the whole HTML document. The initial app mount is in `src/main.tsx`.

## 2. Routes, Route, Matching, and Nesting

The app defines three sibling routes in `src/App.tsx`:

```tsx
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

React Router compares the current pathname with each route's `path` and renders the matching `element`. In this app, `/` shows `HomePage`, and `/about` shows `AboutPage`.

These routes are **not nested**. React Router supports nested routes, usually with a parent layout that renders an `<Outlet />` where a matching child page appears. This example illustrates the pattern, but it is not used by this project:

```tsx
<Route path="/movies" element={<MoviesLayout />}>
  <Route path=":movieId" element={<MovieDetailsPage />} />
</Route>
```

A matching nested route would render inside `MoviesLayout`'s `<Outlet />`.

## 3. Wildcard Route and 404 Page

The wildcard route in `src/App.tsx` is the fallback for paths that don't match the named routes:

```tsx
<Route path="*" element={<NotFoundPage />} />
```

`src/pages/NotFoundPage.tsx` displays a 404 message and a router link back to `/`. For example, visiting `/made-up-path` renders the not-found page instead of the home or About page.

## 4. Link / NavLink Versus an Anchor

The navigation in `src/components/Header.tsx` uses `NavLink`:

```tsx
<NavLink to="/" end>Home</NavLink>
<NavLink to="/about">About</NavLink>
```

`src/pages/AboutPage.tsx` uses `Link` to return home:

```tsx
<Link to="/">Back to Home</Link>
```

`Link` and `NavLink` render link elements, but React Router intercepts normal clicks and performs client-side navigation. A plain `<a href="/about">` normally makes the browser request and load a new document, losing the SPA transition. Use router links for internal routes.

## 5. Fetching with useEffect

`src/hooks/useMovies.ts` runs the movie-loading task from an effect:

```tsx
useEffect(() => {
  const controller = new AbortController();
  let cancelled = false;

  async function loadMovies() {
    try {
      setIsLoading(true);
      setError(null);

      const data = await movieService.fetchMovies({
        search,
        genre,
        sort,
        onlyFavourites,
        page,
        signal: controller.signal,
      });

      if (!cancelled) {
        setMovies(data.results);
        setIsLiveApi(data.isLiveApi);
      }
    } catch (error) {
      const wasAborted =
        error instanceof DOMException && error.name === "AbortError";

      if (!cancelled && !wasAborted) {
        setError("Unable to load movies. Please try again later");
      }
    } finally {
      if (!cancelled) {
        setIsLoading(false);
      }
    }
  }

  loadMovies();

  return () => {
    cancelled = true;
    controller.abort();
  };
}, [search, genre, sort, onlyFavourites, page, refreshKey]);
```

Rendering should describe the UI from current state. Fetching talks to an external service and updates state, so it is a side effect and belongs in `useEffect`, not directly in render.

## 6. useEffect Callback and Dependency Array

The first argument to `useEffect` is its callback; the second argument is the dependency array. The movie effect depends on search, genre, sort, favourite filtering, page, and refresh key. React runs it after mount and again when a dependency changes. For example, typing a new search updates `search`, which causes the effect to load movies again.

This project does **not** use an empty dependency array for its movie fetch. General pattern:

```tsx
useEffect(() => {
  // run after mount
}, []);
```

An empty array means the effect has no changing dependencies and normally runs only after mount. In development, React `StrictMode` can perform an extra setup/cleanup cycle to help detect effect bugs. The app enables `StrictMode` in `src/main.tsx`.

## 7. Async Work Inside an Effect

The effect callback in `src/hooks/useMovies.ts` is not itself `async`. Instead, it defines and calls an inner async function:

```tsx
useEffect(() => {
  async function loadMovies() {
    const data = await movieService.fetchMovies({
      search,
      genre,
      sort,
      onlyFavourites,
      page,
      signal: controller.signal,
    });
    setMovies(data.results);
  }

  loadMovies();
}, [search, genre, sort, onlyFavourites, page, refreshKey]);
```

An `async` function always returns a Promise. React expects an effect callback to return either nothing or a cleanup function, not a Promise. Defining an inner async function lets the effect call async code while still returning cleanup synchronously.

## 8. fetch(), Promises, and JSON Parsing

The live API request is in `src/services/movieService.ts`:

```tsx
const response = await fetch(
  `https://api.themoviedb.org/3${endpoint}?${params}`,
  { signal },
);

if (!response.ok) {
  throw new Error(`TMDB request failed: ${response.status}`);
}

const data = await response.json();
```

`fetch()` returns a Promise that resolves to a `Response`. `await` waits for that Promise. `response.json()` parses the response body and also returns a Promise, so it is awaited too.

The service can also return local sample data when no API key is configured; the `fetch()` path is used for live TMDB requests.

## 9. Error Handling: Network and HTTP Errors

A network failure (for example, a connection failure) rejects the `fetch()` Promise and enters the hook's `catch` block. An HTTP status such as 401 is different: `fetch()` usually still resolves to a `Response`. That's why the service checks `response.ok` and throws when it is false.

The hook catches request errors and sets a friendly message:

```tsx
} catch (error) {
  const wasAborted =
    error instanceof DOMException && error.name === "AbortError";

  if (!cancelled && !wasAborted) {
    setError("Unable to load movies. Please try again later");
  }
}
```

Aborts are expected during cleanup, so the hook doesn't show them as user-facing failures.

## 10. Loading and Error State with useState

At the top of `useMovies` in `src/hooks/useMovies.ts`:

```tsx
const [movies, setMovies] = useState<Movie[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

`isLoading` begins as `true`, `error` begins as `null`, and `movies` begins empty. When a request starts, the hook sets loading to true and clears the previous error. Success stores the result; failure sets an error; `finally` turns loading off.

## 11. Conditional Rendering and Loading Indicator

`src/pages/HomePage.tsx` chooses what to display based on the hook state:

```tsx
{isLoading && <p> Loading them movies...</p>}
{error && <p role="alert">{error}</p>}

{!isLoading && !error && (
  <div className="movies-grid">
    {movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} />
    ))}
  </div>
)}
```

While data is in flight, the loading message is shown. The card grid is only rendered once loading has finished and there is no error. When the successful result contains no movies, the page displays `NO movies found` instead.

## 12. Graceful Degradation on Error

On failure, `HomePage` shows the alert and skips the movie grid. Movie titles are `<h2>` elements inside `src/components/MovieCard.tsx`, so no movie-title headings are displayed while loading or after an error. The page's own `Movies` `<h1>` remains visible; the missing headings are the movie-card titles, not every heading on the page.

## Quick Recall

- `BrowserRouter` enables URL-backed client-side routing.
- `Routes` contains `Route` definitions; `path` selects the page element.
- `*` catches unmatched paths.
- Use `Link` / `NavLink` for internal SPA navigation.
- Fetching is a side effect, so do it in `useEffect`.
- The effect callback stays synchronous; put `async` work in an inner function.
- `fetch()` resolves to a `Response`; check `response.ok`; parse with `response.json()`.
- Track pending, success, and failure with state, then conditionally render the right UI.
- Cleanup aborts obsolete requests and prevents stale state updates.
