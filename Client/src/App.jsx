import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import Dashboard from "./features/dashboard/dashboard";
import Whatsnew from "./pages/Whatsnew";
import DigitalFootprint from "./pages/degitalfootprint";
import UnderConstruction from "./pages/UnderConstruction";
import Profile from "./features/profile/Profile";
import DSA from "./features/DSA/DSA";
import DSAQuestionPage from "./features/DSA/Components/DSAQuestionPage";
/*  Main App */
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/what's-new-on-leetcore" element={<Whatsnew />} />
        <Route path="/dashboard/what's-next-on-leetcore" element={<UnderConstruction />} />
        <Route path="/dashboard/Career-oppertunity-on-leetcore" element={<UnderConstruction />} />
        <Route path="/dashboard/Social-media-footprint" element={<DigitalFootprint />} />
        <Route path="/dashboard/interview-preparation" element={<UnderConstruction />} />
        {/* DSA Roadmap — "Algorithms Metro" */}
        <Route path="/dashboard/data-structures-and-algorithms" element={<DSA />} />
        <Route path="/dashboard/data-structures-and-algorithms/:topic" element={<DSA />} />
        <Route path="/dashboard/data-structures-and-algorithms/:topic/:questionId" element={<DSAQuestionPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
}

export default App;
