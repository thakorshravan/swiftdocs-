import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ToolGrid from './components/ToolGrid';
import ToolWorkspace from './components/ToolViews/ToolWorkspace';
import HowItWorks from './components/HowItWorks';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import PrivacyModal from './components/Modals/PrivacyModal';
import TermsModal from './components/Modals/TermsModal';
import ContactModal from './components/Modals/ContactModal';
import ShareModal from './components/Modals/ShareModal';
import { translations } from './utils/i18n';

export default function App() {
  // Theme state with localStorage persistence
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('swiftdocs_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Language state with localStorage persistence
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('swiftdocs_lang') || 'en';
    }
    return 'en';
  });

  // Navigation & Search states
  const [activeTool, setActiveTool] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Sync theme to document class
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('swiftdocs_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('swiftdocs_theme', 'light');
    }
  }, [darkMode]);

  // Sync language to localStorage
  useEffect(() => {
    localStorage.setItem('swiftdocs_lang', lang);
  }, [lang]);

  // Get localized strings
  const t = translations[lang] || translations.en;

  const handleSelectTool = (toolId) => {
    setActiveTool(toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setActiveTool(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-blue-500 selection:text-white transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenShare={() => setShareOpen(true)}
        onOpenContact={() => setContactOpen(true)}
        onSelectTool={handleSelectTool}
        currentTool={activeTool}
        onGoHome={handleGoHome}
      />

      {/* Main Content */}
      <main className="flex-grow">
        {activeTool ? (
          /* Active Tool Workspace */
          <ToolWorkspace
            t={t}
            toolId={activeTool}
            onBack={handleGoHome}
          />
        ) : (
          /* Landing Page with Hero and All Tools */
          <>
            <Hero
              t={t}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSelectTool={handleSelectTool}
            />

            <ToolGrid
              t={t}
              searchQuery={searchQuery}
              onSelectTool={handleSelectTool}
            />

            <HowItWorks t={t} />

            <FaqSection t={t} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        t={t}
        onSelectTool={handleSelectTool}
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onOpenTerms={() => setTermsOpen(true)}
        onOpenContact={() => setContactOpen(true)}
        onOpenShare={() => setShareOpen(true)}
        onGoHome={handleGoHome}
      />

      {/* Modals */}
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
      <ShareModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />

    </div>
  );
}
