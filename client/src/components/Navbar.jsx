import React, { useState } from 'react';
import { FileText, Sun, Moon, Globe, Share2, Menu, X, Shield, Sparkles } from 'lucide-react';

export default function Navbar({ lang, setLang, darkMode, setDarkMode, onOpenShare, onOpenContact, onSelectTool, currentTool, onGoHome }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'gu', label: 'ગુજરાતી', flag: '🇮🇳' },
  ];

  const currentLangObj = languages.find((l) => l.code === lang) || languages[0];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-slate-900/85 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={onGoHome}
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 dark:from-blue-400 dark:to-sky-300 bg-clip-text text-transparent tracking-tight">
                SwiftDocs
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button 
            onClick={onGoHome}
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${!currentTool ? 'text-blue-600 dark:text-blue-400 font-semibold' : ''}`}
          >
            Home
          </button>
          
          <button 
            onClick={() => onSelectTool('merge-pdf')} 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Merge
          </button>
          
          <button 
            onClick={() => onSelectTool('split-pdf')} 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Split
          </button>

          <button 
            onClick={() => onSelectTool('compress-pdf')} 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Compress
          </button>

          <button 
            onClick={() => onSelectTool('pdf-to-word')} 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
          >
            <span>PDF to Word</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </button>

          <button 
            onClick={() => onSelectTool('jpg-to-pdf')} 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            PNG to PDF
          </button>
        </nav>

        {/* Right Actions (Language, Theme, Share) */}
        <div className="hidden md:flex items-center gap-2.5">
          
          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title="Change Language"
            >
              <span>{currentLangObj.flag}</span>
              <span>{currentLangObj.label}</span>
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {langDropdownOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-fade-in"
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left font-medium hover:bg-blue-50 dark:hover:bg-slate-700 transition ${lang === l.code ? 'text-blue-600 dark:text-blue-400 font-semibold bg-blue-50/60 dark:bg-slate-700/60' : 'text-slate-700 dark:text-slate-300'}`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Share Button */}
          <button
            onClick={onOpenShare}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Share Website"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu hamburger toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-5 space-y-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 animate-slide-up">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button
              onClick={() => { onGoHome(); setMobileMenuOpen(false); }}
              className="px-3 py-2 rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              🏠 Home
            </button>
            <button
              onClick={() => { onSelectTool('merge-pdf'); setMobileMenuOpen(false); }}
              className="px-3 py-2 rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              📑 Merge PDF
            </button>
            <button
              onClick={() => { onSelectTool('split-pdf'); setMobileMenuOpen(false); }}
              className="px-3 py-2 rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              ✂️ Split PDF
            </button>
            <button
              onClick={() => { onSelectTool('compress-pdf'); setMobileMenuOpen(false); }}
              className="px-3 py-2 rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              🗜️ Compress PDF
            </button>
            <button
              onClick={() => { onSelectTool('pdf-to-word'); setMobileMenuOpen(false); }}
              className="px-3 py-2 rounded-lg text-left text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              📝 PDF to Word
            </button>
            <button
              onClick={() => { onSelectTool('jpg-to-pdf'); setMobileMenuOpen(false); }}
              className="px-3 py-2 rounded-lg text-left text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              🖼️ PNG to PDF
            </button>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400">Language:</span>
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`px-2 py-1 rounded text-xs font-semibold ${lang === l.code ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  {l.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => { onOpenShare(); setMobileMenuOpen(false); }}
              className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400"
            >
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
