import React from 'react';
import logoImg from '../assets/logo.png';

interface MonogramLogoProps {
  size?: number;
  className?: string;
}

export const MonogramLogo: React.FC<MonogramLogoProps> = ({
  size = 32,
  className = '',
}) => {
  const sizeClass =
    size <= 20
      ? 'w-5 h-5 rounded-md'
      : size <= 28
        ? 'w-7 h-7 rounded-lg'
        : size <= 34
          ? 'w-8 h-8 rounded-lg'
          : 'w-9 h-9 rounded-lg';

  return (
    <img
      src={logoImg}
      alt="Ishan Ganti logo"
      width={size}
      height={size}
      className={`${sizeClass} object-cover shrink-0 border border-emerald-950/15 dark:border-emerald-500/30 select-none ${className}`}
    />
  );
};
