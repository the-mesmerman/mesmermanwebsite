import type {
  ArchiveMilestone,
  InterestItem,
  NavItem,
  StoryItem,
} from '../types/site';

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', description: 'Home' },
  { id: 'about', label: 'About', description: 'About me & interests' },
  { id: 'stories', label: 'Stories', description: 'My old stories' },
  { id: 'archive', label: 'Archive', description: 'Past site versions' },
];

export const INTERESTS: InterestItem[] = [
  {
    id: 'technology',
    title: 'Tech',
    shortLabel: 'Tech & Coding',
    tagline: 'Messing around with code and software.',
    summary:
      'I like seeing how computers work and building interactive stuff with code.',
    details: [],
    visualType: 'tech-matrix',
  },
  {
    id: 'mathematics',
    title: 'Math',
    shortLabel: 'Math',
    tagline: 'Puzzles, patterns, and problem-solving.',
    summary:
      'Trying out math problems and seeing how simple rules turn into cool patterns.',
    details: [],
    visualType: 'math-canvas',
  },
  {
    id: 'cubing',
    title: 'Cubing',
    shortLabel: 'Cubing',
    tagline: 'Solving Rubik’s Cubes.',
    summary:
      'Speedcubing, pattern recognition, and trying to beat my solve times.',
    details: [],
    visualType: 'three-cube',
  },
  {
    id: 'books',
    title: 'Books',
    shortLabel: 'Books',
    tagline: 'Reading fiction and novels.',
    summary: 'Reading good novels in my free time.',
    details: [],
    visualType: 'image',
    imageUrl: '/src/assets/images/interest_books_editorial_1795319117388.jpg',
    imageAlt: 'Hardcover novels stacked beside a reading lamp on a wood desk',
  },
  {
    id: 'creative-writing',
    title: 'Writing',
    shortLabel: 'Writing',
    tagline: 'Two older stories I wrote.',
    summary:
      'I wrote two stories earlier. I stopped writing new ones, so both are kept here.',
    details: [],
    visualType: 'image',
    imageUrl: '/src/assets/images/interest_writing_editorial_1795319117395.jpg',
    imageAlt: 'Open notebook with fountain pen and ink sketches',
  },
  {
    id: 'nature',
    title: 'Nature',
    shortLabel: 'Nature',
    tagline: 'Getting outdoors.',
    summary:
      'Taking a break from screens to spend time outside and enjoy nature.',
    details: [],
    visualType: 'image',
    imageUrl: '/src/assets/images/interest_nature_editorial_1795319117431.jpg',
    imageAlt: 'Misty emerald mountain ridges at dawn',
  },
];

export const STORIES_AUTHOR_NOTE =
  'I don’t write new stories anymore, so these two are just kept here.';

export const STORIES: StoryItem[] = [
  {
    id: 'bunzo-the-rabbit',
    title: 'The Adventures of Bunzo the Rabbit',
    editionLabel: 'Story 01',
    status: 'Published',
    coverImage: '/src/assets/images/cover_bunzo_rabbit_1795319115176.jpg',
    description:
      'Editable synopsis placeholder — replace with the blurb for The Adventures of Bunzo the Rabbit.',
    isPlaceholderDescription: true,
    pdfUrl: null,
    downloadAllowed: true,
    accentTone: 'cobalt',
  },
  {
    id: 'ekavir-bravest-of-the-brave',
    title: 'Ekavir - Bravest of the Brave',
    editionLabel: 'Story 02',
    status: 'Published',
    coverImage: '/src/assets/images/cover_ekavir_brave_1795319117106.jpg',
    description:
      'Editable synopsis placeholder — replace with the blurb for Ekavir - Bravest of the Brave.',
    isPlaceholderDescription: true,
    pdfUrl: null,
    downloadAllowed: true,
    accentTone: 'amber',
  },
];

export const ARCHIVE_MILESTONES: ArchiveMilestone[] = [
  {
    id: 'v1-0',
    version: 'V1.0',
    date: '28 May 2023',
    title: 'First Homepage',
    summary: 'Put up my first homepage and quick intro.',
    highlights: ['First version online.', 'Basic intro page.'],
  },
  {
    id: 'v1-2',
    version: 'V1.2',
    date: '29 May 2023',
    title: 'About Me, Stories & Feedback',
    summary: 'Added pages for About Me, My Stories, and visitor feedback.',
    highlights: ['Added the About Me page.', 'Added My Stories and feedback.'],
  },
  {
    id: 'v1-3',
    version: 'V1.3',
    date: '30 May 2023',
    title: 'Small Updates',
    summary:
      'Update from 30 May 2023 — editable placeholder for V1.3 notes.',
    highlights: ['Editable placeholder note.'],
    isEditablePlaceholder: true,
  },
  {
    id: 'v2-0',
    version: 'V2.0',
    date: 'Present',
    title: 'Redesign',
    summary:
      'Updated the site with a green nature theme, 3D visuals, small interactive demos, and a story reader.',
    highlights: [
      'New logo, favicon, and light/dark mode.',
      '3D crystal hero and playable Rubik’s Cube.',
      'Simple 4-page layout.',
    ],
  },
];
