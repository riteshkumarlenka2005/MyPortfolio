import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// DATA LAYER — 17 Nodes, 3 Rings, Real Brand Logos
// ═══════════════════════════════════════════════════════════════════════════════

interface HexResource {
    title: string;
    description: string;
    type: 'PDF' | 'GitHub' | 'Roadmap' | 'Notes' | 'Course' | 'Book';
    link?: string;
}

interface HexNode {
    id: string;
    label: string;
    q: number; // axial col
    r: number; // axial row
    accent: string;
    svgPath: string; // High fidelity brand path
    viewBox?: string; // Optional custom viewbox
    resources: HexResource[];
}

const HEX_NODES: HexNode[] = [
    // ─── CENTER: Knowledge Core ───
    {
        id: 'core', label: 'Knowledge Core', q: 0, r: 0,
        accent: '#6B7280',
        // Abstract Nucleus — concentric orbits with a radiant center
        svgPath: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 3a7 7 0 110 14 7 7 0 010-14zm0 3a4 4 0 100 8 4 4 0 000-8zm0 2.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z M2.5 12h2M19.5 12h2M12 2.5v2M12 19.5v2 M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41',
        resources: [
            { title: 'Full Stack Roadmap', description: 'Comprehensive learning path covering frontend, backend, databases, DevOps, and system design.', type: 'Roadmap' },
            { title: 'Personal Knowledge Base', description: 'Unified collection of notes, insights, and curated references across all domains.', type: 'Notes' },
        ],
    },
    // ─── RING 1 ───
    {
        id: 'python', label: 'Python', q: 0, r: -1,
        accent: '#3776AB',
        svgPath: 'M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.96 3.403 5.96h2.03v-2.867s-.109-3.42 3.35-3.42h5.766s3.24.052 3.24-3.148V3.202S18.28 0 11.914 0zM8.708 1.85a1.06 1.06 0 110 2.12 1.06 1.06 0 010-2.12z M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.123s3.9.445 3.9-5.735c0-6.18-3.403-5.96-3.403-5.96h-2.03v2.867s.109 3.42-3.35 3.42H9.453s-3.24-.052-3.24 3.148v5.292S5.72 24 12.086 24zm3.206-1.85a1.06 1.06 0 110-2.12 1.06 1.06 0 010 2.12z',
        resources: [
            { title: 'Python Official Docs', description: 'Complete reference for the Python language and standard library.', type: 'Notes' },
            { title: 'Automate the Boring Stuff', description: 'Practical programming for total beginners — files, web scraping, Excel.', type: 'Book' },
            { title: 'Python DSA Notebook', description: 'Jupyter notebooks covering sorting, graphs, and dynamic programming in Python.', type: 'GitHub' },
        ],
    },
    {
        id: 'java', label: 'Java', q: 1, r: -1,
        accent: '#ED8B00',
        svgPath: 'M8.851 18.56s-.917.534.653.714c1.902.218 2.874.187 4.969-.211 0 0 .552.346 1.321.646-4.699 2.013-10.633-.118-6.943-1.149M8.276 15.933s-1.028.762.542.924c2.032.209 3.636.227 6.413-.308 0 0 .384.389.987.602-5.679 1.661-12.007.13-7.942-1.218M13.116 11.475c1.157 1.333-.304 2.533-.304 2.533s2.939-1.518 1.589-3.418c-1.261-1.772-2.228-2.652 3.007-5.688 0 0-8.216 2.051-4.292 6.573M19.33 20.504s.679.559-.747.991c-2.712.822-11.288 1.069-13.669.033-.856-.373.75-.89 1.254-.998.527-.114.828-.093.828-.093-.953-.671-6.156 1.317-2.643 1.887 9.58 1.553 17.462-.7 14.977-1.82M9.292 13.21s-4.362 1.036-1.544 1.412c1.189.159 3.561.123 5.77-.062 1.806-.152 3.618-.477 3.618-.477s-.637.272-1.098.585c-4.432 1.165-12.986.623-10.522-.568 2.082-1.006 3.776-.89 3.776-.89M17.116 17.584c4.503-2.34 2.421-4.589.968-4.285-.356.074-.515.138-.515.138s.132-.207.385-.297c2.875-1.011 5.086 2.981-.928 4.562 0 0 .07-.062.09-.118M14.401 0s2.494 2.494-2.365 6.33c-3.896 3.077-.889 4.832 0 6.836-2.274-2.053-3.943-3.858-2.824-5.539 1.644-2.469 6.197-3.665 5.189-7.627',
        resources: [
            { title: 'Effective Java', description: 'Best practices and design patterns for professional Java development.', type: 'Book' },
            { title: 'Java Collections Deep Dive', description: 'Internal workings of HashMap, TreeMap, ConcurrentHashMap, and more.', type: 'Notes' },
        ],
    },
    {
        id: 'c-lang', label: 'C Language', q: 1, r: 0,
        accent: '#00599C',
        svgPath: 'M16.5 9.4l4.5-2.6C19.3 3.2 15.9 1 12 1 5.9 1 1 5.9 1 12s4.9 11 11 11c3.9 0 7.3-2.2 9-5.4l-4.5-2.6c-.9 1.7-2.6 2.8-4.5 2.8-2.9 0-5.2-2.3-5.2-5.2S9.1 7.4 12 7.4c1.9 0 3.6 1 4.5 2z',
        resources: [
            { title: 'K&R C', description: 'The C Programming Language — the definitive reference by Kernighan & Ritchie.', type: 'Book' },
            { title: 'C Memory Model', description: 'Notes on stack, heap, pointers, and manual memory management patterns.', type: 'Notes' },
        ],
    },
    {
        id: 'javascript', label: 'JavaScript', q: 0, r: 1,
        accent: '#F7DF1E',
        svgPath: 'M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.405-.585-.585-.765-.63-.63-1.47-.945-2.83-.945l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.275-.81 3.51.6 4.44 1.395.93 3.435 1.14 3.69 2.01.255 1.05-.78 1.38-1.755 1.26-.72-.165-1.11-.585-1.545-1.35l-1.83 1.05c.21.48.45.69.81 1.11C17.154 22.17 21.66 22.17 22.034 18.276zM13.755 12.075h-2.25v6.15c0 1.275.06 2.46-.135 2.82-.315.69-1.11.6-1.47.48-.375-.195-.555-.45-.78-.84L7.29 21.81c.39.78.93 1.38 1.695 1.77.555.285 1.32.42 2.1.33 1.29-.165 2.13-.96 2.55-2.04.29-.735.21-1.635.21-2.64l.03-7.155z',
        resources: [
            { title: 'You Don\'t Know JS', description: 'Deep dive book series covering scopes, closures, prototypes, and async.', type: 'Book' },
            { title: 'MDN Web Docs', description: 'The definitive web reference for JS APIs, DOM, and browser features.', type: 'Notes' },
            { title: 'ES6+ Cheatsheet', description: 'Quick reference for destructuring, spread, promises, generators, and modules.', type: 'PDF' },
        ],
    },

    // ─── RING 2 ───
    {
        id: 'react', label: 'React', q: -1, r: 1,
        accent: '#61DAFB',
        svgPath: 'M14.23 12.004a2.236 2.236 0 01-2.235 2.236 2.236 2.236 0 01-2.236-2.236 2.236 2.236 0 012.235-2.236 2.236 2.236 0 012.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.31 0-.592.068-.838.182l-.012.007a1.85 1.85 0 00-1 1.657v.003c0 1.472 1.168 3.546 3.164 5.66a25.2 25.2 0 00-.706.875c-2.63.066-4.4.774-5.12 2.014a1.867 1.867 0 00-.052 1.884h.001c.738 1.274 2.576 1.86 5.02 1.86.668 0 1.39-.056 2.154-.166.38.525.772 1.03 1.175 1.507-1.12 1.794-1.596 3.396-1.204 4.508.172.49.522.864.99 1.082.243.113.527.18.84.18 1.346 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.31 0 .592-.068.838-.182.467-.218.816-.592.99-1.08.392-1.113-.085-2.716-1.205-4.51.403-.476.794-.98 1.175-1.507.763.11 1.486.167 2.154.167 2.444 0 4.282-.587 5.02-1.86a1.867 1.867 0 00-.052-1.884c-.72-1.24-2.49-1.95-5.12-2.015a25.2 25.2 0 00-.706-.875c1.996-2.114 3.164-4.188 3.164-5.66 0-.68-.348-1.276-.998-1.66l-.012-.006a1.708 1.708 0 00-.84-.183z',
        resources: [
            { title: 'React Documentation', description: 'Official docs covering hooks, components, and the new React paradigm.', type: 'Notes' },
            { title: 'React Patterns Repo', description: 'Collection of advanced patterns: compound components, render props, HOCs.', type: 'GitHub' },
        ]
    },
    {
        id: 'html', label: 'HTML', q: -1, r: 0,
        accent: '#E34F26',
        svgPath: 'M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.076-.757.076-.757H6.278l.684 8.035h7.94l-.378 4.07-2.548.845-2.547-.773-.164-1.851H7.5l.32 3.59L12 21.35l4.18-1.384.838-8.478H8.607z',
        resources: [
            { title: 'HTML Living Standard', description: 'The WHATWG specification — the single source of truth for HTML.', type: 'Notes' },
            { title: 'Semantic HTML Guide', description: 'Best practices for accessibility, SEO, and meaningful markup structure.', type: 'Roadmap' },
        ]
    },
    {
        id: 'typescript', label: 'TypeScript', q: -1, r: -1,
        accent: '#3178C6',
        svgPath: 'M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 011.306.34v2.458a3.95 3.95 0 00-.643-.361 5.093 5.093 0 00-.717-.26 5.453 5.453 0 00-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 00-.623.242c-.17.104-.3.229-.393.374a.888.888 0 00-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 01-1.012 1.085 4.38 4.38 0 01-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 01-1.84-.164 5.544 5.544 0 01-1.512-.493v-2.63a5.033 5.033 0 003.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 00-.074-1.089 2.12 2.12 0 00-.537-.5 5.597 5.597 0 00-.807-.444 27.72 27.72 0 00-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 011.47-.629 7.536 7.536 0 011.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z',
        resources: [
            { title: 'TypeScript Handbook', description: 'Official handbook covering types, generics, utility types, and declaration files.', type: 'Notes' },
            { title: 'Type Challenges', description: 'Interactive repo of increasingly difficult type-level puzzles.', type: 'GitHub' },
        ]
    },
    {
        id: 'nodejs', label: 'Node.js', q: 0, r: -2,
        accent: '#339933',
        svgPath: 'M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.604.065-.037.15-.023.218.017l2.256 1.339a.31.31 0 00.295 0l8.795-5.076a.3.3 0 00.149-.26V6.973a.304.304 0 00-.15-.262l-8.793-5.072a.3.3 0 00-.293 0L3.07 6.71a.306.306 0 00-.152.262v10.15c0 .108.057.209.15.262l2.41 1.392c1.307.654 2.108-.116 2.108-.89V7.872c0-.154.123-.28.28-.28h1.22c.154 0 .279.126.279.28v10.012c0 1.747-.95 2.748-2.608 2.748-.51 0-.911 0-2.031-.552l-2.31-1.33A1.85 1.85 0 011.5 17.123V6.973c0-.654.35-1.263.922-1.588l8.795-5.08a1.921 1.921 0 011.846 0l8.794 5.08c.572.325.923.934.923 1.588v10.15c0 .654-.351 1.262-.923 1.588l-8.795 5.076c-.28.163-.6.247-.92.247l-.144-.034z',
        resources: [
            { title: 'Node.js Best Practices', description: 'Production-grade patterns for error handling, security, and performance.', type: 'GitHub' },
            { title: 'Event Loop Explained', description: 'Deep understanding of the Node.js event loop, phases, and microtasks.', type: 'Notes' },
        ]
    },
    {
        id: 'ml', label: 'Machine Learning', q: 1, r: -2,
        accent: '#FF6F00',
        svgPath: 'M4 4a2 2 0 100 4 2 2 0 000-4zm0 12a2 2 0 100 4 2 2 0 000-4zm8-4a2 2 0 100 4 2 2 0 000-4zm8-8a2 2 0 100 4 2 2 0 000-4zm0 12a2 2 0 100 4 2 2 0 000-4zM12 2a2 2 0 100 4 2 2 0 000-4zm0 16a2 2 0 100 4 2 2 0 000-4z M6 5.5l4.5 3M6 18.5l4.5-3M13.5 5.5L18 8.5M13.5 18.5L18 15.5M6 6l4.5 7M6 18l4.5-5M13.5 13l4.5-4.5M13.5 13l4.5 4.5',
        resources: [
            { title: 'Andrew Ng ML Course', description: 'Stanford Machine Learning course — regression, neural nets, SVMs.', type: 'Course' },
            { title: 'Scikit-learn Cookbook', description: 'Practical recipes for classification, clustering, and pipeline building.', type: 'Notes' },
        ]
    },
    {
        id: 'datascience', label: 'Data Science', q: 2, r: -2,
        accent: '#1E88E5',
        svgPath: 'M5 3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5zm2 14v-5h2v5H7zm4 0V8h2v9h-2zm4 0v-3h2v3h-2zM4 7l4 3 4-4 4 3 4-2',
        resources: [
            { title: 'Pandas & NumPy Cheatsheet', description: 'Quick reference for data manipulation, aggregation, and vectorized operations.', type: 'PDF' },
            { title: 'Kaggle Notebooks', description: 'Curated collection of EDA, feature engineering, and model building notebooks.', type: 'GitHub' },
        ]
    },

    // ─── RING 3 ───
    {
        id: 'dsa', label: 'DSA', q: 2, r: -1, accent: '#7B1FA2',
        svgPath: 'M12 2a2 2 0 100 4 2 2 0 000-4zM6 10a2 2 0 100 4 2 2 0 000-4zm12 0a2 2 0 100 4 2 2 0 000-4zM3 18a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4zm6 0a2 2 0 100 4 2 2 0 000-4zM12 6v2l-6 4M12 6v2l6 4M6 14l-3 6M6 14l3 6M18 14l-3 6M18 14l3 6',
        resources: [
            { title: 'Striver DSA Sheet', description: '180+ curated problems covering arrays, trees, graphs, and DP.', type: 'Roadmap' },
            { title: 'Visualgo', description: 'Interactive visualizations for sorting, graph traversal, and more.', type: 'Course' },
            { title: 'Competitive Programming Handbook', description: 'Covers algorithms from basics to advanced competitive techniques.', type: 'Book' },
        ]
    },
    {
        id: 'dbms', label: 'DBMS', q: 2, r: 0, accent: '#00838F',
        svgPath: 'M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm6 14c0 .5-2.13 2-6 2s-6-1.5-6-2v-2.23c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V17zm0-5c0 .5-2.13 2-6 2s-6-1.5-6-2V9.77c1.61.78 3.72 1.23 6 1.23s4.39-.45 6-1.23V12zm-6-3c-3.87 0-6-1.5-6-2s2.13-2 6-2 6 1.5 6 2-2.13 2-6 2z',
        resources: [
            { title: 'Database System Concepts', description: 'Comprehensive textbook covering relational algebra, SQL, transactions, and indexing.', type: 'Book' },
            { title: 'SQL Practice Problems', description: '57 progressive SQL challenges from beginner to advanced.', type: 'Notes' },
        ]
    },
    {
        id: 'os', label: 'OS', q: 1, r: 1, accent: '#37474F',
        svgPath: 'M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V7h16v12zM7 10l4 3-4 3v-6zm5 5h5v1h-5v-1z',
        resources: [
            { title: 'Operating Systems: Three Easy Pieces', description: 'Free OS textbook covering virtualization, concurrency, and persistence.', type: 'Book' },
            { title: 'Linux Command Line', description: 'Comprehensive guide to terminal commands, scripting, and system administration.', type: 'Notes' },
        ]
    },
    {
        id: 'cn', label: 'Networks', q: 0, r: 2, accent: '#1565C0',
        svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zM4 12h16M12 4c-2.21 3.14-2.21 8.86 0 12M12 4c2.21 3.14 2.21 8.86 0 12M4.93 7.5h14.14M4.93 16.5h14.14',
        resources: [
            { title: 'Computer Networking: Kurose & Ross', description: 'Top-down approach to networking — HTTP, TCP/IP, routing, and security.', type: 'Book' },
            { title: 'OSI & TCP/IP Model Notes', description: 'Layer-by-layer breakdown with protocols, headers, and real-world analogies.', type: 'Notes' },
        ]
    },
    {
        id: 'git', label: 'Git', q: -1, r: 2, accent: '#F05032',
        svgPath: 'M23.546 10.93L13.067.452a1.55 1.55 0 00-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 012.327 2.341l2.66 2.66a1.838 1.838 0 011.391 3.137 1.838 1.838 0 01-3.137-1.391 1.838 1.838 0 01.257-1.382l-2.48-2.48v6.53a1.838 1.838 0 11-1.71.047V9.305a1.838 1.838 0 01-.998-2.413L6.98 4.095.452 10.624a1.55 1.55 0 000 2.188l10.48 10.48a1.55 1.55 0 002.187 0l10.427-10.174a1.55 1.55 0 000-2.188z',
        resources: [
            { title: 'Pro Git Book', description: 'The complete Git book — branching, rebasing, internals, and workflows.', type: 'Book' },
            { title: 'Git Cheat Sheet', description: 'Quick reference for common commands, stashing, cherry-pick, and bisect.', type: 'PDF' },
        ]
    },
    {
        id: 'docker', label: 'Docker', q: -2, r: 1, accent: '#2496ED',
        svgPath: 'M13.983 11.078h2.119a.186.186 0 00.186-.186V9.006a.186.186 0 00-.186-.186h-2.12a.186.186 0 00-.185.186v1.886c0 .103.083.186.186.186zm-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.186h-2.118a.186.186 0 00-.185.186v1.888c0 .103.083.186.185.186zm0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.186h-2.118a.186.186 0 00-.185.186v1.887c0 .103.083.186.185.186zm-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.186H8.1a.186.186 0 00-.185.186v1.887c0 .103.083.186.185.186zm-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.186.186 0 00-.185-.186H5.136a.186.186 0 00-.186.186v1.887c0 .103.083.186.186.186zm5.893 2.715h2.118a.186.186 0 00.186-.186V9.006a.186.186 0 00-.186-.186h-2.118a.186.186 0 00-.185.186v1.886c0 .103.083.186.185.186zm-2.93 0h2.12a.186.186 0 00.184-.186V9.006a.185.185 0 00-.184-.186h-2.12a.186.186 0 00-.184.186v1.886c0 .103.083.186.185.186zm-2.964 0h2.119a.186.186 0 00.185-.186V9.006a.186.186 0 00-.185-.186H5.136a.186.186 0 00-.186.186v1.886c0 .103.083.186.186.186zm-2.92 0h2.12a.186.186 0 00.184-.186V9.006a.186.186 0 00-.184-.186h-2.12a.185.185 0 00-.184.186v1.886c0 .103.082.186.184.186zM23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.227.328c-.287.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 00-.75.748 11.689 11.689 0 00.692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.722 3.1 1.137 5.275 1.137.983 0 1.976-.094 2.963-.283a12.38 12.38 0 002.87-1.001 8.903 8.903 0 002.149-1.635c1.169-.982 1.822-2.306 2.336-3.574.066 0 .131 0 .2.003 1.21 0 1.956-.497 2.373-.895.281-.271.487-.592.605-.934l.079-.222z',
        viewBox: '0 0 24 24',
        resources: [
            { title: 'Docker Official Docs', description: 'Comprehensive guide to images, containers, volumes, and networking.', type: 'Notes' },
            { title: 'Docker Compose Patterns', description: 'Multi-container setups for development, testing, and production environments.', type: 'GitHub' },
        ]
    },
];

