import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import AuthRoute from "./routes/AuthRoute";
import DashboardPage from "./pages/DashboardPage/DashboardPage";
import "./config/firebase";
import FormPage from "./pages/FormPage";
import MainPage from "./pages/MainPage";

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
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
