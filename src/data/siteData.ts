import type {
  ArchiveMilestone,
  InterestItem,
  NavItem,
  StoryItem,
} from '../types/site';
import booksImg from '../assets/images/interest_books_editorial_1795319117388.jpg';
import writingImg from '../assets/images/interest_writing_editorial_1795319117395.jpg';
import natureImg from '../assets/images/interest_nature_editorial_1795319117431.jpg';
import bunzoCoverImg from '../assets/images/cover_bunzo_rabbit_1795319115176.jpg';
import ekavirCoverImg from '../assets/images/cover_ekavir_brave_1795319117106.jpg';

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', description: 'Home' },
  { id: 'about', label: 'About', description: 'About me & interests' },
  { id: 'projects', label: 'Projects', description: 'Work & projects board' },
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
    imageUrl: booksImg,
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
    imageUrl: writingImg,
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
    imageUrl: natureImg,
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
    coverImage: bunzoCoverImg,
    description:
      'Separated from his parents after a flood hits Bunny Town, Bunzo ends up in the human world with a boy named Frank and goes on a trip to Miami to reunite his family.',
    isPlaceholderDescription: false,
    pdfUrl:
      'https://drive.google.com/file/d/1lOHBNk-2ZFbrvq-ROLUbdwGUhrQtJ7KX/preview',
    driveViewUrl:
      'https://drive.google.com/file/d/1lOHBNk-2ZFbrvq-ROLUbdwGUhrQtJ7KX/view?usp=drivesdk',
    downloadUrl:
      'https://drive.google.com/uc?export=download&id=1lOHBNk-2ZFbrvq-ROLUbdwGUhrQtJ7KX',
    downloadAllowed: true,
    accentTone: 'cobalt',
  },
  {
    id: 'ekavir-bravest-of-the-brave',
    title: 'Ekavir - Bravest of the Brave',
    editionLabel: 'Story 02',
    status: 'Published',
    coverImage: ekavirCoverImg,
    description:
      'After losing his home in the Himalayan village of Jalakpur, Ekavir trains under Master Keshav to become a skilled swordsman and defend his country.',
    isPlaceholderDescription: false,
    pdfUrl:
      'https://drive.google.com/file/d/1rCKIsQdah65uzqa3oj2ZlJJDBUiNbxPX/preview',
    driveViewUrl:
      'https://drive.google.com/file/d/1rCKIsQdah65uzqa3oj2ZlJJDBUiNbxPX/view?usp=drivesdk',
    downloadUrl:
      'https://drive.google.com/uc?export=download&id=1rCKIsQdah65uzqa3oj2ZlJJDBUiNbxPX',
    downloadAllowed: true,
    accentTone: 'amber',
  },
];

