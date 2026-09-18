import React from 'react';
import { FileText, Heart, ShieldCheck, Mail, Share2 } from 'lucide-react';

export default function Footer({ t, onSelectTool, onOpenPrivacy, onOpenTerms, onOpenContact, onOpenShare, onGoHome }) {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors pt-12 pb-8 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-slate-100 dark:border-slate-800">
          
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div 
              onClick={onGoHome}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                SwiftDocs
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              {t.tagline}. Fast, private, browser-based document conversions without subscription fees or registration.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onOpenShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.footer.shareWebsite}</span>
              </button>

              <button
                onClick={onOpenContact}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>{t.footer.contactSupport}</span>
              </button>
            </div>
          </div>

          {/* Col 2: Organize Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {t.categories.organize}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTool('merge-pdf')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Merge PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('split-pdf')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Split PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('rotate-pdf')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Rotate PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('page-numbers')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Page Numbers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Convert Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Convert
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTool('pdf-to-word')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  PDF to Word
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('word-to-pdf')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  Word to PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('jpg-to-pdf')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  JPG to PDF
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTool('pdf-to-jpg')} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  PDF to JPG
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {t.footer.privacyPolicy}
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {t.footer.termsOfService}
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
                  {t.footer.contactSupport}
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SwiftDocs. {t.footer.allRights}</p>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{t.footer.madeWith}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
