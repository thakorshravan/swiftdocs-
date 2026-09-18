import React, { useRef, useState } from 'react';
import { UploadCloud, File, Trash2, ArrowUp, ArrowDown, Plus, AlertCircle } from 'lucide-react';

export default function DropZone({
  t,
  files,
  setFiles,
  accept = '.pdf',
  multiple = false,
  toolId,
  maxSizeBytes = 50 * 1024 * 1024, // 50MB default
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndAddFiles = (incomingFiles) => {
    setErrorMsg('');
    const newValidFiles = [];

    for (const f of incomingFiles) {
      if (f.size > maxSizeBytes) {
        setErrorMsg(`"${f.name}" exceeds the 50MB size limit. Please choose a smaller file.`);
        continue;
      }
      newValidFiles.push(f);
    }

    if (newValidFiles.length > 0) {
      if (multiple) {
        setFiles((prev) => [...prev, ...newValidFiles]);
      } else {
        setFiles([newValidFiles[0]]);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index, direction) => {
    setFiles((prev) => {
      const copy = [...prev];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  return (
    <div className="w-full">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Main Drag/Drop Zone */}
      {files.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-950/40 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 shadow-sm'
          }`}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse-subtle" />
          </div>

          <h3 className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-white mb-2">
            <span className="hidden sm:inline">{t.dropzone.title}</span>
            <span className="inline sm:hidden">{t.dropzone.mobileTitle}</span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            {t.dropzone.subtitle}
          </p>

          <button
            type="button"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition-all transform active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t.dropzone.selectBtn}</span>
          </button>
        </div>
      ) : (
        /* Selected Files View */
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 shadow-sm">
          
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Selected {files.length} {files.length === 1 ? 'File' : 'Files'}
              </h4>
              {multiple && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t.dropzone.reorderTip}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {multiple && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.dropzone.addMore}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setFiles([])}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.dropzone.clearAll}</span>
              </button>
            </div>
          </div>

          {/* Files List */}
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>

                {/* File actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {multiple && (
                    <>
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveFile(index, -1)}
                        className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={index === files.length - 1}
                        onClick={() => moveFile(index, 1)}
                        className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    title="Remove File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Error notification */}
      {errorMsg && (
        <div className="mt-4 flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs sm:text-sm animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
