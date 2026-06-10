import React, { useEffect, useState, useRef } from 'react';
import { ScrollNavbar } from '../components/ScrollNavbar';
import { HeritageFrame } from '../components/HeritageFrame';
import { HexKnowledgeCluster } from '../components/HexKnowledgeCluster';
import { TechArsenalGrid } from '../components/TechArsenalGrid';


// Dummy data for resources Types ───────────────────────────────────────────────────────────

interface Resource {
    id: string;
    title: string;
    description: string;
    category: ResourceCategory;
    type: string;
    dateAdded: string;
    size?: string;
    tags: string[];
    link?: string;
}

type ResourceCategory = 'documents' | 'research' | 'books' | 'presentations' | 'content';

// ─── Category Metadata ────────────────────────────────────────────────────────

const CATEGORY_META: Record<ResourceCategory, { label: string; icon: string; description: string; accent: string }> = {
    documents: {
        label: 'My Tech Notes',
        icon: '📜',
        description: 'Personal study notes, implementation guides, and conceptual breakdowns',
        accent: 'from-amber-600/20 to-amber-800/5',
    },
    research: {
        label: 'Academic Research',
        icon: '🔬',
        description: 'Readings, summaries, and my own research papers',
        accent: 'from-emerald-600/20 to-emerald-800/5',
    },
    books: {
        label: 'Essential References',
        icon: '📚',
        description: 'Core textbooks and foundational literature I refer to often',
        accent: 'from-indigo-600/20 to-indigo-800/5',
    },
    presentations: {
        label: 'Tech Talks & Slides',
        icon: '🎯',
        description: 'Presentation decks from seminars and project demos',
        accent: 'from-rose-600/20 to-rose-800/5',
    },
    content: {
        label: 'Learning Path',
        icon: '✦',
        description: 'Curated blogs, roadmaps, and interesting technical articles',
        accent: 'from-violet-600/20 to-violet-800/5',
    },
};

// ─── Sample Resources Data ────────────────────────────────────────────────────

const RESOURCES: Resource[] = [
    {
        id: 'res-001',
        title: 'Machine Learning Study Guide',
        description: 'Personal study notes on deep learning foundations, covering backpropagation, CNNs, and optimization algorithms.',
        category: 'documents',
        type: 'PDF',
        dateAdded: '2026-02-10',
        size: '1.2 MB',
        tags: ['machine-learning', 'study-notes', 'AI'],
    },
    {
        id: 'res-002',
        title: 'Neural Networks & Deep Learning',
        description: 'Research report on implementing transformer-based models for small-scale datasets.',
        category: 'research',
        type: 'PDF',
        dateAdded: '2026-01-28',
        size: '850 KB',
        tags: ['AI', 'deep-learning', 'research'],
    },
    {
        id: 'res-003',
        title: 'Algorithm Design Manual (Condensed)',
        description: 'A summary of core algorithmic patterns and data structure optimizations for competitive programming.',
        category: 'books',
        type: 'EPUB',
        dateAdded: '2026-01-15',
        size: '3.4 MB',
        tags: ['algorithms', 'coding', 'student-guide'],
    },
    {
        id: 'res-004',
        title: 'Full-Stack Project Demo Slides',
        description: 'Presentation slides explaining the architecture of my recent MERN stack application.',
        category: 'presentations',
        type: 'PDF',
        dateAdded: '2026-02-05',
        size: '2.1 MB',
        tags: ['web-dev', 'showcase', 'frontend'],
    },
    {
        id: 'res-005',
        title: 'Python for Data Science Cheat Sheet',
        description: 'Curated list of essential Pandas, NumPy, and Matplotlib functions for rapid data analysis.',
        category: 'content',
        type: 'Markdown',
        dateAdded: '2026-02-08',
        size: '120 KB',
        tags: ['python', 'data-science', 'dev-notes'],
    },
];

// ─── Filter Badge Component ───────────────────────────────────────────────────

