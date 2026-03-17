import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const NavBar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/rooms", label: "Rooms" },
    { to: "/flats", label: "Flats" },
    { to: "/intern-rooms", label: "Intern Rooms" },
    { to: "/combo", label: "Combo" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600"
        >
          Student Housing
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md font-medium transition ${
                    isActive
                      ? "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100"
                  }`
                }
              >
                My Bookings
              </NavLink>
              {user.role === "host" && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md font-medium transition ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white shadow-lg"
                        : "text-slate-600 hover:bg-slate-100"
                    }`
                  }
                >
                  Host Dashboard
                </NavLink>
              )}
              <button
                onClick={logout}
                className="ml-2 rounded-lg bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 px-4 py-2 text-white font-semibold shadow-md hover:scale-105 transition transform"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg border border-orange-500 text-orange-500 hover:bg-orange-50 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-medium shadow-md hover:scale-105 transition transform"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-slate-700 focus:outline-none"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg px-4 py-4 space-y-2 animate-fade-in">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink
                to="/my-bookings"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 font-medium"
              >
                My Bookings
              </NavLink>
              {user.role === "host" && (
                <NavLink
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-slate-700 hover:bg-slate-100 font-medium"
                >
                  Host Dashboard
                </NavLink>
              )}
              <button
                onClick={logout}
                className="w-full mt-2 rounded-lg bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white py-2 font-medium shadow-md hover:scale-105 transition transform"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-2 rounded-lg border border-orange-500 text-orange-500 hover:bg-orange-50 font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-medium shadow-md hover:scale-105 transition transform"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default NavBar;