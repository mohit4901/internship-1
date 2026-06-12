import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import OlympiadPage from './pages/Olympiad';
import OlympiadsPage from './pages/Olympiads';
import ForSchoolsPage from './pages/ForSchools';
import FAQsPage from './pages/FAQs';
import RegisterPage from './pages/Register';
import ContactPage from './pages/Contact';
import AnnouncementsPage from './pages/Announcements';
import SchoolLoginPage from './pages/SchoolLogin';
import SchoolDashboardPage from './pages/SchoolDashboard';
import NotFoundPage from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<PublicLayout />}>
            {/* Public pages */}
            <Route path="/"             element={<HomePage />} />
            <Route path="/about"        element={<AboutPage />} />
            <Route path="/olympiad"     element={<OlympiadPage />} />
            <Route path="/olympiads"    element={<OlympiadsPage />} />
            <Route path="/schools"      element={<ForSchoolsPage />} />
            <Route path="/faqs"         element={<FAQsPage />} />
            <Route path="/register"     element={<RegisterPage />} />
            <Route path="/contact"      element={<ContactPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />

            {/* School auth */}
            <Route path="/school/login"      element={<SchoolLoginPage />} />
            <Route path="/school/dashboard"  element={<SchoolDashboardPage />} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