const FilterBadge: React.FC<{
    label: string;
    icon: string;
    active: boolean;
    onClick: () => void;
    count: number;
}> = ({ label, icon, active, onClick, count }) => (
    <button
        onClick={onClick}
        className={`
            group relative flex items-center gap-2 px-4 py-2.5 rounded-sm font-serif text-sm tracking-wide
            border transition-all duration-500 cursor-pointer select-none
            ${active
                ? 'bg-amber-700/10 dark:bg-amber-600/10 border-amber-700/40 dark:border-amber-600/30 text-parchment-900 dark:text-antique-900 shadow-sm'
                : 'bg-transparent border-parchment-400/20 dark:border-antique-200/10 text-parchment-900/60 dark:text-antique-800/60 hover:border-amber-700/20 dark:hover:border-amber-600/15'
            }
        `}
    >
        <span className="text-base">{icon}</span>
        <span>{label}</span>
        <span className={`
            ml-1 text-xs px-1.5 py-0.5 rounded-full transition-colors duration-300
            ${active
                ? 'bg-amber-700/20 dark:bg-amber-600/20 text-amber-800 dark:text-amber-500'
                : 'bg-parchment-400/10 dark:bg-antique-200/5 text-parchment-900/40 dark:text-antique-800/40'
            }
        `}>
            {count}
        </span>
    </button>
);

// ─── Resource Card Component ──────────────────────────────────────────────────

