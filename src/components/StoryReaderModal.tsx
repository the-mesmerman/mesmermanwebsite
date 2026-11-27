import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Download,
  ExternalLink,
  FileText,
  Maximize2,
  Minimize2,
  Upload,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import type { StoryItem } from '../types/site';
import { ImageWithFallback } from './ImageWithFallback';
import { SPRING_FLUID } from './MotionPrimitives';

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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
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

  return createPortal(
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Reading ${story.title}`}
      initial={{ opacity: 0, scale: 0.985, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.99, y: 8 }}
      transition={SPRING_FLUID}
      className="fixed inset-0 z-[60] bg-[#F7F9F3] dark:bg-[#162018] flex flex-col"
    >
      {/* Square Reader Header */}
      <header className="border-b border-[#BFE2BD] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] px-4 sm:px-6 h-16 flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close story reader"
            className="square-stamp-mint inline-flex items-center gap-1.5 px-3 py-2 rounded-none border border-[#BFE2BD] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] hover:border-[#389442] dark:hover:border-[#7DE386] text-xs font-medium text-[#223024] dark:text-[#EDF3EA] whitespace-nowrap shrink-0 min-h-[38px]"
          >
            <X className="w-4 h-4 text-[#2C913A] dark:text-[#7EE686]" />
            <span>Close</span>
          </button>

          <div className="hidden sm:block truncate">
            <h2 className="font-display text-sm sm:text-base font-medium text-[#223024] dark:text-[#EDF3EA] truncate">
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
              className="square-stamp-mint inline-flex items-center gap-1.5 px-3 py-2 rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] hover:border-[#4F9D58] dark:hover:border-[#8CD892] text-xs font-medium text-[#223024] dark:text-[#EDF3EA] min-h-[38px] whitespace-nowrap shrink-0"
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
              className="square-stamp-mint inline-flex items-center gap-1.5 px-3 py-2 rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#F7F9F3] dark:bg-[#162018] hover:border-[#4F9D58] dark:hover:border-[#8CD892] text-xs font-medium text-[#223024] dark:text-[#EDF3EA] min-h-[38px] whitespace-nowrap shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open in Drive</span>
            </a>
          )}

          <button
            type="button"
            onClick={toggleFullscreen}
            className="square-stamp-btn inline-flex items-center gap-1.5 px-3 py-2 rounded-none border border-[#389442] bg-[#7DE386] hover:bg-[#64D66E] text-[#132B16] text-xs font-medium min-h-[38px] whitespace-nowrap shrink-0"
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

      {/* Square Reader Viewport */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col">
        {activePdfUrl ? (
          <div className="flex-1 w-full max-w-5xl mx-auto rounded-none overflow-hidden border border-[#C9E1C7] dark:border-[#314735] bg-white dark:bg-[#1D2A20] flex flex-col">
            <iframe
              title={`${story.title} PDF Viewer`}
              src={activePdfUrl}
              allow="autoplay"
              allowFullScreen
              className="w-full flex-1 min-h-[75vh] bg-white"
            />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto my-auto rounded-none border border-[#C9E1C7] dark:border-[#314735] bg-[#FCFDF9] dark:bg-[#1D2A20] p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-12 gap-8 items-center">
            <div className="sm:col-span-5 aspect-[3/4] rounded-none overflow-hidden border border-[#C9E1C7] dark:border-[#314735] bg-[#F7F9F3]">
              <ImageWithFallback
                src={story.coverImage}
                alt={`Cover for ${story.title}`}
                fallbackTitle={story.title}
                className={`w-full h-full object-cover ${
                  story.id === 'bunzo-the-rabbit' ? 'scale-[1.08]' : ''
                }`}
              />
            </div>

            <div className="sm:col-span-7 space-y-5">
              <div className="font-mono text-xs text-[#5B6E5D] dark:text-[#9FB5A1]">
                {story.editionLabel} · {story.status}
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#223024] dark:text-[#EDF3EA]">
                {story.title}
              </h3>
              <p className="text-sm text-[#5B6E5D] dark:text-[#9FB5A1] leading-relaxed">
                {story.description}
              </p>

              <div className="rounded-none border border-dashed border-[#7DE386] dark:border-[#497A50] bg-[#E2F6DF] dark:bg-[#162018] p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-medium text-[#223024] dark:text-[#EDF3EA]">
                  <FileText className="w-4 h-4 text-[#2C913A] dark:text-[#7EE686]" />
                  <span>PDF Not Linked Yet</span>
                </div>
                <p className="text-xs text-[#536956] dark:text-[#9FB5A1] leading-relaxed">
                  Preview a local PDF file from your device below.
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="square-stamp-btn inline-flex items-center gap-2 px-3.5 py-2 rounded-none border border-[#389442] bg-[#7DE386] hover:bg-[#64D66E] text-[#132B16] text-xs font-medium min-h-[38px]"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Preview Local PDF File</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>,
    document.body,
  );
};
