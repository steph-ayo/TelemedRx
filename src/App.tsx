import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AuthRoute from "./routes/AuthRoute";
import "./config/firebase";

import MainPage from "./pages/MainPage";
import FormPage from "./pages/FormPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import LiveTrackingPage from "./pages/LiveTrackingPage";
import SummaryPage from "./pages/SummaryPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route
        path="/main"
        element={
          <AuthRoute>
            <MainPage />
          </AuthRoute>
        }
      >
        <Route index element={<Navigate to="form" replace />} />
        <Route path="form" element={<FormPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="livetracking" element={<LiveTrackingPage />} />
        <Route path="summary" element={<SummaryPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
