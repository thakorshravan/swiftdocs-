import React, { useState } from 'react';
import DropZone from '../DropZone';
import ProgressBar from '../ProgressBar';
import ResultCard from '../ResultCard';
import { 
  ArrowLeft, Sparkles, ShieldCheck, AlertCircle, 
  RotateCw, Scissors, Hash, Lock, Minimize2, Image, FileText 
} from 'lucide-react';
import { 
  mergePdfs, splitPdf, rotatePdf, addPageNumbers, 
  imageToPdf, compressPdf, unlockPdf 
} from '../../utils/pdfEngine';
import { pdfToJpg } from '../../utils/imageUtils';
import { convertOfficeDocument } from '../../utils/api';

export default function ToolWorkspace({ t, toolId, onBack }) {
  const toolInfo = t.tools[toolId] || { name: toolId, desc: '', action: 'Convert' };

  // File states
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Tool specific options
  const [splitMode, setSplitMode] = useState('all'); // 'all' | 'range'
  const [splitRange, setSplitRange] = useState('1-2');
  const [rotateAngle, setRotateAngle] = useState(90);
  const [numberPosition, setNumberPosition] = useState('bottom-center');
  const [numberFormat, setNumberFormat] = useState('Page {n} of {total}');
  const [imgOrientation, setImgOrientation] = useState('fit');
  const [imgMargin, setImgMargin] = useState('small');
  const [compressLevel, setCompressLevel] = useState('recommended');
  const [unlockPassword, setUnlockPassword] = useState('');

  // Tool configurations
  const isMultiple = toolId === 'merge-pdf' || toolId === 'jpg-to-pdf';
  const getAcceptedFormats = () => {
    switch (toolId) {
      case 'jpg-to-pdf': return 'image/jpeg,image/png,image/webp';
      case 'word-to-pdf': return '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case 'excel-to-pdf': return '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case 'powerpoint-to-pdf': return '.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation';
      default: return '.pdf,application/pdf';
    }
  };

  const handleStartProcess = async () => {
    if (files.length === 0) return;
    setErrorMessage('');
    setIsProcessing(true);
    setProgress(5);
    setStatusMessage(t.progress.reading);

    try {
      let finalResult = null;

      switch (toolId) {
        case 'merge-pdf': {
          if (files.length < 2) {
            throw new Error('Please select at least 2 PDF files to merge.');
          }
          const blob = await mergePdfs(files, (pct, msg) => {
            setProgress(pct);
            setStatusMessage(msg);
          });
          finalResult = { blob, filename: 'merged_document.pdf' };
          break;
        }

        case 'split-pdf': {
          const res = await splitPdf(files[0], splitMode, splitRange, (pct, msg) => {
            setProgress(pct);
            setStatusMessage(msg);
          });
          finalResult = res;
          break;
        }

        case 'rotate-pdf': {
          const blob = await rotatePdf(files[0], rotateAngle, (pct, msg) => {
            setProgress(pct);
            setStatusMessage(msg);
          });
          const base = files[0].name.replace(/\.[^/.]+$/, '');
          finalResult = { blob, filename: `${base}_rotated.pdf` };
          break;
        }

        case 'page-numbers': {
          const blob = await addPageNumbers(files[0], numberPosition, numberFormat, (pct, msg) => {
            setProgress(pct);
            setStatusMessage(msg);
          });
          const base = files[0].name.replace(/\.[^/.]+$/, '');
          finalResult = { blob, filename: `${base}_numbered.pdf` };
          break;
        }

        case 'jpg-to-pdf': {
          const blob = await imageToPdf(files, imgOrientation, imgMargin, (pct, msg) => {
            setProgress(pct);
            setStatusMessage(msg);
          });
          finalResult = { blob, filename: 'converted_images.pdf' };
          break;
        }

        case 'pdf-to-jpg': {
          const res = await pdfToJpg(files[0], 0.92, (pct, msg) => {
            setProgress(pct);
            setStatusMessage(msg);
          });
          finalResult = res;
          break;
        }

        case 'compress-pdf': {
          const res = await compressPdf(files[0], compressLevel, (pct, msg) => {
            setProgress(pct);
            setStatusMessage(msg);
          });
          const base = files[0].name.replace(/\.[^/.]+$/, '');
          finalResult = { 
            blob: res.blob, 
            filename: `${base}_compressed.pdf`,
            originalSize: res.originalSize,
            reductionPercent: res.reductionPercent 
          };
          break;
        }

        case 'unlock-pdf': {
          const blob = await unlockPdf(files[0], unlockPassword, (pct, msg) => {
            setProgress(pct);
            setStatusMessage(msg);
          });
          const base = files[0].name.replace(/\.[^/.]+$/, '');
          finalResult = { blob, filename: `${base}_unlocked.pdf` };
          break;
        }

        // Office conversions (PDF <-> Word, Excel, PPT)
        case 'pdf-to-word':
        case 'word-to-pdf':
        case 'pdf-to-excel':
        case 'excel-to-pdf':
        case 'powerpoint-to-pdf':
        case 'pdf-to-powerpoint': {
          const res = await convertOfficeDocument(toolId, files[0], (pct, msg) => {
            setProgress(pct);
            setStatusMessage(msg);
          });
          finalResult = res;
          break;
        }

        default:
          throw new Error('This tool is currently being updated. Please try another tool.');
      }

      setResult(finalResult);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'An unexpected error occurred during document conversion.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFiles([]);
    setResult(null);
    setErrorMessage('');
    setProgress(0);
    setStatusMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-in">
      
      {/* Top Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tools</span>
        </button>

        <div className="flex items-center gap-1 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Client-side Encrypted</span>
        </div>
      </div>

      {/* Tool Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          {toolInfo.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {toolInfo.desc}
        </p>
      </div>

      {/* Main Workspace Area */}
      {!result && !isProcessing && (
        <div className="space-y-6">
          {/* Dropzone */}
          <DropZone
            t={t}
            files={files}
            setFiles={setFiles}
            accept={getAcceptedFormats()}
            multiple={isMultiple}
            toolId={toolId}
          />

          {/* Options Panel (Only shows when file(s) are uploaded) */}
          {files.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm animate-fade-in">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                Configuration Options
              </h4>

              {/* Split options */}
              {toolId === 'split-pdf' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium cursor-pointer">
                      <input
                        type="radio"
                        checked={splitMode === 'all'}
                        onChange={() => setSplitMode('all')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Extract all pages into a ZIP archive</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs sm:text-sm font-medium cursor-pointer">
                      <input
                        type="radio"
                        checked={splitMode === 'range'}
                        onChange={() => setSplitMode('range')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Select custom page range</span>
                    </label>
                  </div>

                  {splitMode === 'range' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Page Range (e.g., "1-3, 5")
                      </label>
                      <input
                        type="text"
                        value={splitRange}
                        onChange={(e) => setSplitRange(e.target.value)}
                        placeholder="1-3, 5"
                        className="w-full max-w-xs px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Rotate options */}
              {toolId === 'rotate-pdf' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                    Rotation Angle
                  </label>
                  <div className="flex gap-2">
                    {[90, 180, 270].map((deg) => (
                      <button
                        key={deg}
                        type="button"
                        onClick={() => setRotateAngle(deg)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                          rotateAngle === deg
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>{deg}° Clockwise</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Page Number options */}
              {toolId === 'page-numbers' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Number Position
                    </label>
                    <select
                      value={numberPosition}
                      onChange={(e) => setNumberPosition(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value="bottom-center">Bottom Center</option>
                      <option value="bottom-right">Bottom Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="top-center">Top Center</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Format
                    </label>
                    <select
                      value={numberFormat}
                      onChange={(e) => setNumberFormat(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value="Page {n} of {total}">Page &#123;n&#125; of &#123;total&#125;</option>
                      <option value="{n} / {total}">&#123;n&#125; / &#123;total&#125;</option>
                      <option value="{n}">&#123;n&#125;</option>
                    </select>
                  </div>
                </div>
              )}

              {/* JPG to PDF options */}
              {toolId === 'jpg-to-pdf' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Orientation
                    </label>
                    <select
                      value={imgOrientation}
                      onChange={(e) => setImgOrientation(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value="fit">Auto Fit (Match Image)</option>
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Margin
                    </label>
                    <select
                      value={imgMargin}
                      onChange={(e) => setImgMargin(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none"
                    >
                      <option value="small">Small Margin (20pt)</option>
                      <option value="normal">Normal Margin (40pt)</option>
                      <option value="none">No Margin (Edge to Edge)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Compress options */}
              {toolId === 'compress-pdf' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
                    Compression Level
                  </label>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[
                      { id: 'low', label: 'Low', desc: 'Highest Quality' },
                      { id: 'recommended', label: 'Recommended', desc: 'Good Quality & Size' },
                      { id: 'extreme', label: 'Extreme', desc: 'Smallest File Size' }
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setCompressLevel(lvl.id)}
                        className={`p-3 rounded-2xl border text-left transition ${
                          compressLevel === lvl.id
                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300'
                            : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="text-xs font-bold">{lvl.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{lvl.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Unlock PDF password option */}
              {toolId === 'unlock-pdf' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Enter Current Password (Optional if unprotected)
                  </label>
                  <input
                    type="password"
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    placeholder="Enter file password..."
                    className="w-full max-w-sm px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}

              {/* Office document note */}
              {['pdf-to-word', 'word-to-pdf', 'pdf-to-excel', 'excel-to-pdf', 'powerpoint-to-pdf', 'pdf-to-powerpoint'].includes(toolId) && (
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>AI high-fidelity document layout reconstruction enabled.</span>
                </div>
              )}

            </div>
          )}

          {/* Action Button */}
          {files.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleStartProcess}
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-base shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2.5 transition-all"
              >
                <span>{toolInfo.action || 'Convert Now'}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Processing State */}
      {isProcessing && (
        <ProgressBar progress={progress} statusMessage={statusMessage} />
      )}

      {/* Result State */}
      {result && (
        <ResultCard t={t} result={result} onReset={resetAll} />
      )}

      {/* Error state alert */}
      {errorMessage && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h5 className="font-bold">Conversion Issue</h5>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
          <button
            onClick={() => setErrorMessage('')}
            className="text-xs font-semibold underline hover:opacity-75"
          >
            Dismiss
          </button>
        </div>
      )}

    </div>
  );
}
