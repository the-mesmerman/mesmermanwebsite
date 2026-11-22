import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Download,
  ExternalLink,
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
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: 6 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-[#F4F7F4] dark:bg-[#0B1410] flex flex-col"
    >
      {/* Reader Header */}
      <header className="border-b border-[#0F2A1D]/11 dark:border-[#D6E8DE]/11 bg-white dark:bg-[#111E18] px-4 sm:px-6 h-16 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 hover:border-[#0F7655]/60 dark:hover:border-[#34D399]/60 text-xs font-medium text-[#11221A] dark:text-[#EDF4F0] transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Stories</span>
          </button>

          <div className="hidden sm:block truncate">
            <h2 className="font-display text-sm sm:text-base font-semibold text-[#11221A] dark:text-[#EDF4F0] truncate">
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
            <a
              href={localPdfUrl ? localPdfUrl : story.downloadUrl || activePdfUrl}
              download={localPdfName || `${story.id}.pdf`}
              target={localPdfUrl ? undefined : '_blank'}
              rel={localPdfUrl ? undefined : 'noopener noreferrer'}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 hover:border-[#0F7655]/60 dark:hover:border-[#34D399]/60 text-xs font-medium text-[#11221A] dark:text-[#EDF4F0] transition-colors duration-150 min-h-[40px] whitespace-nowrap shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>
          )}

          {activePdfUrl && (
            <a
              href={localPdfUrl ? localPdfUrl : story.driveViewUrl || activePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 hover:border-[#0F7655]/60 dark:hover:border-[#34D399]/60 text-xs font-medium text-[#11221A] dark:text-[#EDF4F0] transition-colors duration-150 min-h-[40px] whitespace-nowrap shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in Drive</span>
            </a>
          )}

          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0F7655] hover:bg-[#0D6448] text-white text-xs font-medium transition-colors duration-150 min-h-[40px] whitespace-nowrap shrink-0"
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
          </button>
        </div>
      </header>

      {/* Reader Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col">
        {activePdfUrl ? (
          <div className="flex-1 w-full max-w-5xl mx-auto rounded-xl overflow-hidden border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-white dark:bg-[#111E18] flex flex-col">
            <iframe
              title={`${story.title} PDF Viewer`}
              src={activePdfUrl}
              allow="autoplay"
              allowFullScreen
              className="w-full flex-1 min-h-[75vh] bg-white"
            />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto my-auto rounded-xl border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-white dark:bg-[#111E18] p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
            <div className="sm:col-span-5 aspect-[3/4] rounded-lg overflow-hidden border border-[#0F2A1D]/12 dark:border-[#D6E8DE]/12 bg-[#11221A]">
              <ImageWithFallback
                src={story.coverImage}
                alt={`Cover for ${story.title}`}
                fallbackTitle={story.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="sm:col-span-7 space-y-5">
              <div className="font-mono text-xs text-[#647A6F] dark:text-[#748B80]">
                {story.editionLabel} · {story.status}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#11221A] dark:text-[#EDF4F0]">
                {story.title}
              </h3>
              <p className="text-sm text-[#4A6256] dark:text-[#94ABA0] leading-relaxed">
                {story.description}
              </p>

              <div className="rounded-lg border border-dashed border-[#0F2A1D]/20 dark:border-[#D6E8DE]/20 bg-[#F4F7F4] dark:bg-[#0E1A15] p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#11221A] dark:text-[#EDF4F0]">
                  <FileText className="w-4 h-4 text-[#0F7655] dark:text-[#34D399]" />
                  <span>PDF Not Linked Yet</span>
                </div>
                <p className="text-xs text-[#647A6F] dark:text-[#748B80] leading-relaxed">
                  Preview a local PDF file from your device below.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#0F7655] hover:bg-[#0D6448] text-white text-xs font-medium transition-colors duration-150 min-h-[38px]"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Preview Local PDF File</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};
