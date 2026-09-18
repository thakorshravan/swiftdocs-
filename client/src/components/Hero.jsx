import React from 'react';
import { Search, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Hero({ t, searchQuery, setSearchQuery, onSelectTool }) {
  const quickPills = [
    { id: 'merge-pdf', label: 'Merge PDF' },
    { id: 'pdf-to-word', label: 'PDF to Word' },
    { id: 'compress-pdf', label: 'Compress PDF' },
    { id: 'split-pdf', label: 'Split PDF' },
    { id: 'jpg-to-pdf', label: 'JPG to PDF' },
  ];

  return (
    <section className="relative overflow-hidden pt-10 pb-12 md:pt-16 md:pb-20 text-center">
      {/* Background ambient glow circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-400/20 via-sky-300/15 to-indigo-500/20 blur-3xl -z-10 pointer-events-none rounded-full" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Security badge pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 shadow-sm mb-6 animate-fade-in">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{t.clientSideBadge}</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 leading-tight">
          {t.heroTitle.split(',')[0]}
          {t.heroTitle.split(',')[1] && (
            <span className="block mt-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 bg-clip-text text-transparent">
              {t.heroTitle.split(',')[1]}
            </span>
          )}
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          {t.heroSubtitle}
        </p>

        {/* Real-time Search Input */}
        <div className="max-w-xl mx-auto relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3.5 sm:py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-md transition-all text-sm sm:text-base"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
          <span className="text-slate-400 dark:text-slate-500">Popular:</span>
          {quickPills.map((pill) => (
            <button
              key={pill.id}
              onClick={() => onSelectTool(pill.id)}
              className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/60 dark:border-slate-700 transition"
            >
              {pill.label}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
}
