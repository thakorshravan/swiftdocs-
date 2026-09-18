import React from 'react';
import { X, FileText } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 relative">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Terms of Service</h3>
            <p className="text-xs text-slate-400">Effective Date: September 2026</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h4>
          <p>
            By accessing or using SwiftDocs, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please refrain from using our service.
          </p>

          <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">2. Permitted Use</h4>
          <p>
            SwiftDocs is provided for legitimate document conversion and organizational purposes. You agree not to upload materials that are unlawful, harmful, defamatory, infringing on intellectual property, or containing malware.
          </p>

          <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">3. Intellectual Property Rights</h4>
          <p>
            You retain 100% full ownership, rights, and copyright to all files uploaded or processed through SwiftDocs. We claim no intellectual property rights over any user content.
          </p>

          <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">4. Disclaimer of Warranties</h4>
          <p>
            SwiftDocs is provided on an "as is" and "as available" basis without warranties of any kind. While our conversion engines strive for maximum layout fidelity, variations may occur depending on source file structure.
          </p>

          <h4 className="text-base font-bold text-slate-900 dark:text-white pt-2">5. File Retention Limits</h4>
          <p>
            All temporary server files are routinely purged within 1 hour. It is the user's sole responsibility to maintain original backup copies of all files before processing.
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
