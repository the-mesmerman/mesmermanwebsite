import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Download,
  FileText,
  Maximize2,
  Minimize2,
  Upload,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { StoryItem } from '../types/site';
import { ImageWithFallback } from './ImageWithFallback';

interface StoryReaderModalProps {
  story: StoryItem;
  onClose: () => void;
}

export const StoryReaderModal: React.FC<StoryReaderModalProps> = ({
  story,
  onClose,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localPdfUrl, setLocalPdfUrl] = useState<string | null>(null);
  const [localPdfName, setLocalPdfName] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePdfUrl = localPdfUrl || story.pdfUrl;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  useEffect(() => {
    return () => {
      if (localPdfUrl) {
        URL.revokeObjectURL(localPdfUrl);
      }
    };
  }, [localPdfUrl]);

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (localPdfUrl) URL.revokeObjectURL(localPdfUrl);
    const url = URL.createObjectURL(file);
    setLocalPdfUrl(url);
    setLocalPdfName(file.name);
  };

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Reading ${story.title}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-[#F6FAF7] dark:bg-[#06110D] flex flex-col"
    >
      {/* Reader Header */}
      <header className="border-b border-emerald-950/10 dark:border-emerald-500/15 bg-white dark:bg-[#0B1B15] px-4 sm:px-6 h-16 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <motion.button
            type="button"
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-950/12 dark:border-emerald-500/20 hover:border-emerald-500/60 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors whitespace-nowrap min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Bookshelf</span>
          </motion.button>

          <div className="hidden sm:block truncate">
            <h2 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
              {story.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleLocalFileChange}
            className="hidden"
          />

          {activePdfUrl && story.downloadAllowed && (
            <motion.a
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              href={activePdfUrl}
              download={localPdfName || `${story.id}.pdf`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-emerald-950/12 dark:border-emerald-500/20 hover:border-emerald-500/60 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors min-h-[40px] whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </motion.a>
          )}

          <motion.button
            type="button"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors min-h-[40px] whitespace-nowrap"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit Full-Screen</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full-Screen</span>
              </>
            )}
          </motion.button>
        </div>
      </header>

      {/* Reader Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col">
        {activePdfUrl ? (
          <div className="flex-1 w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-emerald-950/12 dark:border-emerald-500/20 bg-white dark:bg-[#0B1B15] shadow-lg flex flex-col">
            <iframe
              title={`${story.title} PDF Viewer`}
              src={activePdfUrl}
              className="w-full flex-1 min-h-[70vh]"
            />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto my-auto rounded-2xl border border-emerald-950/12 dark:border-emerald-500/20 bg-white dark:bg-[#0B1B15] p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
            <div className="sm:col-span-5 aspect-[3/4] rounded-xl overflow-hidden border border-emerald-950/12 dark:border-emerald-500/20 bg-emerald-950 shadow-lg">
              <ImageWithFallback
                src={story.coverImage}
                alt={`Cover for ${story.title}`}
                fallbackTitle={story.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="sm:col-span-7 space-y-5">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {story.editionLabel} · {story.status}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-emerald-50">
                {story.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {story.description}
              </p>

              <div className="rounded-xl border border-dashed border-emerald-950/20 dark:border-emerald-500/25 bg-[#F6FAF7] dark:bg-[#071510] p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>PDF Manuscript Not Linked Yet</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  To publish the full story directly here, set the{' '}
                  <code className="font-mono text-emerald-600 dark:text-emerald-400">
                    pdfUrl
                  </code>{' '}
                  field for this story in the static story catalog, or preview a
                  local PDF file from your device below.
                </p>
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors min-h-[38px]"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Preview Local PDF File</span>
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
