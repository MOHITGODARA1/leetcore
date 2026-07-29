import { useState } from "react";

import Upperdashnavbar from "../../components/common/dashuppernavbar";
import Dashleftnavbar from "../../components/common/dashleftnavbar";
import Mainboxes from "./components/mainboxes";
import Dashtopic from "./components/dashtopic";
import Mainnavbar from "./components/mainnavbar";
import Searchbar from "./components/Searchbar";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("All Topics");

  return (
    <div className="h-screen bg-[#070709] text-white flex flex-col overflow-hidden">
      {/* Top Navbar */}
      <Upperdashnavbar />

      {/* Sidebar + Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="flex-shrink-0">
          <Dashleftnavbar />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 mt-9 overflow-y-auto">
          <Mainboxes />

          <Mainnavbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <Searchbar />

          <Dashtopic activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
}

export default Dashboard;