const hexToPixel = (q: number, r: number, size: number) => ({
    x: size * Math.sqrt(3) * (q + r / 2),
    y: size * 3 / 2 * r,
});

const HEX_CLIP = 'polygon(50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%)';

// Resource type badge colors
const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    PDF: { bg: 'rgba(220, 38, 38, 0.08)', text: '#dc2626', border: 'rgba(220, 38, 38, 0.2)' },
    GitHub: { bg: 'rgba(31, 41, 55, 0.08)', text: '#1f2937', border: 'rgba(31, 41, 55, 0.2)' },
    Roadmap: { bg: 'rgba(168, 85, 247, 0.08)', text: '#a855f7', border: 'rgba(168, 85, 247, 0.2)' },
    Notes: { bg: 'rgba(59, 130, 246, 0.08)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' },
    Course: { bg: 'rgba(34, 197, 94, 0.08)', text: '#22c55e', border: 'rgba(34, 197, 94, 0.2)' },
    Book: { bg: 'rgba(234, 179, 8, 0.08)', text: '#ca8a04', border: 'rgba(234, 179, 8, 0.2)' },
};

// Type icons (small SVG paths)
const TYPE_ICONS: Record<string, string> = {
    PDF: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5z',
    GitHub: 'M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .1-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016.02 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12.01 12.01 0 0024 12c0-6.63-5.37-12-12-12z',
    Roadmap: 'M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z',
    Notes: 'M3 18h12v-2H3v2zM3 6v2h18V6H3zm0 7h18v-2H3v2z',
    Course: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
    Book: 'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
};

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLE HEX — REAL LOGO (NO TEXT)
// ═══════════════════════════════════════════════════════════════════════════════

