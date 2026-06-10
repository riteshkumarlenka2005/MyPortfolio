import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { InteractiveHexGrid } from './InteractiveHexGrid';
import { HeroCurves } from './HeroCurves';
// Micro-text content for R stem - intellectual fragments that create texture
const STEM_TEXT_LINES = [
    'const wisdom = experience.distill();',
    'function architect(vision) {',
    '  return craft(precision, purpose);',
    '}',
    '// Where code meets art',
    'interface Legacy extends Craft {',
    '  readonly integrity: boolean;',
    '  readonly passion: number;',
    '}',
    'type Excellence = Attention & Detail;',
    '',
    'class Creator implements Visionary {',
    '  private readonly standards: High;',
    '  private readonly commitment: Unwavering;',
    '}',
    '',
    '/* The pursuit of mastery */',
    'export const PRINCIPLES = {',
    '  precision: "non-negotiable",',
    '  quality: "relentless",',
    '  craft: "intentional"',
    '} as const;',
    '',
    'async function build(dream: Vision) {',
    '  const foundation = await plan(deep);',
    '  const structure = execute(patience);',
    '  return polish(obsessive);',
    '}',
    '',
    '// Digital preservation',
    'interface Archive<T extends Timeless> {',
    '  preserve(artifact: T): Promise<Legacy>;',
    '  restore(memory: Fragment): T;',
    '}',
    '',
    'const PHILOSOPHY = `',
    '  Technology serves humanity.',
    '  Design reveals intention.',
    '  Code expresses thought.',
    '`;',
    '',
    'enum Approach {',
    '  THOUGHTFUL = "first",',
    '  ITERATIVE = "always",',
    '  EXCELLENT = "only"',
    '}',
    '',
    '// Building bridges',
    'function connect(human: Intent, machine: Logic) {',
    '  return harmonize(elegance);',
    '}',
];

// VS Code Dark+ syntax highlighting colors
const VS_COLORS = {
    keyword: '#569CD6',     // blue - const, function, class, etc.
    string: '#CE9178',      // orange - strings
    comment: '#6A9955',     // green - comments
    type: '#4EC9B0',        // teal - types/interfaces
    func: '#DCDCAA',        // yellow - function calls
    number: '#B5CEA8',      // light green - numbers
    property: '#9CDCFE',    // light blue - properties
    punctuation: '#D4D4D4', // gray - brackets, braces
    operator: '#D4D4D4',    // gray - operators
    default: '#D4D4D4',     // gray - default text
};

