import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';

import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { JourneyPage } from './pages/JourneyPage';
import { AutobiographyPage } from './pages/AutobiographyPage';
import { ContactPage } from './pages/ContactPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { PremiumLoader } from './components/PremiumLoader';
import { GlobalNavbar } from './components/GlobalNavbar';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  return (
    <>
      <PremiumLoader />
      <div id="main-content" className="relative min-h-screen w-full overflow-x-hidden selection:bg-amber-200 selection:text-amber-900 dark:selection:bg-amber-900 dark:selection:text-amber-100">
      <GlobalNavbar />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/project/:id" element={<ProjectDetailPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/autobiography" element={<AutobiographyPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </div>
    </>
  );
}

export default App;
