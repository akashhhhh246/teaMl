import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LandingPage } from './features/landing/LandingPage';
import { QuizPage } from './features/quiz/QuizPage';
import { RecommendationsPage } from './features/recommendations/RecommendationsPage';
import { CatalogPage } from './features/catalog/CatalogPage';
import { TeaDetailPage } from './features/tea-details/TeaDetailPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { AiAssistantPage } from './features/assistant/AiAssistantPage';
import { AnalyticsPage } from './features/analytics/AnalyticsPage';
import { AdminPage } from './features/admin/AdminPage';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-500 selection:text-white bg-[#FAF8F5] dark:bg-[#0B0F12] text-slate-900 dark:text-slate-100 transition-colors">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/teas" element={<CatalogPage />} />
            <Route path="/teas/:id" element={<TeaDetailPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/assistant" element={<AiAssistantPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
