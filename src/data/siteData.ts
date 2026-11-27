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
    id: 'v3-2',
    version: 'V3.2',
    date: '27 November 2026',
    title: 'Loading Screen, Motion Refinement & Minimalist Polish',
    summary:
      'Introduced a randomized sketchbook loading screen with a zoom-in transition, refined site-wide motion physics, and simplified page layouts.',
    highlights: [
      'Added a full-screen loading screen featuring a geometric wheel, slow center drift, and 49 randomized non-overlapping doodles.',
      'Implemented directional spring page transitions and an expanding straight underline indicator in the navigation bar.',
      'Removed scrollbars from the Projects Padlet embed, cleared redundant footer links, and standardized minimalist hover states.',
    ],
  },
  {
    id: 'v3-1',
    version: 'V3.1',
    date: '23 November 2026',
    title: 'Pastel Sketchbook Aesthetic, Projects & Bug Fixes',
    summary:
      'Updated the site to a minimalist pastel green sketchbook style with square geometry, a moving botanical background, and a dedicated Projects page.',
    highlights: [
      'Switched to pastel green accents, crisp square borders, and sketchbook SVG doodles.',
      'Added the Projects tab with a full-height Padlet board embed.',
      'Introduced the ambient botanical canvas alongside layout refinements and bug fixes.',
    ],
  },
  {
    id: 'v3-0',
    version: 'V3.0',
    date: '22 November 2026',
    title: 'Custom Website Rebuild',
    summary:
      'Rebuilt the website from the ground up as a custom web application replacing Google Sites, featuring interactive demos and an embedded story reader.',
    highlights: [
      'Replaced Google Sites with a custom-coded portfolio.',
      'Added interactive 3D Rubik’s Cube, Math, Tech, and Nature visuals with light and dark modes.',
      'Integrated an embedded PDF reader for archived stories.',
    ],
  },
  {
    id: 'v2-6',
    version: 'V2.6',
    date: '2 April 2025',
    title: 'Homepage Header Redesign',
    summary:
      'Refreshed the homepage visual layout with a new header illustration.',
    highlights: [
      'Updated the homepage layout structure.',
      'Replaced the header artwork with a new AI-generated illustration.',
    ],
  },
  {
    id: 'v2-5',
    version: 'V2.5',
    date: '23 June 2024',
    title: 'School Projects & Interface Updates',
    summary:
      'Expanded the portfolio with a dedicated School Projects section and refined secondary navigation.',
    highlights: [
      'Added the School Projects showcase page.',
      'Redesigned the More Options menu and applied minor interface updates.',
    ],
  },
  {
    id: 'v2-4',
    version: 'V2.4',
    date: '20 May 2024',
    title: 'Website Trailer Release',
    summary:
      'Published an introductory trailer showcasing the site and its sections.',
    highlights: [
      'Added a website trailer video to the site.',
    ],
  },
  {
    id: 'v2-3',
    version: 'V2.3',
    date: '10 May 2024',
    title: 'Old Pages Archive & About Me Redesign',
    summary:
      'Created an archive for earlier page layouts, redesigned the About Me page, and streamlined site records.',
    highlights: [
      'Added an Old Pages Archive inside More Options preserving earlier page designs.',
      'Launched a redesigned About Me page and updated the site footer.',
      'Removed the Upcoming Updates section from Website Records.',
    ],
  },
  {
    id: 'v2-2',
    version: 'V2.2',
    date: '24 April 2024',
    title: 'Navigation Expansion & Homepage Banner',
    summary:
      'Reorganized secondary navigation under More Options and enlarged the homepage hero banner.',
    highlights: [
      'Introduced the More Options navigation section.',
      'Expanded the homepage banner scale and adjusted the title layout.',
    ],
  },
  {
    id: 'v2-1',
    version: 'V2.1',
    date: '5 April 2024',
    title: 'Brand Identity & Record Cleanup',
    summary:
      'Standardized site branding with an updated logo and removed obsolete archive logs.',
    highlights: [
      'Updated site elements with the new logo and unified branding.',
      'Corrected layout inconsistencies and removed the Announcements History log.',
    ],
  },
  {
    id: 'v2-0',
    version: 'V2.0',
    date: '1 January 2024',
    title: 'Book Reviews Blog Launch',
    summary:
      'Opened the new year with a dedicated book reviews section integrated into the homepage.',
    highlights: [
      'Added the Book Reviews blog onto the homepage.',
    ],
  },
  {
    id: 'v1-9',
    version: 'V1.9',
    date: '30 November 2023',
    title: 'Google Sites Theme & Reading Adjustment',
    summary:
      'Refined the custom Google Sites theme and improved homepage readability.',
    highlights: [
      'Updated the custom Google Sites theme styling.',
      'Enabled Google Sites reading adjustments on the homepage.',
    ],
  },
  {
    id: 'v1-8',
    version: 'V1.8',
    date: '30 November 2023',
    title: 'Community Page & Updates Book Restructure',
    summary:
      'Overhauled the Updates Book layout, introduced gradient styling, and launched a dedicated Community page.',
    highlights: [
      'Replaced the feedback confirmation screen with a Community page linking to Padlet.',
      'Restructured the Updates Book into collapsible sections with GUI change logs and bulleted history.',
      'Applied gradient styling across sections and updated the main banner image.',
    ],
  },
  {
    id: 'v1-7',
    version: 'V1.7',
    date: '29 November 2023',
    title: 'Padlet Feedback & Social Links',
    summary:
      'Transitioned feedback collection to Padlet and adjusted homepage social links and footer versioning.',
    highlights: [
      'Centered social media links on the homepage.',
      'Replaced the Google Forms feedback system with a Padlet-powered board.',
      'Updated the current version display in the footer.',
    ],
  },
  {
    id: 'v1-6',
    version: 'V1.6',
    date: '22 October 2023',
    title: 'Stories Library Expansion',
    summary:
      'Updated the My Stories section with newly published and in-progress written works.',
    highlights: [
      'Published a completed story in My Stories.',
      'Added status tracking for an upcoming work in progress.',
    ],
  },
  {
    id: 'v1-5',
    version: 'V1.5',
    date: '20 July 2023',
    title: 'PENUP Profile Link & Cleanup',
    summary:
      'Connected the PENUP artwork profile and simplified older introductory links.',
    highlights: [
      'Added an external link to the PENUP artwork profile.',
      'Removed the introductory Scratch button.',
    ],
  },
  {
    id: 'v1-4',
    version: 'V1.4',
    date: '10 July 2023',
    title: 'Typography Update & Stories Cleanup',
    summary:
      'Updated site typography and streamlined the My Stories page layout.',
    highlights: [
      'Updated typography across the website.',
      'Removed the drafts section from My Stories and applied minor layout refinements.',
    ],
  },
  {
    id: 'v1-3',
    version: 'V1.3',
    date: '30 May 2023',
    title: 'Embedded Feedback & First Story Publication',
    summary:
      'Integrated the feedback form directly into the site and published the first completed story.',
    highlights: [
      'Embedded the feedback form directly on-page with a pre-submission notice.',
      'Published the first completed story originally written in 2022.',
    ],
  },
  {
    id: 'v1-2',
    version: 'V1.2',
    date: '29 May 2023',
    title: 'About Me, Stories & Feedback Form',
    summary:
      'Renamed the introductory bio page to About Me and launched the My Stories and Feedback sections.',
    highlights: [
      'Renamed "Who am I?" to About Me.',
      'Added the My Stories page and initial feedback form.',
    ],
  },
  {
    id: 'v1-1',
    version: 'V1.1',
    date: '28 May 2023',
    title: 'Dedicated Bio Page & Updates Book',
    summary:
      'Separated the personal bio into its own page and introduced a site changelog.',
    highlights: [
      'Moved "Who am I?" to a standalone page.',
      'Added the initial Updates Book changelog.',
    ],
  },
  {
    id: 'v1-0',
    version: 'V1.0',
    date: '28 May 2023',
    title: 'Initial Site Launch',
    summary:
      'Launched the first version of the personal website on Google Sites.',
    highlights: [
      'Published the initial homepage and core navigation.',
    ],
  },
];
