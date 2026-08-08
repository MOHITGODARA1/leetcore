import { useParams, Navigate } from "react-router-dom";
import Upperdashnavbar from "../../components/common/dashuppernavbar";
import DSARightNavbar from "./Components/DSArightnavbar";
import DSARoadmap from "./Components/DSAroadmap";
import questionsData from "./data/questions.json";

function DSA() {
  const { topic } = useParams();

  if (topic) {
    const topicKey = topic.toLowerCase();
    const topicQuestions = questionsData[topicKey] || [];
    if (topicQuestions.length > 0) {
      return <Navigate to={`/dashboard/data-structures-and-algorithms/${topicKey}/${topicQuestions[0].id}`} replace />;
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-[var(--lc-bg)] text-[var(--lc-text)] flex flex-col">
      <Upperdashnavbar />
      <div className="flex flex-1 min-h-0 w-full items-stretch overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col overflow-hidden">
          <div className="shrink-0">
            
            <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[var(--lc-text)] [text-wrap:balance]">
              Algorithms <span className="text-[var(--lc-orange)]">Metro</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--lc-muted)]">
              Practice and master coding problems on arrays, trees, dynamic
              programming, and more. Complete a topic to unlock the next station.
            </p>
          </div>
          <div className="mt-5 flex-1 min-h-0">
            <DSARoadmap />
          </div>
        </div>

        {/* Right Sidebar */}
        <DSARightNavbar />
      </div>
    </div>
  );
}

export default DSA;