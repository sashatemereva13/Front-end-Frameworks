interface SearchBarProps {
  query: string;
  // void doesn't return any value
  // onchange receies and finishes without return
  onChange: (value: string) => void;
}

export const SearchBar = ({ query, onChange }: SearchBarProps) => {
  return (
    <div className="header-search">
      <div className="search-input-wrapper">
        <input
          className="search-input"
          type="search"
          placeholder="just what you are looking for..."
          value={query}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
};
