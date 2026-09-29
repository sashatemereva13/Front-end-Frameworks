interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ query, onChange }: SearchBarProps) => {
  return (
    <div className="header-search">
      <div className="search-input-wrapper">
        <input
          className="search-input"
          type="text"
          placeholder="just what you are looking for..."
          value={query}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
