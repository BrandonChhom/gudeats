// codeProjects/gudeats/frontend/src/components/NavBar.jsx

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass = ({ isActive }) => (isActive ? "active" : undefined);
const navUserClass = ({ isActive }) => `nav-user${isActive ? " active" : ""}`;

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        GudEats
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/create" className={navLinkClass}>New Post</NavLink>
            <NavLink to={`/users/${user.username}`} className={navUserClass}>{user.username}</NavLink>
            <button type="button" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navLinkClass}>Log in</NavLink>
            <NavLink to="/register" className={navLinkClass}>Sign up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
