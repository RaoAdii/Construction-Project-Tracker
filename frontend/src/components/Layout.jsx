import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          <span className="brand-mark">C</span>
          <div>
            <strong>Construction</strong>
            <p>Operations board</p>
          </div>
        </Link>

        <nav className="nav-stack">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/consultants">Consultants</NavLink>
          {user?.role === "admin" ? (
            <NavLink to="/admin/projects">Admin Portal</NavLink>
          ) : null}
          <NavLink to="/projects/new">New Project</NavLink>
        </nav>

        <div className="sidebar-user">
          <p>{user?.fullName}</p>
          <span>{user?.jobTitle}</span>
          <button type="button" className="ghost-button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Modernized stack</p>
            <h1>Project command center</h1>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