// Simple tokenizer for VS Code-like syntax highlighting
const highlightLine = (line: string): React.ReactNode[] => {
    if (!line.trim()) return ['\u00A0'];

    const tokens: React.ReactNode[] = [];
    let remaining = line;
    let key = 0;

    const push = (text: string, color: string) => {
        tokens.push(<span key={key++} style={{ color }}>{text}</span>);
    };

    // Full-line comment
    if (remaining.trimStart().startsWith('//') || remaining.trimStart().startsWith('/*')) {
        push(remaining, VS_COLORS.comment);
        return tokens;
    }

    // Template literal content lines (indented text inside backticks)
    if (remaining.trimStart().startsWith('`') && remaining.trimEnd().endsWith('`;')) {
        push(remaining, VS_COLORS.string);
        return tokens;
    }

    // Regex-based tokenizer
    const tokenRegex = /(\s+)|(\/\/.*|\/\*.*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b(?:const|let|var|function|return|class|interface|type|enum|export|import|async|await|extends|implements|private|readonly|public|protected|as|new|this|from)\b)|(\b(?:string|number|boolean|void|null|undefined|any|never|unknown|Promise|High|Unwavering|Vision|Fragment|Timeless|Legacy|Craft|Visionary|Attention|Detail|Excellence|Intent|Logic|T)\b)|(\b\d+(?:\.\d+)?\b)|(\b[a-z]\w*(?=\s*\())|(\b[A-Z]\w*(?=\s*[=<{(]))|([a-zA-Z_]\w*)|([{}()[\]:;,.<>=&|!?+\-*/])/g;

    let match;
    let lastIndex = 0;

    while ((match = tokenRegex.exec(remaining)) !== null) {
        // Fill gap if any
        if (match.index > lastIndex) {
            push(remaining.slice(lastIndex, match.index), VS_COLORS.default);
        }

        const [fullMatch, whitespace, comment, str, keyword, typeName, num, funcCall, upperIdent, ident, punct] = match;

        if (whitespace) push(fullMatch, VS_COLORS.default);
        else if (comment) push(fullMatch, VS_COLORS.comment);
        else if (str) push(fullMatch, VS_COLORS.string);
        else if (keyword) push(fullMatch, VS_COLORS.keyword);
        else if (typeName) push(fullMatch, VS_COLORS.type);
        else if (num) push(fullMatch, VS_COLORS.number);
        else if (funcCall) push(fullMatch, VS_COLORS.func);
        else if (upperIdent) push(fullMatch, VS_COLORS.type);
        else if (ident) push(fullMatch, VS_COLORS.property);
        else if (punct) push(fullMatch, VS_COLORS.punctuation);
        else push(fullMatch, VS_COLORS.default);

        lastIndex = match.index + fullMatch.length;
    }

    if (lastIndex < remaining.length) {
        push(remaining.slice(lastIndex), VS_COLORS.default);
    }

    return tokens;
};

// Rotating tagline phrases
const ROTATING_PHRASES = [
    'Building Intelligent Systems with AI',
    'Engineering Thoughtful Solutions with Code',
    'Exploring the Frontiers of Machine Learning',
    'Developing Scalable Data-Driven Applications',
];

const TYPING_SPEED = 55; // ms per character
const PAUSE_AFTER_TYPED = 1800; // ms to hold the full phrase

export const HeroSection: React.FC = () => {
    // Rotating typing effect state
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [displayedChars, setDisplayedChars] = useState(0);
    const [cursorVisible, setCursorVisible] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);

    // Mouse tracking for top-right corner interactive hex grid
    const heroRef = useRef<HTMLElement>(null);
    const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
    const [heroWidth, setHeroWidth] = useState(0);

    useEffect(() => {
        if (heroRef.current) {
            setHeroWidth(heroRef.current.clientWidth);
        }
        const handleResize = () => {
            if (heroRef.current) {
                setHeroWidth(heroRef.current.clientWidth);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!heroRef.current) return;
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        if (rect.width !== heroWidth) {
            setHeroWidth(rect.width);
        }
    };

    const handleMouseLeave = () => {
        setMousePos(null);
    };

    const currentPhrase = ROTATING_PHRASES[phraseIndex];

    // Typing animation — type forward, pause, fade out, switch phrase
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;

        if (isFadingOut) {
            // After fade-out completes, switch to next phrase
            timeout = setTimeout(() => {
                setPhraseIndex(prev => (prev + 1) % ROTATING_PHRASES.length);
                setDisplayedChars(0);
                setIsFadingOut(false);
            }, 400); // matches the CSS fade-out duration
        } else if (displayedChars < currentPhrase.length) {
            // Still typing
            timeout = setTimeout(() => {
                setDisplayedChars(prev => prev + 1);
            }, TYPING_SPEED);
        } else {
            // Finished typing — pause then trigger fade-out
            timeout = setTimeout(() => {
                setIsFadingOut(true);
            }, PAUSE_AFTER_TYPED);
        }

        return () => clearTimeout(timeout);
    }, [displayedChars, isFadingOut, currentPhrase.length, phraseIndex]);

    // Cursor blink
    useEffect(() => {
        const interval = setInterval(() => {
            setCursorVisible(prev => !prev);
        }, 530);
        return () => clearInterval(interval);
    }, []);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 640);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const photoPosition = isMobile ? 'center center' : 'center bottom';
    const maskGradient = isMobile 
        ? 'radial-gradient(ellipse at center 50%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0) 70%)'
        : 'radial-gradient(ellipse at center 70%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 40%, rgba(0,0,0,0) 70%)';

    return (
        <section
            ref={heroRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative min-h-screen flex items-center overflow-hidden"
        >
            {/* Interactive Hexagonal Grid background layer */}
            <InteractiveHexGrid heroMousePos={mousePos} heroWidth={heroWidth} />

            {/* Premium animated curved background lines */}
            <HeroCurves />

            {/* Solid Black Particle Blocker Layer */}
            <div 
                className="absolute inset-0 pointer-events-none z-0 bg-black hero-blocker-fade-in"
                style={{
                    maskImage: maskGradient,
                    WebkitMaskImage: maskGradient
                }}
            />

            {/* Personal Photo Background Layer */}
            <div 
                className="absolute inset-0 pointer-events-none z-0 hero-photo-fade-in transition-opacity duration-1000"
                style={{
                    backgroundImage: "url('/BackgroundPhoto.png')",
                    backgroundSize: 'contain',
                    backgroundPosition: photoPosition,
                    backgroundRepeat: 'no-repeat',
                    mixBlendMode: 'normal',
                    filter: 'grayscale(15%) contrast(1.1)',
                    maskImage: maskGradient,
                    WebkitMaskImage: maskGradient,
                    ['--photo-target-opacity' as any]: isMobile ? 0.5 : 0.7
                }}
            />

            {/* Top-left subtle silver/gray glow */}
            <div
                className="absolute inset-0 pointer-events-none z-0"
                style={{
                    background: 'radial-gradient(circle at 0% 0%, rgba(200, 200, 200, 0.08) 0%, transparent 45%)'
                }}
            />
            {/* Mobile Watermark R — visible only below lg breakpoint */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none lg:hidden z-0">
                <svg
                    viewBox="0 0 240 360"
                    className="w-[340px] h-[510px] sm:w-[380px] sm:h-[570px]"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ opacity: 0.08 }}
                >
                    <rect x="0" y="0" width="50" height="360" className="fill-parchment-900 dark:fill-antique-600" />
                    <path d="M 70 0 L 145 0 C 230 0, 230 160, 145 160 L 70 160 L 70 0 Z" className="fill-parchment-900 dark:fill-antique-600" />
                    <rect x="85" y="40" width="65" height="80" rx="32" ry="40" className="fill-parchment-100 dark:fill-antique-50" />
                    <path d="M 70 160 L 120 160 L 230 360 L 165 360 Z" className="fill-parchment-900 dark:fill-antique-600" />
                </svg>
            </div>

            {/* Main Hero Container - Centered Layout */}
            <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-24 px-6 sm:px-8 md:px-12 lg:px-0 pt-16 sm:pt-20 lg:pt-32 pb-4 lg:pb-10">

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* LEFT ZONE - Static Name + Rotating Tagline */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="flex-shrink-0 max-w-4xl space-y-6 sm:space-y-8 lg:space-y-10 text-center lg:text-left">



                    {/* Static Name with subtle color animation */}
                    <div className="relative">
                        <div className="relative space-y-0 sm:space-y-1 md:space-y-2">
                            {/* RITESH */}
                            <div className="overflow-hidden hero-name-reveal" style={{ animationDelay: '0s' }}>
                                <span className="inline-block font-display text-6xl sm:text-7xl md:text-7xl lg:text-8xl font-bold hero-name-shimmer leading-[0.9] sm:leading-tight">
                                    RITESH
                                </span>
                            </div>

                            {/* KUMAR */}
                            <div className="overflow-hidden hero-name-reveal" style={{ animationDelay: '0.2s' }}>
                                <span className="inline-block font-display text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-semibold hero-name-shimmer-accent leading-[0.9] sm:leading-tight">
                                    KUMAR
                                </span>
                            </div>

                            {/* LENKA */}
                            <div className="overflow-hidden hero-name-reveal" style={{ animationDelay: '0.4s' }}>
                                <span className="inline-block font-display text-6xl sm:text-7xl md:text-7xl lg:text-8xl font-bold hero-name-shimmer leading-[0.9] sm:leading-tight">
                                    LENKA
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Static underline — plays once */}
                    <div className="h-[2px] w-[180px] mx-auto lg:mx-0 hero-underline bg-gradient-to-r from-green-500 via-green-400 to-transparent dark:from-green-400 dark:via-green-300 dark:to-transparent" />

                    {/* Tagline — rotating typing effect on first line, static second line */}
                    <div className="space-y-3 lg:space-y-3 hero-content-fade" style={{ animationDelay: '3.2s' }}>
                        {/* Rotating typed line — fixed height on mobile to prevent page jitter when text wraps */}
                        <div className="h-[3.6em] sm:h-[4.4em] md:h-[2.4em] flex items-center justify-center lg:justify-start overflow-hidden">
                            <p
                                className="font-serif text-xl md:text-2xl italic leading-relaxed text-parchment-800 dark:text-antique-800 transition-opacity duration-300"
                                style={{ opacity: isFadingOut ? 0 : 1 }}
                            >
                                {currentPhrase.slice(0, displayedChars)}
                                <span
                                    className="inline-block w-[2px] h-[1.1em] bg-green-500 dark:bg-green-400 ml-[2px] align-text-bottom rounded-sm"
                                    style={{
                                        opacity: cursorVisible ? 0.8 : 0,
                                        transition: 'opacity 0.1s',
                                    }}
                                />
                            </p>
                        </div>

                        {/* Static second line */}
                        <p className="font-serif text-base md:text-lg font-medium tracking-wide text-green-500 dark:text-green-400" style={{ opacity: 0.85 }}>
                            B.Tech CSE Student | AIML • Data Science • Full-Stack Development
                        </p>
                    </div>

                    {/* CTA Buttons — static, plays once */}
                    <div
                        className="flex flex-col sm:flex-row items-center sm:items-center lg:items-start gap-3 lg:gap-4 hero-content-fade"
                        style={{ animationDelay: '3.6s' }}
                    >
                        <Link
                            to="/projects"
                            className="group relative px-10 py-4 bg-gradient-to-r from-green-600 to-green-500 dark:from-green-500 dark:to-green-400 text-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-green-700/30 hover:-translate-y-1"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="relative font-serif font-bold tracking-widest uppercase text-sm flex items-center gap-3">
                                View My Work
                                <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </span>
                        </Link>

                        <a
                            href="/MyRESUME.pdf"
                            download="Ritesh_Kumar_Lenka_Resume.pdf"
                            className="group relative px-10 py-4 border-2 border-parchment-900 dark:border-antique-600 overflow-hidden transition-all duration-500 hover:border-green-500 dark:hover:border-green-400 hover:-translate-y-1"
                        >
                            <span className="absolute inset-0 w-0 bg-green-500/10 dark:bg-green-400/10 transition-all duration-500 ease-out group-hover:w-full" />
                            <span className="relative font-serif font-bold tracking-widest uppercase text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4M4 18h16" />
                                </svg>
                                Download My Resume
                            </span>
                        </a>
                    </div>

                    {/* Social Media Icons — mobile only (duplicated from right zone) */}
                    <div className="flex items-center justify-center gap-5 mt-1 lg:hidden hero-content-fade" style={{ animationDelay: '4.0s' }}>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="group relative w-11 h-11 flex items-center justify-center border border-parchment-400/40 dark:border-antique-400/30 rounded-full hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/10 dark:hover:bg-green-400/10 transition-all duration-400 hover:scale-110 hover:-translate-y-1" aria-label="GitHub">
                            <svg className="w-5 h-5 fill-parchment-700 dark:fill-antique-600 group-hover:fill-green-500 dark:group-hover:fill-green-400 transition-colors duration-300" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="group relative w-11 h-11 flex items-center justify-center border border-parchment-400/40 dark:border-antique-400/30 rounded-full hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/10 dark:hover:bg-green-400/10 transition-all duration-400 hover:scale-110 hover:-translate-y-1" aria-label="LinkedIn">
                            <svg className="w-5 h-5 fill-parchment-700 dark:fill-antique-600 group-hover:fill-green-500 dark:group-hover:fill-green-400 transition-colors duration-300" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                        </a>
                        <a href="mailto:hello@example.com" className="group relative w-11 h-11 flex items-center justify-center border border-parchment-400/40 dark:border-antique-400/30 rounded-full hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/10 dark:hover:bg-green-400/10 transition-all duration-400 hover:scale-110 hover:-translate-y-1" aria-label="Email">
                            <svg className="w-5 h-5 fill-none stroke-parchment-700 dark:stroke-antique-600 group-hover:stroke-green-500 dark:group-hover:stroke-green-400 transition-colors duration-300" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="group relative w-11 h-11 flex items-center justify-center border border-parchment-400/40 dark:border-antique-400/30 rounded-full hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/10 dark:hover:bg-green-400/10 transition-all duration-400 hover:scale-110 hover:-translate-y-1" aria-label="Twitter">
                            <svg className="w-5 h-5 fill-parchment-700 dark:fill-antique-600 group-hover:fill-green-500 dark:group-hover:fill-green-400 transition-colors duration-300" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                        </a>
                    </div>

                </div>

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* MIDDLE ZONE - Portfolio Label & Divider */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div
                    className="hidden lg:flex flex-col items-center justify-center gap-6"
                >
                    <div className="w-[2px] h-32 bg-gradient-to-b from-transparent via-green-500 dark:via-green-400 to-transparent" />
                    <span
                    className="font-serif text-sm tracking-[0.3em] text-green-500 dark:text-green-400 uppercase whitespace-nowrap font-bold"
                        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', textShadow: '0 2px 10px rgba(0, 224, 90, 0.2)' }}
                    >
                        My Portfolio
                    </span>
                    <div className="w-[2px] h-32 bg-gradient-to-b from-transparent via-green-500 dark:via-green-400 to-transparent" />
                </div>

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* RIGHT ZONE - Typographic "R" Identity */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="hidden lg:flex flex-col items-center justify-center gap-2 flex-shrink-0 mt-12 hero-content-fade" style={{ animationDelay: '3.6s' }}>
                    <div className="relative w-64 xl:w-80 h-[360px] xl:h-[420px]">
                        {/* Subtle glow behind R */}
                        <div
                            className="absolute inset-0 -z-10 blur-3xl"
                            style={{
                                background: 'radial-gradient(circle at 50% 40%, rgba(0, 224, 90, 0.12), transparent 60%)'
                            }}
                        />

                        {/* The "R" Letterform - Accurate design with separated stem and bowl */}
                        <svg
                            viewBox="0 0 240 360"
                            className="w-full h-full"
                            preserveAspectRatio="none"
                        >
                            {/* Vertical Stem - SEPARATE from the bowl */}
                            <rect
                                x="0"
                                y="0"
                                width="50"
                                height="360"
                                className="fill-[#1a1a1a]"
                            />

                            {/* Bowl - The curved part with rounded hole, positioned with gap from stem */}
                            <path
                                d="M 70 0
                                   L 145 0
                                   C 230 0, 230 160, 145 160
                                   L 70 160
                                   L 70 0
                                   Z"
                                className="fill-[#1a1a1a]"
                            />

                            {/* Hole in the bowl - pill/rounded rectangle shape */}
                            <rect
                                x="85"
                                y="40"
                                width="65"
                                height="80"
                                rx="32"
                                ry="40"
                                className="fill-[#000000]"
                            />

                            {/* Diagonal Leg - extends from bowl junction down */}
                            <path
                                d="M 70 160
                                   L 120 160
                                   L 230 360
                                   L 165 360
                                   Z"
                                className="fill-[#1a1a1a]"
                            />
                        </svg>

                        {/* Stem overlay with scrolling micro-text */}
                        <div
                            className="absolute overflow-hidden"
                            style={{
                                left: '0%',
                                top: '0%',
                                width: '20.8%',
                                height: '100%',
                            }}
                        >
                            {/* Scrolling text container */}
                            <div className="hero-stem-scroll">
                                {/* Repeat text multiple times for seamless loop on tall screens */}
                                {[1, 2, 3, 4, 5, 6].flatMap(() => STEM_TEXT_LINES).map((line, index) => (
                                    <div
                                        key={index}
                                        className="font-mono text-[5px] xl:text-[6px] leading-relaxed whitespace-nowrap px-1"
                                    >
                                        {highlightLine(line)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* Social Media Icons */}
                    <div className="flex items-center gap-5 mt-4 hero-content-fade" style={{ animationDelay: '4.0s' }}>
                        {/* GitHub */}
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative w-11 h-11 flex items-center justify-center border border-parchment-400/40 dark:border-antique-400/30 rounded-full hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/10 dark:hover:bg-green-400/10 transition-all duration-400 hover:scale-110 hover:-translate-y-1"
                            aria-label="GitHub"
                        >
                            <svg className="w-5 h-5 fill-parchment-700 dark:fill-antique-600 group-hover:fill-green-500 dark:group-hover:fill-green-400 transition-colors duration-300" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                        </a>

                        {/* LinkedIn */}
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative w-11 h-11 flex items-center justify-center border border-parchment-400/40 dark:border-antique-400/30 rounded-full hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/10 dark:hover:bg-green-400/10 transition-all duration-400 hover:scale-110 hover:-translate-y-1"
                            aria-label="LinkedIn"
                        >
                            <svg className="w-5 h-5 fill-parchment-700 dark:fill-antique-600 group-hover:fill-green-500 dark:group-hover:fill-green-400 transition-colors duration-300" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>

                        {/* Email */}
                        <a
                            href="mailto:hello@example.com"
                            className="group relative w-11 h-11 flex items-center justify-center border border-parchment-400/40 dark:border-antique-400/30 rounded-full hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/10 dark:hover:bg-green-400/10 transition-all duration-400 hover:scale-110 hover:-translate-y-1"
                            aria-label="Email"
                        >
                            <svg className="w-5 h-5 fill-none stroke-parchment-700 dark:stroke-antique-600 group-hover:stroke-green-500 dark:group-hover:stroke-green-400 transition-colors duration-300" viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" />
                                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                            </svg>
                        </a>

                        {/* Twitter / X */}
                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative w-11 h-11 flex items-center justify-center border border-parchment-400/40 dark:border-antique-400/30 rounded-full hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/10 dark:hover:bg-green-400/10 transition-all duration-400 hover:scale-110 hover:-translate-y-1"
                            aria-label="Twitter"
                        >
                            <svg className="w-5 h-5 fill-parchment-700 dark:fill-antique-600 group-hover:fill-green-500 dark:group-hover:fill-green-400 transition-colors duration-300" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>



        </section >
    );
};
