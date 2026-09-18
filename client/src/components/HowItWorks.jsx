import React from 'react';
import { Upload, Sliders, Download, Sparkles, Shield, Cpu } from 'lucide-react';

export default function HowItWorks({ t }) {
  const steps = [
    {
      num: '01',
      title: t.howItWorks.step1Title,
      desc: t.howItWorks.step1Desc,
      icon: Upload,
      accent: 'from-blue-600 to-sky-500',
    },
    {
      num: '02',
      title: t.howItWorks.step2Title,
      desc: t.howItWorks.step2Desc,
      icon: Sliders,
      accent: 'from-indigo-600 to-purple-600',
    },
    {
      num: '03',
      title: t.howItWorks.step3Title,
      desc: t.howItWorks.step3Desc,
      icon: Download,
      accent: 'from-emerald-600 to-teal-500',
    },
  ];

  return (
    <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            {t.howItWorks.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-start hover:-translate-y-1 transition-transform"
              >
                {/* Number Watermark */}
                <div className="text-4xl font-black text-slate-200 dark:text-slate-700/60 mb-4 select-none">
                  {step.num}
                </div>

                {/* Step Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${step.accent} text-white flex items-center justify-center shadow-md mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Feature Grid highlights */}
        <div className="mt-16 pt-12 border-t border-slate-200/60 dark:border-slate-800/60">
          <h3 className="text-xl sm:text-2xl font-bold text-center text-slate-900 dark:text-white mb-10">
            {t.features.title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{t.features.f1Title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.features.f1Desc}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{t.features.f2Title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.features.f2Desc}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                <Sliders className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{t.features.f3Title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.features.f3Desc}</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{t.features.f4Title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t.features.f4Desc}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
