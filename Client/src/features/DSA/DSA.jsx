import { useParams } from "react-router-dom";
import Upperdashnavbar from "../../components/common/dashuppernavbar";
import DSARightNavbar from "./Components/DSArightnavbar";
import DSARoadmap from "./Components/DSAroadmap";
import Topicquestion from "./Components/Topicquestion";

function DSA() {
  const { topic } = useParams();

  return (
    <div className="h-screen overflow-hidden bg-[#070709] text-white flex flex-col">
      <Upperdashnavbar />
      <div className="flex flex-1 min-h-0 w-full items-stretch overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col overflow-hidden">
          <div className="shrink-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Algorithms Metro
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Practice and master coding problems on arrays, trees, dynamic programming, and more.
            </p>
          </div>
          <div className="mt-5 flex-1 min-h-0">
            <DSARoadmap />
          </div>
        </div>

        {/* Topic Question Drawer (Opens from left of right sidebar) */}
        {topic && <Topicquestion />}

        {/* Right Sidebar */}
        <DSARightNavbar />
      </div>
    </div>
  );
}

export default DSA;
