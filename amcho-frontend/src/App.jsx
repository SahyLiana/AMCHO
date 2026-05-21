import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useState } from "react";
import { ToastContainer } from "react-toastify";

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        {/* Forcing login to be default route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={<LoginPage user={user} setUser={setUser} />}
        />

        <Route element={<ProtectedRoute user={user} setUser={setUser} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* Dynamic fallback */}
        <Route
          path="*"
          element={
            <div className="text-3xl text-center text-gray-800">
              Page not found
            </div>
          }
        />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
