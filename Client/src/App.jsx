import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage";
import Dashboard from "./features/dashboard/dashboard";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Profile from "./features/Profile/profile";
import FeedbackPage from "./features/dashboard/feedback";
import ReportBugPage from "./features/dashboard/reportbug";
import BecomeSponsorPage from "./features/dashboard/becomesponsor";
import OnlineAssessmentPage from "./features/dashboard/onlineassessment";
import ContestPage from "./features/dashboard/contest";
import Docomentation from "./features/topics/Docomentation";
import Practice from "./features/topics/Practice";
import PatternQuestions from "./features/topics/PatternQuestions";
import ProblemDetail from "./features/topics/ProblemDetail";

/*  Main App */
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/feedback"
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/reportbug"
          element={
            <ProtectedRoute>
              <ReportBugPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/report-bug"
          element={
            <ProtectedRoute>
              <ReportBugPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/become-sponsor"
          element={
            <ProtectedRoute>
              <BecomeSponsorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/online-assessment"
          element={
            <ProtectedRoute>
              <OnlineAssessmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/contest"
          element={
            <ProtectedRoute>
              <ContestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/dsa/Docs/:topic"
          element={
            <ProtectedRoute>
              <Docomentation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/dsa/Practice/:topic"
          element={
            <ProtectedRoute>
              <Practice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/dsa/Practice/:topic/problem/:problemId"
          element={
            <ProtectedRoute>
              <ProblemDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/dsa/Practice/:topic/:pattern"
          element={
            <ProtectedRoute>
              <PatternQuestions />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
