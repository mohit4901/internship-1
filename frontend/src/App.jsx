import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import HomePage from './pages/Home';
import AboutPage from './pages/About';
import OlympiadsPage from './pages/Olympiads';
import ResultsPage from './pages/Results';
import ContactPage from './pages/Contact';
import FAQsPage from './pages/FAQs';
import NotFoundPage from './pages/NotFound';
import StudentLoginPage from './pages/StudentLogin';
import SchoolLoginPage from './pages/SchoolLogin';
import StudentRegisterPage from './pages/StudentRegister';
import SchoolRegisterPage from './pages/SchoolRegister';
import DebugPanel from './components/DebugPanel';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/olympiads" element={<OlympiadsPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faqs" element={<FAQsPage />} />
            <Route path="/student/login" element={<StudentLoginPage />} />
            <Route path="/student/register" element={<StudentRegisterPage />} />
            <Route path="/school/login" element={<SchoolLoginPage />} />
            <Route path="/school/register" element={<SchoolRegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <DebugPanel />
    </AuthProvider>
  );
}
