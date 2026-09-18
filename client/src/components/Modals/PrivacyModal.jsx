import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Privacy Policy</h3>
            <p className="text-xs text-slate-400">Last updated: September 2026</p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40">
            <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
              <Lock className="w-4 h-4" /> Client-Side Privacy Guarantee
            </h4>
            <p>
              Unlike traditional cloud converters, <strong>SwiftDocs processes client-side operations (Merge, Split, Rotate, Compress, Add Page Numbers, JPG to PDF) strictly in your web browser memory</strong> using WebAssembly and JavaScript. Your files are NEVER uploaded to any remote server for these operations.
            </p>
          </div>

          <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">1. Information We Do Not Collect</h4>
          <p>
            We do not require user accounts, names, credit cards, or personal identifiers to use our core document tools. We never view, read, index, or sell your documents or personal data.
          </p>

          <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">2. Server-Side Document Processing</h4>
          <p>
            For advanced document conversions requiring format translation (such as PDF to Word or Excel to PDF), files are encrypted in transit via TLS/HTTPS, processed in an isolated sandbox, and <strong>permanently deleted within 60 minutes</strong> by an automated cleanup daemon.
          </p>

          <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">3. Cookies & Analytics</h4>
          <p>
            We only use basic local storage to remember your preferred theme (Dark/Light mode) and language selection (English/Hindi/Gujarati). No tracking cookies are used.
          </p>

          <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">4. Contact & Inquiries</h4>
          <p>
            If you have questions regarding our privacy practices, you may reach out via our contact form anytime.
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
}
