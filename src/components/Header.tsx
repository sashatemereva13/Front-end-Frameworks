import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header>
      <nav aria-lavel="Main navigation">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/about">About</NavLink>
      </nav>
    </header>
  );
}

export default Header;
