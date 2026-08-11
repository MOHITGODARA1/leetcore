import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const LandingPage = lazy(() => import("./pages/landingpage"));
const Dashboard = lazy(() => import("./features/dashboard/dashboard"));
const Whatsnew = lazy(() => import("./pages/Whatsnew"));
const DigitalFootprint = lazy(() => import("./pages/degitalfootprint"));
const UnderConstruction = lazy(() => import("./pages/UnderConstruction"));
const Profile = lazy(() => import("./features/profile/Profile"));
const PublicProfile = lazy(() => import("./features/profile/PublicProfile"));
const DSA = lazy(() => import("./features/DSA/DSA"));
const DSAQuestionPage = lazy(() => import("./features/DSA/Components/DSAQuestionPage"));
const SQL = lazy(() => import("./features/SQL/SQL"));

function RouteFallback() {
  return (
    <div className="min-h-screen bg-[var(--color-bg,var(--lc-bg,#050505))] text-[var(--color-text,var(--lc-text,#f8f8f8))]" />
  );
}

/*  Main App */
function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/profile/:username" element={<PublicProfile />} />
        <Route path="/dashboard/what's-new-on-leetcore" element={<Whatsnew />} />
        <Route path="/dashboard/what's-next-on-leetcore" element={<UnderConstruction />} />
        <Route path="/dashboard/Career-oppertunity-on-leetcore" element={<UnderConstruction />} />
        <Route path="/dashboard/Social-media-footprint" element={<DigitalFootprint />} />
        <Route path="/dashboard/interview-preparation" element={<UnderConstruction />} />
        {/* DSA Roadmap — "Algorithms Metro" */}
        <Route path="/dashboard/data-structures-and-algorithms" element={<DSA />} />
        <Route path="/dashboard/data-structures-and-algorithms/:topic" element={<DSA />} />
        <Route path="/dashboard/data-structures-and-algorithms/:topic/:questionId" element={<DSAQuestionPage />} />
        {/* SQL Roadmap — theory-first "SQL Metro" */}
        <Route path="/dashboard/sql" element={<SQL />} />
        <Route path="/dashboard/sql/:topic" element={<SQL />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