interface SingleHexProps {
    node: HexNode;
    size: number;
    isActive: boolean;
    onClick: () => void;
    cx: number;
    cy: number;
    entranceDelay: number;
    visible: boolean;
}

const SingleHex: React.FC<SingleHexProps> = React.memo(({
    node, size, isActive, onClick, cx, cy, entranceDelay, visible,
}) => {
    const logoRef = useRef<HTMLDivElement>(null);
    const [entered, setEntered] = useState(false);
    const hexW = Math.sqrt(3) * size;
    const hexH = 2 * size;

    useEffect(() => {
        if (visible) setTimeout(() => setEntered(true), entranceDelay);
    }, [entranceDelay, visible]);

    // Wandering Physics — Fast, bounded inside hex
    useEffect(() => {
        if (!logoRef.current) return;

        let x = 0;
        let y = 0;
        // Fast initial velocity
        let vx = (Math.random() - 0.5) * 1.2;
        let vy = (Math.random() - 0.5) * 1.2;
        // Hard boundary = inscribed circle radius minus logo half-size (~20px)
        const maxRadius = size * 0.35;
        let raf: number;

        const animate = () => {
            // Strong random jitter for lively movement
            vx += (Math.random() - 0.5) * 0.08;
            vy += (Math.random() - 0.5) * 0.08;
            // Minimal damping — keep momentum
            vx *= 0.992;
            vy *= 0.992;
            x += vx;
            y += vy;

            // Hard boundary clamp — logo never escapes hex
            const dist = Math.sqrt(x * x + y * y);
            if (dist > maxRadius) {
                // Reflect velocity and clamp position
                const angle = Math.atan2(y, x);
                const nx = Math.cos(angle);
                const ny = Math.sin(angle);
                // Clamp position to boundary
                x = nx * maxRadius;
                y = ny * maxRadius;
                // Reflect velocity component along normal
                const dot = vx * nx + vy * ny;
                vx -= 2 * dot * nx * 0.5; // partial reflection for organic feel
                vy -= 2 * dot * ny * 0.5;
                // Add random bounce
                vx += (Math.random() - 0.5) * 0.3;
                vy += (Math.random() - 0.5) * 0.3;
            }

            const rot = x * 1.5;
            if (logoRef.current) {
                logoRef.current.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
            }
            raf = requestAnimationFrame(animate);
        };
        raf = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(raf);
    }, [size]);

    return (
        <div
            className="absolute cursor-pointer group transition-transform duration-500 ease-out"
            style={{
                width: hexW,
                height: hexH,
                left: cx - hexW / 2,
                top: cy - hexH / 2,
                opacity: entered ? 1 : 0,
                transform: `scale(${entered ? 1 : 0.8})`,
                zIndex: isActive ? 50 : 10,
            }}
            onClick={onClick}
        >
            {/* 1. SOLID HEX CONTAINER */}
            <div
                className="absolute inset-0 transition-all duration-500"
                style={{ clipPath: HEX_CLIP }}
            >
                <div
                    className="absolute inset-0 glass-card dark:!bg-gradient-to-br dark:from-[#1c1917] dark:to-[#292524] transition-colors duration-500 group-hover:from-gray-50 group-hover:to-gray-100 dark:group-hover:from-[#2a2624] dark:group-hover:to-[#363230]"
                />
                <div className="absolute inset-0 shadow-[inset_0_4px_8px_rgba(0,0,0,0.15)] pointer-events-none" />
            </div>

            {/* 2. BORDER OVERLAY */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-500 group-hover:-translate-y-1"
                viewBox="0 0 100 116" preserveAspectRatio="none"
            >
                <path
                    d="M50 0.5 L93.3 25.5 L93.3 75.5 L50 100.5 L6.7 75.5 L6.7 25.5 Z"
                    fill="none"
                    stroke={isActive ? node.accent : "rgba(160, 160, 160, 0.4)"}
                    strokeWidth={isActive ? 1.5 : 1}
                    vectorEffect="non-scaling-stroke"
                    className="transition-all duration-500 group-hover:stroke-[rgba(160,160,160,0.9)]"
                />
            </svg>

            {/* 3. FREE FLOATING LOGO (No Text) — size unchanged */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-500 group-hover:-translate-y-1 group-hover:scale-110"
            >
                <div ref={logoRef} className="will-change-transform flex items-center justify-center">
                    <svg
                        viewBox={node.viewBox || "0 0 24 24"}
                        className="w-8 h-8 md:w-10 md:h-10 transition-all duration-500"
                        style={{ fill: isActive ? '#fff' : node.accent }}
                    >
                        <path
                            d={node.svgPath}
                            className="transition-all duration-500 opacity-90 group-hover:opacity-100 group-hover:drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                        />
                    </svg>
                </div>
            </div>

            {/* 4. ACTIVE PULSE (Core Only) */}
            {node.id === 'core' && (
                <div
                    className="absolute inset-0 hex-subtle-pulse pointer-events-none"
                    style={{ clipPath: HEX_CLIP, border: '1px solid rgba(160,160,160,0.15)' }}
                />
            )}
        </div>
    );
});

// ═══════════════════════════════════════════════════════════════════════════════
// CONTENT PANEL — Production-Level Resource Drawer
// ═══════════════════════════════════════════════════════════════════════════════

const ContentPanel: React.FC<{ node: HexNode | null; onClose: () => void }> = ({ node, onClose }) => {
    const [visible, setVisible] = useState(false);
    const [cardVisible, setCardVisible] = useState<boolean[]>([]);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (node) {
            setVisible(true);
            setCardVisible([]);
            // Stagger card reveals
            node.resources.forEach((_, i) => {
                setTimeout(() => {
                    setCardVisible(prev => {
                        const next = [...prev];
                        next[i] = true;
                        return next;
                    });
                }, 150 + i * 100);
            });
            // Smooth scroll to panel
            setTimeout(() => {
                panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 200);
        } else {
            setVisible(false);
            setCardVisible([]);
        }
    }, [node]);

    if (!node) return null;

    const hasResources = node.resources.length > 0;

    return (
        <div
            ref={panelRef}
            className={`
                w-full max-w-5xl mx-auto mt-16
                transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
        >
            {/* ── HEADER ── */}
            <div
                className="relative overflow-hidden rounded-t-2xl p-6 md:p-8"
                style={{
                    background: `linear-gradient(135deg, ${node.accent}18, ${node.accent}08, transparent)`,
                    borderTop: `2px solid ${node.accent}40`,
                    borderLeft: `1px solid ${node.accent}20`,
                    borderRight: `1px solid ${node.accent}20`,
                }}
            >
                {/* Background glow */}
                <div
                    className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
                    style={{ background: node.accent }}
                />

                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-5">
                        {/* Logo badge */}
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, ${node.accent}20, ${node.accent}10)`,
                                border: `1.5px solid ${node.accent}30`,
                            }}
                        >
                            <svg
                                viewBox={node.viewBox || "0 0 24 24"}
                                className="w-7 h-7"
                                style={{ fill: node.accent }}
                            >
                                <path d={node.svgPath} />
                            </svg>
                        </div>

                        <div>
                            <h3
                                className="font-display text-2xl md:text-3xl font-bold tracking-wide uppercase"
                                style={{ color: node.accent }}
                            >
                                {node.label}
                            </h3>
                            <p className="font-serif italic text-stone-500 dark:text-stone-400 text-sm mt-0.5">
                                {hasResources ? `${node.resources.length} Archived Resource${node.resources.length > 1 ? 's' : ''}` : 'Archive Vault'}
                            </p>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="group/close relative px-5 py-2.5 rounded-lg border border-stone-300 dark:border-stone-600 hover:border-red-400/50 dark:hover:border-red-500/50 active:scale-95 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-red-500/0 group-hover/close:bg-red-500/5 transition-colors duration-300" />
                        <span className="relative flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-stone-600 dark:text-stone-400 group-hover/close:text-red-500 transition-colors">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                            Close
                        </span>
                    </button>
                </div>

                {/* Decorative line */}
                <div
                    className="mt-6 h-px w-full"
                    style={{
                        background: `linear-gradient(90deg, ${node.accent}40, ${node.accent}10, transparent)`,
                    }}
                />
            </div>

            {/* ── RESOURCES GRID ── */}
            <div
                className="rounded-b-2xl p-6 md:p-8 glass-card glass-shimmer dark:!bg-transparent"
                style={{
                    borderBottom: '1px solid rgba(255,255,255,0.3)',
                    borderLeft: '1px solid rgba(255,255,255,0.2)',
                    borderRight: '1px solid rgba(255,255,255,0.2)',
                }}
            >
                {hasResources ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {node.resources.map((res, i) => {
                            const typeStyle = TYPE_COLORS[res.type] || TYPE_COLORS.Notes;
                            const typeIcon = TYPE_ICONS[res.type] || TYPE_ICONS.Notes;

                            return (
                                <a
                                    key={i}
                                    href={res.link || '#'}
                                    className={`
                                        group/card relative block rounded-xl overflow-hidden
                                        bg-white/70 dark:bg-stone-800/50
                                        border border-stone-200/80 dark:border-stone-700/60
                                        hover:border-[${node.accent}] hover:shadow-lg
                                        active:scale-[0.98]
                                        transition-all duration-500 ease-out
                                        ${cardVisible[i] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                                    `}
                                    style={{
                                        transitionDelay: `${i * 60}ms`,
                                    }}
                                >
                                    {/* Top accent bar */}
                                    <div
                                        className="h-1 w-full transition-all duration-500 group-hover/card:h-1.5"
                                        style={{
                                            background: `linear-gradient(90deg, ${node.accent}, ${node.accent}60)`,
                                        }}
                                    />

                                    <div className="p-5">
                                        {/* Type badge */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <span
                                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider"
                                                style={{
                                                    background: typeStyle.bg,
                                                    color: typeStyle.text,
                                                    border: `1px solid ${typeStyle.border}`,
                                                }}
                                            >
                                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d={typeIcon} />
                                                </svg>
                                                {res.type}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h4 className="font-display text-base font-bold text-stone-800 dark:text-stone-200 mb-2 leading-snug group-hover/card:text-gray-900 dark:group-hover/card:text-amber-400 transition-colors duration-300">
                                            {res.title}
                                        </h4>

                                        {/* Description */}
                                        <p className="text-sm text-stone-500 dark:text-stone-400 font-serif leading-relaxed line-clamp-2">
                                            {res.description}
                                        </p>

                                        {/* Arrow indicator */}
                                        <div className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-0 group-hover/card:opacity-100 transition-all duration-300 translate-x-0 group-hover/card:translate-x-1"
                                            style={{ color: node.accent }}
                                        >
                                            Explore
                                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty state */
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                            style={{
                                background: `linear-gradient(135deg, ${node.accent}15, ${node.accent}05)`,
                                border: `1.5px dashed ${node.accent}30`,
                            }}
                        >
                            <svg className="w-7 h-7 opacity-40" viewBox="0 0 24 24" fill="none" stroke={node.accent} strokeWidth="1.5">
                                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <p className="font-display text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">
                            Archive Empty
                        </p>
                        <p className="font-serif italic text-stone-400 dark:text-stone-500 text-xs">
                            Resources for {node.label} will be catalogued here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface HexKnowledgeClusterProps {
    visible: boolean;
}

export const HexKnowledgeCluster: React.FC<HexKnowledgeClusterProps> = ({ visible }) => {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [hexSize, setHexSize] = useState(55);

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            // Bigger hex sizes: mobile 44, tablet 54, desktop 64
            setHexSize(w < 640 ? 44 : w < 1024 ? 54 : 64);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { positions, width, height } = useMemo(() => {
        const posMap = new Map<string, { cx: number; cy: number }>();
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

        HEX_NODES.forEach(node => {
            const { x, y } = hexToPixel(node.q, node.r, hexSize);
            posMap.set(node.id, { cx: x, cy: y });
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        });

        const w = maxX - minX + hexSize * 2;
        const h = maxY - minY + hexSize * 2;
        const xOffset = -minX + hexSize;
        const yOffset = -minY + hexSize;

        const shiftedMap = new Map<string, { cx: number; cy: number }>();
        posMap.forEach((p, id) => {
            shiftedMap.set(id, { cx: p.cx + xOffset, cy: p.cy + yOffset });
        });

        return { positions: shiftedMap, width: w, height: h };
    }, [hexSize]);

    const activeNode = HEX_NODES.find(n => n.id === activeId) || null;

    const handleHexClick = useCallback((id: string) => {
        setActiveId(prev => prev === id ? null : id);
    }, []);

    return (
        <div className={`relative isolate flex flex-col items-center transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="mt-4 md:mt-6 relative" style={{ width, height }}>
                {HEX_NODES.map((node, i) => {
                    const pos = positions.get(node.id)!;
                    return (
                        <SingleHex
                            key={node.id}
                            node={node}
                            size={hexSize}
                            isActive={activeId === node.id}
                            cx={pos.cx}
                            cy={pos.cy}
                            onClick={() => handleHexClick(node.id)}
                            entranceDelay={i * 60}
                            visible={visible}
                        />
                    );
                })}
            </div>
            <ContentPanel node={activeNode} onClose={() => setActiveId(null)} />
        </div>
    );
};
