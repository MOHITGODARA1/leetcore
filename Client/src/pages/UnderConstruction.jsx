import { useLocation } from "react-router-dom";
import { Wrench } from "@phosphor-icons/react";
import Upperdashnavbar from "../components/common/dashuppernavbar";

const TITLES = {
  "/dashboard/interview-preparation": "Interview Prep",
  "/dashboard/what's-next-on-leetcore": "Online Assessment",
  "/dashboard/Career-oppertunity-on-leetcore": "Companies",
};

function UnderConstruction() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] || "This section";

  return (
    <div className="h-screen overflow-hidden bg-[var(--lc-bg)] text-[var(--lc-text)] flex flex-col">
      <Upperdashnavbar />
      <main className="flex flex-1 min-h-0 items-center justify-center overflow-y-auto p-6 sm:p-8">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[rgba(24,24,28,0.12)] bg-[#f7f5f0] shadow-[var(--shadow-md)]">
            <Wrench size={26} weight="duotone" className="text-[#d97706]" />
          </div>
          <p className="dash-kicker mt-6">Coming soon</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[var(--lc-text)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--lc-muted)]">
            We&rsquo;re building this section right now. Check back soon —
            it will be live in an upcoming LeetCore update.
          </p>
        </div>
      </main>
    </div>
  );
}

export default UnderConstruction;