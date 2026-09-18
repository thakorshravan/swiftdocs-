import React, { useState } from 'react';
import ToolCard from './ToolCard';
import { Layers, Scissors, ArrowDownToLine, ArrowUpFromLine, Shield } from 'lucide-react';

export default function ToolGrid({ t, searchQuery, onSelectTool }) {
  const [activeCategory, setActiveCategory] = useState('all');

  // Tool categories mapping
  const categoryMap = {
    organize: ['merge-pdf', 'split-pdf', 'rotate-pdf', 'page-numbers'],
    convertFrom: ['pdf-to-word', 'pdf-to-excel', 'pdf-to-powerpoint', 'pdf-to-jpg'],
    convertTo: ['word-to-pdf', 'excel-to-pdf', 'powerpoint-to-pdf', 'jpg-to-pdf'],
    security: ['compress-pdf', 'unlock-pdf'],
  };

  const allToolIds = [
    'merge-pdf',
    'split-pdf',
    'compress-pdf',
    'pdf-to-word',
    'word-to-pdf',
    'pdf-to-excel',
    'excel-to-pdf',
    'powerpoint-to-pdf',
    'pdf-to-powerpoint',
    'rotate-pdf',
    'page-numbers',
    'jpg-to-pdf',
    'pdf-to-jpg',
    'unlock-pdf',
  ];

  const categoryTabs = [
    { id: 'all', label: t.categories.all, icon: Layers },
    { id: 'organize', label: t.categories.organize, icon: Scissors },
    { id: 'convertFrom', label: t.categories.convertFrom, icon: ArrowUpFromLine },
    { id: 'convertTo', label: t.categories.convertTo, icon: ArrowDownToLine },
    { id: 'security', label: t.categories.security, icon: Shield },
  ];

  // Filtering logic
  const filteredTools = allToolIds.filter((toolId) => {
    const info = t.tools[toolId] || {};
    
    // Check search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = (info.name || '').toLowerCase().includes(q);
      const matchDesc = (info.desc || '').toLowerCase().includes(q);
      const matchId = toolId.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchId) return false;
    }

    // Check category
    if (activeCategory !== 'all') {
      const allowed = categoryMap[activeCategory] || [];
      if (!allowed.includes(toolId)) return false;
    }

    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="tools-section">
      
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
        {categoryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredTools.map((toolId) => (
            <ToolCard
              key={toolId}
              id={toolId}
              toolInfo={t.tools[toolId] || { name: toolId, desc: '' }}
              onSelect={onSelectTool}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <p className="text-base text-slate-500 dark:text-slate-400 mb-4">
            No tools found matching "{searchQuery}"
          </p>
          <button
            onClick={() => setActiveCategory('all')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Show All Tools
          </button>
        </div>
      )}

    </section>
  );
}
