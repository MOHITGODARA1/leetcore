import {
  SquaresFour,
  Stack,
  Database,
  Terminal,
  Network,
  Brain,
  FileCode,
  TreeStructure,
} from "@phosphor-icons/react";

const topics = [
  { name: "All Topics", icon: SquaresFour },
  { name: "Data Structures", icon: Stack },
  { name: "Database", icon: Database },
  { name: "Operating System", icon: Terminal },
  { name: "Computer Networks", icon: Network },
  { name: "OOPs", icon: Brain },
  { name: "System Design", icon: FileCode },
  { name: "Low Level Design", icon: TreeStructure },
  { name: "Prep & Tools", icon: Brain },
];

function Mainnavbar({ activeTab, setActiveTab }) {
  return (
    <div className="pt-12">
      <div
        role="tablist"
        aria-label="Filter topics by category"
        className="flex w-max max-w-full items-center gap-1 overflow-x-auto rounded-full border border-[var(--dash-line)] bg-[var(--dash-panel)] p-1 shadow-[var(--shadow-sm)] scrollbar-hide"
      >
        {topics.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <button
              key={item.name}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActiveTab(item.name)}
              className={`relative flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none ${
                isActive
                  ? "bg-[var(--dash-accent)] text-white shadow-[var(--shadow-sm)]"
                  : "text-[var(--dash-muted)] hover:text-[var(--dash-text)]"
              }`}
            >
              <Icon
                size={15}
                weight={isActive ? "fill" : "regular"}
                className={isActive ? "" : "opacity-80"}
              />
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Mainnavbar;