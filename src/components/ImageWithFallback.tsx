import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#DCE8D5] dark:bg-[#263328] text-[#292D29] dark:text-[#EAECE4] ${className}`}
      >
        <BookOpen className="w-7 h-7 text-[#344B39] dark:text-[#A8B99A] mb-3 opacity-80" />
        {fallbackTitle && (
          <span className="font-display text-sm font-medium tracking-tight">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
