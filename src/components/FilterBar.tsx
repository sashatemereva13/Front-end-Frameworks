import { Grid2X2, List } from "lucide-react";
import type { Genre, SortOption, ViewMode } from "../types";
import type { SortOption, ViewMode } from "../types";

interface FilterBarProps {
  genre: string;
  genres: Genre[];
  onGenreChange: (genre: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (viewMode: ViewMode) => void;
}

function FilterBar({
  genre,
  genres,
  onGenreChange,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
}: FilterBarProps) {
  return (
    <section className="filter-bar">
      <div className="genre-pills-scroll" aria-label="Genre filters">
        <button
          type="button"
          className={`genre-pill ${genre === "all" ? "active" : ""}`}
          onClick={() => onGenreChange("all")}
        >
          All
        </button>
        {/* Each fetched genre is an object like { id: 28, name: "Action" }. 
        The existing genre state is a string, 
so String(id) makes the comparison and 
callback use the same type. */}
        {genres.map(({ id, name }) => (
          <button
            key={id}
            type="button"
            className={`genre-pill ${genre === String(id) ? "active" : ""}`}
            onClick={() => onGenreChange(String(id))}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="filter-actions-right">
        <label className="sort-select-wrapper">
          <select
            className="sort-select"
            value={sort}
            onChange={(event) => onSortChange(event.target.value as SortOption)}
          >
            <option value="popularity"> Popularity </option>
            <option value="vote_average"> Rating </option>
            <option value="release_date"> Release date </option>
            <option value="title"> Title </option>
          </select>
        </label>

        <div className="view-toggle-group">
          <button
            type="button"
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            aria-label="Grid view"
            onClick={() => onViewModeChange("grid")}
          >
            <Grid2X2 />
          </button>
          <button
            type="button"
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            aria-label="List view"
            onClick={() => onViewModeChange("list")}
          >
            <List />
          </button>
        </div>
      </div>
    </section>
  );
}

export default FilterBar;
