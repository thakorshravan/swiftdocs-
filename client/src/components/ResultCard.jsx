import React, { useEffect } from 'react';
import { Download, CheckCircle2, RotateCcw, ShieldCheck, FileCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResultCard({ t, result, onReset }) {
  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#38bdf8', '#10b981', '#f59e0b']
      });
    } catch (e) {
      // safe fallback if canvas-confetti is not available
    }
  }, []);

  const handleDownload = () => {
    if (!result || !result.blob) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename || 'converted_document.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center shadow-lg animate-fade-in max-w-xl mx-auto">
      
      {/* Success Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500 shadow-inner">
        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2] animate-bounce-short" />
      </div>

      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
        {t.result.successTitle}
      </h3>

      {/* File Card Info */}
      <div className="my-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-4 text-left">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
              {result.filename}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {result.originalSize && result.blob ? (
                <span>
                  <span className="line-through opacity-75">{formatFileSize(result.originalSize)}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 ml-1.5">{formatFileSize(result.blob.size)}</span>
                </span>
              ) : (
                <span>{result.blob ? formatFileSize(result.blob.size) : ''}</span>
              )}
            </div>
          </div>
        </div>

        {result.reductionPercent && (
          <div className="shrink-0 text-right">
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
              -{result.reductionPercent}%
            </span>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">Saved</div>
          </div>
        )}
      </div>

      {/* Download Action Button */}
      <button
        type="button"
        onClick={handleDownload}
        className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-base shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2.5 transition-all mb-4"
      >
        <Download className="w-5 h-5" />
        <span>{t.result.downloadBtn}</span>
      </button>

      {/* Convert Another File Button */}
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition mb-6"
      >
        <RotateCcw className="w-4 h-4" />
        <span>{t.result.convertAnother}</span>
      </button>

      {/* Privacy guarantee note */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>{t.result.privacyNotice}</span>
      </div>

    </div>
  );
}
