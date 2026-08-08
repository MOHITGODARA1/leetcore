import { NavLink } from "react-router-dom";
import {
  SquaresFour,
  Brain,
  Notebook,
  Building,
  User,
  CaretRight,
  Flame,
} from "@phosphor-icons/react";

function DashLeftNavbar() {
  const menu = [
    { name: "Dashboard", icon: SquaresFour, path: "/dashboard" },
    {
      name: "Interview Prep",
      icon: Brain,
      path: "/dashboard/data-structures-and-algorithms",
    },
    {
      name: "Online Assessment",
      icon: Notebook,
      path: "/dashboard/what's-next-on-leetcore",
    },
    {
      name: "Companies",
      icon: Building,
      path: "/dashboard/Career-oppertunity-on-leetcore",
    },
  ];

  const linkClass = ({ isActive }) =>
    `group relative flex items-center gap-3.5 rounded-xl px-4 py-3 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] ${
      isActive
        ? "bg-[var(--dash-accent-soft)] text-[var(--dash-accent)]"
        : "text-[var(--dash-muted)] hover:bg-[var(--dash-accent-softer)] hover:text-[var(--dash-text)]"
    }`;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-[var(--dash-line)] bg-[var(--dash-elevated)] lg:flex">
      <div className="flex flex-col gap-6 px-5 pt-7">
        <p className="dash-kicker px-2">Workspace</p>

        <nav aria-label="Primary" className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.name} to={item.path} className={linkClass}>
                {({ isActive }) => (
                  <>
                    <span
                      className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isActive ? "bg-[var(--dash-accent)] opacity-100" : "opacity-0"
                      }`}
                    />
                    <Icon
                      size={19}
                      weight={isActive ? "fill" : "regular"}
                      className={isActive ? "text-[var(--dash-accent)]" : ""}
                    />
                    <span className="text-[14px] font-semibold tracking-tight">
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Streak card */}
        <div className="rounded-2xl border border-[var(--dash-line)] bg-[var(--dash-panel)] p-4 shadow-[var(--shadow-sm)]">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--dash-warning-soft)] text-[var(--dash-warning)]">
              <Flame size={16} weight="duotone" />
            </span>
            <p className="text-[13px] font-semibold text-[var(--dash-text)]">
              Daily streak
            </p>
          </div>
          <p className="mt-2.5 text-[12px] leading-relaxed text-[var(--dash-muted)]">
            Solve one question a day to keep your practice sharp.
          </p>
        </div>
      </div>

      {/* Profile */}
      <div className="mt-auto border-t border-[var(--dash-line)] px-5 py-5">
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `group flex items-center justify-between rounded-xl px-3 py-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] ${
              isActive
                ? "bg-[var(--dash-accent-soft)] text-[var(--dash-accent)]"
                : "text-[var(--dash-muted)] hover:bg-[var(--dash-accent-softer)] hover:text-[var(--dash-text)]"
            }`
          }
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--dash-line)] bg-[var(--dash-panel)]">
              <User size={18} weight="duotone" className="text-[var(--dash-muted)]" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[14px] font-semibold text-[var(--dash-text)]">
                Profile
              </span>
              <span className="text-[11px] text-[var(--dash-faint)]">
                View your readiness
              </span>
            </span>
          </div>
          <CaretRight
            size={15}
            weight="bold"
            className="text-[var(--dash-faint)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5"
          />
        </NavLink>
      </div>
    </aside>
  );
}

export default DashLeftNavbar;