const ResourceCard: React.FC<{ resource: Resource; index: number; visible: boolean }> = ({ resource, index, visible }) => {
    const meta = CATEGORY_META[resource.category];

    return (
        <div
            className={`
                group relative overflow-hidden
                border border-parchment-400/20 dark:border-antique-200/10
                hover:border-amber-700/30 dark:hover:border-amber-600/20
                transition-all duration-700 ease-out
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
            `}
            style={{ transitionDelay: `${index * 80}ms` }}
        >
            {/* Category accent gradient bar */}
            <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${meta.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div className="relative p-6">
                {/* Top row: type badge + date */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{meta.icon}</span>
                        <span className="font-mono text-xs tracking-wider uppercase px-2 py-1 border border-parchment-400/20 dark:border-antique-200/10 text-parchment-900/50 dark:text-antique-800/50">
                            {resource.type}
                        </span>
                    </div>
                    <span className="font-serif text-xs italic">
                        {new Date(resource.dateAdded).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-lg md:text-xl font-semibold mb-2 text-parchment-900 dark:text-antique-900 group-hover:text-amber-800 dark:group-hover:text-amber-600 transition-colors duration-500">
                    {resource.title}
                </h3>

                {/* Description */}
                <p className="font-serif text-sm leading-relaxed mb-4 line-clamp-2">
                    {resource.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.map(tag => (
                        <span
                            key={tag}
                            className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 bg-parchment-400/5 dark:bg-antique-200/5 text-parchment-900/40 dark:text-antique-800/40 border border-parchment-400/10 dark:border-antique-200/5"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Bottom: size + action */}
                <div className="flex items-center justify-between pt-3 border-t border-parchment-400/10 dark:border-antique-200/5">
                    {resource.size && (
                        <span className="font-mono text-xs">{resource.size}</span>
                    )}
                    <button className="font-serif text-sm tracking-wide text-amber-700 dark:text-amber-600 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0 flex items-center gap-1.5 cursor-pointer">
                        <span>View</span>
                        <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Stats Counter ────────────────────────────────────────────────────────────

const StatCounter: React.FC<{ value: number; label: string; delay: number; visible: boolean }> = ({ value, label, delay, visible }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!visible) return;
        const timer = setTimeout(() => {
            let current = 0;
            const step = Math.max(1, Math.floor(value / 30));
            const interval = setInterval(() => {
                current += step;
                if (current >= value) {
                    setCount(value);
                    clearInterval(interval);
                } else {
                    setCount(current);
                }
            }, 30);
            return () => clearInterval(interval);
        }, delay);
        return () => clearTimeout(timer);
    }, [visible, value, delay]);

    return (
        <div className="text-center">
            <div className="font-display text-3xl md:text-4xl font-bold text-amber-700 dark:text-amber-600">
                {count}
            </div>
            <div className="font-serif text-sm italic mt-1">{label}</div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ─── RESOURCES PAGE ───────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════

export const ResourcesPage: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [activeFilter, setActiveFilter] = useState<ResourceCategory | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cardsVisible, setCardsVisible] = useState(false);
    const cardsSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const isReturning = sessionStorage.getItem('hasVisited');
        const baseDelay = isReturning ? 300 : 2200;
        const cardsDelay = isReturning ? 600 : 2800;
        sessionStorage.setItem('hasVisited', 'true');
        const timer = setTimeout(() => setVisible(true), baseDelay);
        const cardsTimer = setTimeout(() => setCardsVisible(true), cardsDelay);
        return () => {
            clearTimeout(timer);
            clearTimeout(cardsTimer);
        };
    }, []);

    // Filtered resources
    const filtered = RESOURCES.filter(r => {
        const matchesCategory = activeFilter === 'all' || r.category === activeFilter;
        const matchesSearch = searchQuery === '' ||
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Category counts
    const getCategoryCount = (cat: ResourceCategory) => RESOURCES.filter(r => r.category === cat).length;

    return (
        <div className="min-h-screen bg-parchment-100 dark:bg-antique-50 text-parchment-900 dark:text-antique-800 transition-colors duration-500">
            <HeritageFrame />
            <ScrollNavbar />

            {/* ── Main Content ─────────────────────────────────────────── */}
            <main className={`
                max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-20
                transition-all duration-1000 ease-out
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}>

                {/* Page Header — Split Layout: Text + Hex Cluster */}
                <header className="mb-16 pb-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-16">
                        {/* Left: Heading + Intro */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-4 mb-4 opacity-50">
                                <div className="h-[1px] w-8 bg-current" />
                                <span className="font-serif italic text-sm tracking-widest uppercase">The Knowledge Vault</span>
                            </div>
                            <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-wide text-parchment-900 dark:text-antique-900 mb-4">
                                Resource Archive
                            </h1>
                            <p className="font-serif text-lg md:text-xl leading-relaxed max-w-xl">
                                A curated knowledge network of documents, research papers, books, presentations,
                                and intellectual artifacts. Click any node to explore its resources.
                            </p>

                            {/* Decorative Divider */}
                            <div className="flex items-center gap-4 mt-8 opacity-20">
                                <div className="h-[1px] flex-1 bg-gradient-to-r from-current to-transparent" />
                                <div className="w-1.5 h-1.5 rotate-45 border border-current" />
                            </div>
                        </div>

                        {/* Right: Hex Knowledge Cluster */}
                        <div className="w-full lg:w-auto flex-shrink-0">
                            <HexKnowledgeCluster visible={visible} />
                        </div>
                    </div>
                </header>

                {/* ── Stats Strip ──────────────────────────────────────── */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16 py-8 border-y border-parchment-400/15 dark:border-antique-200/10">
                    <StatCounter value={RESOURCES.length} label="Total Resources" delay={200} visible={visible} />
                    <StatCounter value={getCategoryCount('documents')} label="Documents" delay={400} visible={visible} />
                    <StatCounter value={getCategoryCount('research')} label="Research Papers" delay={600} visible={visible} />
                    <StatCounter value={getCategoryCount('books')} label="Books" delay={800} visible={visible} />
                    <StatCounter value={getCategoryCount('presentations') + getCategoryCount('content')} label="Other Media" delay={1000} visible={visible} />
                </div>

                {/* ── Search Bar ───────────────────────────────────────── */}
                <div className="relative mb-8">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-lg">⌕</div>
                    <input
                        type="text"
                        placeholder="Search the archives..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3.5 pl-12 pr-6 bg-transparent border border-parchment-400/20 dark:border-antique-200/10 font-serif text-base tracking-wide placeholder:italic placeholder: focus:outline-none focus:border-amber-700/30 dark:focus:border-amber-600/20 transition-colors duration-500 text-parchment-900 dark:text-antique-800"
                    />
                </div>

                {/* ── Category Filters ─────────────────────────────────── */}
                <div className="flex flex-wrap gap-3 mb-12">
                    <FilterBadge
                        label="All"
                        icon="◈"
                        active={activeFilter === 'all'}
                        onClick={() => setActiveFilter('all')}
                        count={RESOURCES.length}
                    />
                    {(Object.keys(CATEGORY_META) as ResourceCategory[]).map(cat => (
                        <FilterBadge
                            key={cat}
                            label={CATEGORY_META[cat].label}
                            icon={CATEGORY_META[cat].icon}
                            active={activeFilter === cat}
                            onClick={() => setActiveFilter(cat)}
                            count={getCategoryCount(cat)}
                        />
                    ))}
                </div>

                {/* ── Resource Cards Grid ──────────────────────────────── */}
                <div ref={cardsSectionRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    {filtered.length > 0 ? (
                        filtered.map((resource, index) => (
                            <ResourceCard
                                key={resource.id}
                                resource={resource}
                                index={index}
                                visible={cardsVisible}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 opacity-40">
                            <div className="text-5xl mb-4">📭</div>
                            <p className="font-serif text-lg italic">No resources match your search.</p>
                            <p className="font-serif text-sm mt-2">Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </div>

                {/* ── Decorative Divider ───────────────────────────────── */}
                <div className="flex items-center justify-center gap-6 my-16 opacity-30">
                    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-current" />
                    <div className="w-2 h-2 rotate-45 border border-current" />
                    <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-current" />
                </div>

                {/* ── Upload / Add Resources Section ───────────────────── */}
                <section className="mb-20">
                    <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-4">
                        <span className="text-amber-700/30 dark:text-amber-600/30 text-4xl font-light">+</span>
                        Add to the Archive
                    </h2>
                    <div className="border-2 border-dashed border-parchment-400/20 dark:border-antique-200/10 hover:border-amber-700/25 dark:hover:border-amber-600/15 transition-colors duration-700 p-12 md:p-16 text-center group cursor-pointer">
                        <div className="text-5xl mb-4 opacity-20 group-hover: transition-opacity duration-500">⊕</div>
                        <p className="font-display text-xl mb-2 group-hover: transition-opacity duration-500">
                            Drop files here or click to upload
                        </p>
                        <p className="font-serif text-sm italic">
                            Supports PDF, PPTX, EPUB, DOCX, MD, and more
                        </p>
                    </div>
                </section>

                {/* ── Category Legend ──────────────────────────────────── */}
                <section className="border-t border-parchment-400/30 dark:border-antique-200/20 pt-12 mb-16">
                    <h2 className="font-display text-2xl font-semibold mb-8">Collection Index</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(Object.entries(CATEGORY_META) as [ResourceCategory, typeof CATEGORY_META[ResourceCategory]][]).map(([key, meta]) => (
                            <div
                                key={key}
                                className="flex items-start gap-4 p-5 border border-parchment-400/10 dark:border-antique-200/5 hover:border-amber-700/20 dark:hover:border-amber-600/10 transition-colors duration-500"
                            >
                                <span className="text-2xl flex-shrink-0 mt-0.5">{meta.icon}</span>
                                <div>
                                    <h3 className="font-display text-base font-semibold mb-1">{meta.label}</h3>
                                    <p className="font-serif text-sm leading-relaxed">{meta.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer Spacer */}
                <div className="h-20" />
            </main>
            
            {/* Moved Tech Arsenal Grid */}
            <TechArsenalGrid />

            {/* Subtle Footer Line */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-900/10 to-transparent pointer-events-none" />
        </div>
    );
};
