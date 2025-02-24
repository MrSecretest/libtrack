import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landingpage";
import LibraryPage from "../pages/librarypage";
import ProtectedRoute from "../auth/ProtectedRoute";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}