export const ARCHIVE_MILESTONES: ArchiveMilestone[] = [
  {
    id: 'v3-1',
    version: 'V3.1',
    date: '23 November 2026',
    title: 'Pastel Sketchbook Aesthetic, Projects & Bug Fixes',
    summary:
      'Updated the site aesthetic to a minimalist pastel green sketchbook style with square geometry and a moving botanical background, added the new Projects tab, and applied small bug fixes.',
    highlights: [
      'Switched to vibrant pastel green accents, crisp square borders, and 3D sketchbook doodles.',
      'Added the Projects tab with a near-full-page Padlet board embed.',
      'Added the moving botanical canvas, updated About heading, Bunzo cover framing, rounded logo/favicon, and bug fixes.',
    ],
  },
  {
    id: 'v3-0',
    version: 'V3.0',
    date: '22 November 2026',
    title: 'Custom Website Rebuild (Replaced Google Sites)',
    summary:
      'Rebuilt the website from scratch as a custom web app replacing Google Sites, featuring a green nature theme, 3D visuals, interactive demos, and an in-site story reader.',
    highlights: [
      'Replaced Google Sites with a custom-coded portfolio.',
      'Added interactive Rubik’s Cube, Math, Tech, and Nature visuals with light/dark mode.',
      'Added an embedded PDF story reader for Bunzo the Rabbit and Ekavir.',
    ],
  },
  {
    id: 'v2-6',
    version: 'V2.6',
    date: '2nd April 2025',
    title: '',
    summary:
      'Major change on the homepage, new AI Image for the header from Microsoft Designer AI.',
    highlights: [],
  },
  {
    id: 'v2-5',
    version: 'V2.5',
    date: '23rd June 2024',
    title: '',
    summary:
      'Added School Projects, redesigned More Options page, Minor GUI Updates.',
    highlights: [],
  },
  {
    id: 'v2-4',
    version: 'V2.4',
    date: '20th May 2024',
    title: '',
    summary: 'Added a website trailer.',
    highlights: [],
  },
  {
    id: 'v2-3',
    version: 'V2.3',
    date: '10th May 2024',
    title: '',
    summary:
      'Added the "Old Pages Archive" in "More Options" with old versions of website pages. "About Me" now has a new page. The old page is available in the Archive. Removed "Upcoming Updates" from the Website Records. Updated the footer.',
    highlights: [],
  },
  {
    id: 'v2-2',
    version: 'V2.2',
    date: '24th April 2024',
    title: '',
    summary:
      "Added 'More Options' and made the home page banner into a large banner from a cover banner, minor changes. Changed the layout of the title on the Home page.",
    highlights: [],
  },
  {
    id: 'v2-1',
    version: 'V2.1',
    date: '5th April 2024',
    title: '',
    summary:
      "Redecorated a few elements of the website and updated a few mistakes and old elements of the website by changing them to my new logo and branding. Also removed 'Announcements History' from website records because it was unnecessary.",
    highlights: [],
  },
  {
    id: 'v2-0',
    version: 'V2.0',
    date: '1st January 2024',
    title: '',
    summary:
      'Added the new book reviews blog onto the homepage - New Year Update.',
    highlights: [],
  },
  {
    id: 'v1-9',
    version: 'V1.9',
    date: '30th November 2023',
    title: '',
    summary:
      'Updated the custom theme used in Google Sites. Turned on the Reading adjustment of Google Sites on the home page. A few minor changes. Getting ready for the new year update.',
    highlights: [],
  },
  {
    id: 'v1-8',
    version: 'V1.8',
    date: '30th November 2023',
    title: '',
    summary:
      "Added a few gradients and updated a few designs. Moved the 'Updates Book' option to the end of the 'Advanced Options' section. Added gradients to 'Community' section. Turned the main Updates Book content into a Collapsible Group. Added 'Upcoming Updates' and 'GUI Changes Record' section to Updates Book. Added bullets to the 'Updates History' section: the bullets represent past updates. Replaced the 'Confirm Feedback' page with the 'Community' page which basically tells you a bit about the community, and has a link to the actual Padlet page. Changed the Banner Image.",
    highlights: [],
  },
  {
    id: 'v1-7',
    version: 'V1.7',
    date: '29th November 2023',
    title: '',
    summary:
      "Centered the social media links on my homepage. Added a new complaints and suggestions system powered by Padlet. Removed the old system powered by google forms(I felt that it's easier to just directly chat). Changed the 'current version' part of the footer.",
    highlights: [],
  },
  {
    id: 'v1-6',
    version: 'V1.6',
    date: '22nd October 2023',
    title: '',
    summary:
      "Updated 'My Stories' with a new publication in progress and published one of my works.",
    highlights: [],
  },
  {
    id: 'v1-5',
    version: 'V1.5',
    date: '20 July 2023',
    title: '',
    summary:
      "Added a link to my PENUP profile, removed the 'What is Scratch?' button.",
    highlights: [],
  },
  {
    id: 'v1-4',
    version: 'V1.4',
    date: '10th July 2023',
    title: '',
    summary:
      "Updated the fonts for website, removed drafts section from 'My Stories' + some more tweaks.",
    highlights: [],
  },
  {
    id: 'v1-3',
    version: 'V1.3',
    date: '30 May 2023',
    title: '',
    summary:
      "Switched the feedback form from a separate site into a page embed + added confirmation & 'READ ME' before visiting feedback form page + some more tweaks. Published my first completed story from 2022! 😃",
    highlights: [],
  },
  {
    id: 'v1-2',
    version: 'V1.2',
    date: '29 May 2023',
    title: '',
    summary:
      "Turned 'Who am I?' into 'About Me' and added 'My Stories'. + added a feedback form.",
    highlights: [],
  },
  {
    id: 'v1-1',
    version: 'V1.1',
    date: '28 May 2023',
    title: '',
    summary:
      "Gave 'Who am I?' its own page, added the Updates Book + some tweaks.",
    highlights: [],
  },
  {
    id: 'v1-0',
    version: 'V1.0',
    date: '28 May 2023',
    title: '',
    summary: 'Home Page and basic functions.',
    highlights: [],
  },
];
