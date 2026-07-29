import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import Dashboard from "./features/dashboard/dashboard";
import Whatsnew from "./pages/Whatsnew";
import Whatsnext from "./pages/Whatsnextpage";
import Career from "./pages/Career";
import DigitalFootprint from "./pages/degitalfootprint";
import DSA from "./features/DSA/DSA";
/*  Main App */
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/what's-new-on-leetcore" element={<Whatsnew />} />
        <Route path="/dashboard/what's-next-on-leetcore" element={<Whatsnext />} />
        <Route path="/dashboard/Career-oppertunity-on-leetcore" element={<Career />} />
        <Route path="/dashboard/Social-media-footprint" element={<DigitalFootprint />} />
        <Route path="/dashboard/data-structures-and-algorithms" element={<DSA />} />
        <Route path="/dashboard/data-structures-and-algorithms/:topic" element={<DSA />} />
      </Routes>
    </>
  );
}

export default App;
