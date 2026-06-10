export interface BookPageData {
    id: number;
    type: 'cover-inner' | 'profile' | 'about' | 'contributions' | 'projects' | 'skills' | 'recognitions' | 'quote';
    title?: string;
    subtitle?: string;
    content?: {
        name?: string;
        role?: string;
        location?: string;
        timeline?: string;
        profileImage?: string;
        paragraphs?: string[];
        items?: { title: string; description: string }[];
        skills?: { category: string; items: string[] }[];
        quote?: string;
        quoteAuthor?: string;
    };
}

// Each "page" in the book has a front and back face
// Pages are organized as spreads (left page + right page when open)
export const BOOK_PAGES: BookPageData[] = [
    // Page 0 - Inside front cover
    {
        id: 0,
        type: 'cover-inner',
        title: 'The Archive',
        subtitle: 'A Personal Chronicle',
        content: {
            paragraphs: [
                'This volume contains the collected works, experiences, and aspirations of a creative developer — a maker who bridges the gap between logic and artistry.',
                'Handle with curiosity.',
            ],
        },
    },
    // Page 1 - Profile
    {
        id: 1,
        type: 'profile',
        title: 'Ritesh Kumar Lenka',
        content: {
            name: 'Ritesh Kumar Lenka',
            role: 'Machine Learning Engineer & Creative Developer',
            location: 'India',
            timeline: '2005 – Present',
            profileImage: '/MyPhoto.png',
            paragraphs: [
                'Machine Learning Engineer and Data Science enthusiast building intelligent systems that merge logic with creativity.',
                'I design experiences that think, adapt, and evolve.',
            ],
        },
    },
    // Page 2 - About
    {
        id: 2,
        type: 'about',
        title: 'About',
        subtitle: 'The Story So Far',
        content: {
            paragraphs: [
                'From the earliest days of tinkering with code, I\'ve been drawn to the intersection of technology and human experience. Every project is a narrative — a story told through algorithms, interfaces, and interactions.',
                'My journey spans from building neural networks that understand human emotion to crafting portfolio experiences that feel like museum installations.',
                'I believe the best technology disappears into the experience, leaving only wonder.',
            ],
        },
    },
    // Page 3 - Contributions
    {
        id: 3,
        type: 'contributions',
        title: 'Contributions',
        subtitle: 'Key Works & Impact',
        content: {
            items: [
                {
                    title: 'Holistic Interview Intelligence',
                    description: 'An AI-powered platform providing real-time behavioral analysis, gaze tracking, and speech pattern evaluation for interview preparation.',
                },
                {
                    title: 'Archive of the Ancients',
                    description: 'A premium portfolio experience blending museum-grade aesthetics with cutting-edge web technology — the very site you\'re exploring.',
                },
                {
                    title: 'Neural Emotion Engine',
                    description: 'Deep learning system for real-time micro-expression detection and emotional state classification.',
                },
                {
                    title: 'TaskManager',
                    description: 'A modern productivity platform combining smart task management, note-taking, and secure cloud synchronization.',
                },
                {
                    title: 'Data Science Research',
                    description: 'Published research on intelligent systems that adapt to user behavior and contextual understanding.',
                },
            ],
        },
    },
    // Page 4 - Skills
    {
        id: 4,
        type: 'skills',
        title: 'Expertise',
        subtitle: 'Technical Arsenal',
        content: {
            skills: [
                {
                    category: 'Machine Learning',
                    items: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'MediaPipe', 'OpenCV'],
                },
                {
                    category: 'Web Development',
                    items: ['React', 'TypeScript', 'Three.js', 'Node.js', 'Tailwind CSS'],
                },
                {
                    category: 'Data Science',
                    items: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter'],
                },
                {
                    category: 'Design & Creative',
                    items: ['UI/UX Design', 'Motion Graphics', 'Figma', 'Blender'],
                },
            ],
        },
    },
    // Page 5 - Recognitions
    {
        id: 5,
        type: 'recognitions',
        title: 'Recognitions',
        subtitle: 'Milestones & Achievements',
        content: {
            items: [
                {
                    title: 'Academic Excellence',
                    description: 'Consistently recognized for merging technical depth with creative vision in academic projects.',
                },
                {
                    title: 'Open Source Contributor',
                    description: 'Active contributor to the open-source community, sharing tools and insights that empower fellow developers.',
                },
                {
                    title: 'Innovation Award',
                    description: 'Recognized for developing novel AI-driven solutions that push the boundaries of human-computer interaction.',
                },
            ],
        },
    },
    // Page 6 - Quote / Closing
    {
        id: 6,
        type: 'quote',
        title: 'A Final Thought',
        content: {
            quote: '"The best code is invisible. The best design is inevitable. The best experience is unforgettable."',
            quoteAuthor: '— Ritesh Kumar Lenka',
            paragraphs: [
                'Thank you for turning these pages. Every interaction is a conversation, and I\'m glad we shared this one.',
            ],
        },
    },
];
