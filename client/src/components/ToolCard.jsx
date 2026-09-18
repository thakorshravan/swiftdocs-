import React from 'react';
import { 
  Files, Scissors, Minimize2, RotateCw, Hash, Image, FileImage, 
  Unlock, FileText, FileSpreadsheet, Presentation, ArrowRight, Sparkles 
} from 'lucide-react';

const iconMap = {
  'merge-pdf': { icon: Files, color: 'from-blue-500 to-blue-600', iconColor: 'text-blue-500', bgLight: 'bg-blue-50 dark:bg-blue-950/30' },
  'split-pdf': { icon: Scissors, color: 'from-amber-500 to-orange-500', iconColor: 'text-amber-500', bgLight: 'bg-amber-50 dark:bg-amber-950/30' },
  'compress-pdf': { icon: Minimize2, color: 'from-emerald-500 to-teal-600', iconColor: 'text-emerald-500', bgLight: 'bg-emerald-50 dark:bg-emerald-950/30' },
  'rotate-pdf': { icon: RotateCw, color: 'from-indigo-500 to-purple-600', iconColor: 'text-indigo-500', bgLight: 'bg-indigo-50 dark:bg-indigo-950/30' },
  'page-numbers': { icon: Hash, color: 'from-sky-500 to-cyan-600', iconColor: 'text-sky-500', bgLight: 'bg-sky-50 dark:bg-sky-950/30' },
  'jpg-to-pdf': { icon: Image, color: 'from-rose-500 to-pink-600', iconColor: 'text-rose-500', bgLight: 'bg-rose-50 dark:bg-rose-950/30' },
  'pdf-to-jpg': { icon: FileImage, color: 'from-fuchsia-500 to-purple-600', iconColor: 'text-fuchsia-500', bgLight: 'bg-fuchsia-50 dark:bg-fuchsia-950/30' },
  'unlock-pdf': { icon: Unlock, color: 'from-yellow-500 to-amber-600', iconColor: 'text-amber-600', bgLight: 'bg-yellow-50 dark:bg-yellow-950/30' },
  'pdf-to-word': { icon: FileText, color: 'from-blue-600 to-indigo-700', iconColor: 'text-blue-600', bgLight: 'bg-blue-50 dark:bg-blue-950/30' },
  'word-to-pdf': { icon: FileText, color: 'from-blue-500 to-cyan-600', iconColor: 'text-blue-500', bgLight: 'bg-blue-50 dark:bg-blue-950/30' },
  'pdf-to-excel': { icon: FileSpreadsheet, color: 'from-emerald-600 to-green-700', iconColor: 'text-emerald-600', bgLight: 'bg-emerald-50 dark:bg-emerald-950/30' },
  'excel-to-pdf': { icon: FileSpreadsheet, color: 'from-green-500 to-emerald-600', iconColor: 'text-green-500', bgLight: 'bg-green-50 dark:bg-green-950/30' },
  'powerpoint-to-pdf': { icon: Presentation, color: 'from-orange-500 to-red-600', iconColor: 'text-orange-500', bgLight: 'bg-orange-50 dark:bg-orange-950/30' },
  'pdf-to-powerpoint': { icon: Presentation, color: 'from-red-500 to-rose-600', iconColor: 'text-red-500', bgLight: 'bg-red-50 dark:bg-red-950/30' },
};

export default function ToolCard({ id, toolInfo, onSelect }) {
  const config = iconMap[id] || { icon: Files, color: 'from-blue-500 to-blue-600', iconColor: 'text-blue-500', bgLight: 'bg-blue-50' };
  const IconComponent = config.icon;

  return (
    <div
      onClick={() => onSelect(id)}
      className="group relative flex flex-col justify-between p-5 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top row with Icon and Badge */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgLight} group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className={`w-6 h-6 ${config.iconColor} stroke-[2.2]`} />
          </div>

          {toolInfo.badge && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:bg-blue-900/40 dark:group-hover:text-blue-300 transition-colors">
              {toolInfo.badge}
            </span>
          )}
        </div>

        {/* Tool Name */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {toolInfo.name}
        </h3>

        {/* Tool Description */}
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {toolInfo.desc}
        </p>
      </div>

      {/* Bottom Action Hint */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        <span>{toolInfo.action || 'Open Tool'}</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>

      {/* Subtle top border hover highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
