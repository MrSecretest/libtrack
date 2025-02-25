import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landingpage";
import MainLibraryPage from "../pages/homepage";
import ProtectedRoute from "../auth/ProtectedRoute";
import LibraryPage from "../pages/librarypage";
import SearchPage from "../pages/searchpage"
import RatedPage from "../pages/ratedpage";
import ProgressPage from "../pages/progresspage";
import NotesPage from "../pages/notespage";


export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <MainLibraryPage />
              </ProtectedRoute>
            }
          />
          <Route path="/library" element={<LibraryPage></LibraryPage>}></Route>
          <Route path="/search" element={<SearchPage/>}></Route>
          <Route path="/progress" element={<ProgressPage/>}></Route>
          <Route path="/rated" element={<RatedPage/>}></Route>
          <Route path="/notes" element={<NotesPage/>}></Route>

        </Routes>
      </Router>
    </>
  );
}
