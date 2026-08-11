import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

/* Flat, border-only top bar for the profile page. No shadow, no glass. */
const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Problems", href: "/dashboard/data-structures-and-algorithms" },
  /* NOTE: there is no dedicated /contests route in the app yet — the
     Contest Standing tab lives on the profile page, so the "Contests"
     link points there instead of fabricating a new page. */
  { label: "Contests", href: "/dashboard/profile" },
];

const getInitials = (name) => {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
};

function ProfileNavbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const name = user?.name || user?.username || "Coder";
  const initials = getInitials(name);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
      <div className="mx-auto flex h-16 w-full max-w-[1400px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/dashboard" aria-label="LeetCore home" className="flex shrink-0 items-center gap-2.5">
          <img src="/leetcorelogo.png" alt="LeetCore logo" className="h-9 w-9 object-contain" />
          <span className="hidden font-display text-[17px] font-bold tracking-tight text-[var(--text-primary)] sm:inline">
            LeetCore
          </span>
        </Link>

        {/* Center nav */}
        <nav aria-label="Primary" className="mx-auto hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((item) => {
            const isActive =
              item.href === "/dashboard/profile"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.label}
                to={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-3.5 py-2 text-[13.5px] font-medium tracking-tight transition-colors duration-150 ${
                  isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-px h-px bg-[var(--accent-gold)]" aria-hidden="true" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Avatar + name dropdown */}
        <div className="relative ml-auto flex shrink-0 items-center md:ml-0">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
            className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-colors duration-150 ${
              open
                ? "border-[var(--border-strong)] bg-[var(--bg-card)]"
                : "border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--border-strong)]"
            }`}
          >
            <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-full border border-[var(--border-strong)] bg-[var(--bg-card-alt)] text-[12px] font-semibold text-[var(--text-secondary)]">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="h-full w-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              ) : (
                initials
              )}
            </span>
            <span className="hidden max-w-[9rem] truncate text-[13px] font-medium text-[var(--text-primary)] sm:inline">
              {name}
            </span>
            <ChevronDown size={14} className={`text-[var(--text-muted)] transition-transform duration-150 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
          </button>

          {open && (
            <div
              ref={menuRef}
              role="menu"
              className="absolute right-0 top-[calc(100%+0.5rem)] w-56 overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]"
            >
              <div className="border-b border-[var(--border-color)] px-4 py-3">
                <p className="truncate text-[13px] font-semibold text-[var(--text-primary)]">{name}</p>
                <p className="mt-0.5 truncate text-[11.5px] text-[var(--text-muted)]">@{user?.username || "guest"}</p>
              </div>
              <div role="menuitem">
                <Link
                  to="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
                >
                  <UserRound size={15} aria-hidden="true" />
                  My profile
                </Link>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 border-t border-[var(--border-color)] px-4 py-2.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--bg-card)] hover:text-[var(--text-primary)]"
              >
                <LogOut size={15} aria-hidden="true" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default ProfileNavbar;