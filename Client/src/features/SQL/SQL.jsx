import { useParams } from "react-router-dom";
import Upperdashnavbar from "../../components/common/dashuppernavbar";
import SQLroadmap from "./Components/SQLroadmap";
import SQLrightnavbar from "./Components/SQLrightnavbar";
import SQLtopic from "./Components/SQLtopic";

function SQL() {
  const { topic } = useParams();

  return (
    <div className="h-screen overflow-hidden bg-[var(--lc-bg)] text-[var(--lc-text)] flex flex-col">
      <Upperdashnavbar />
      <div className="flex flex-1 min-h-0 w-full items-stretch overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col overflow-hidden">
          {topic ? (
            <SQLtopic topicId={topic} />
          ) : (
            <>
              <div className="shrink-0">
                <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--lc-text)] [text-wrap:balance]">
                  SQL <span className="text-[#4ade80]">Metro</span>
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-[var(--lc-muted)]">
                  Master the SQL concepts interviewers actually ask about — from
                  SELECT to window functions. A theory-first journey; finish a
                  topic to unlock the next station.
                </p>
              </div>
              <div className="mt-5 flex-1 min-h-0">
                <SQLroadmap />
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar */}
        <SQLrightnavbar />
      </div>
    </div>
  );
}

export default SQL;