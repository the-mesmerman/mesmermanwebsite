export type PageId = 'home' | 'about' | 'projects' | 'stories' | 'archive';

export interface NavItem {
  id: PageId;
  label: string;
  description: string;
}

export interface InterestItem {
  id: string;
  title: string;
  shortLabel: string;
  tagline: string;
  summary: string;
  details: string[];
  visualType: 'three-cube' | 'math-canvas' | 'tech-matrix' | 'image';
  imageUrl?: string;
  imageAlt?: string;
}

export interface StoryItem {
  id: string;
  title: string;
  editionLabel: string;
  status: string;
  coverImage: string;
  description: string;
  isPlaceholderDescription: boolean;
  pdfUrl: string | null;
  driveViewUrl?: string;
  downloadUrl?: string;
  downloadAllowed: boolean;
  notes?: string;
  accentTone: 'cobalt' | 'amber';
}

export interface ArchiveMilestone {
  id: string;
  version: string;
  date: string;
  title: string;
  summary: string;
  highlights: string[];
  isEditablePlaceholder?: boolean;
}
