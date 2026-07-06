import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HexagonMosaic } from './HexagonMosaic';
import { NeuralPattern } from './NeuralPattern';

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
    keyword: '#569CD6',     
    string: '#CE9178',      
    comment: '#6A9955',     
    type: '#4EC9B0',        
    func: '#DCDCAA',        
    number: '#B5CEA8',      
    property: '#9CDCFE',    
    punctuation: '#D4D4D4', 
    operator: '#D4D4D4',    
    default: '#D4D4D4',     
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

    if (remaining.trimStart().startsWith('//') || remaining.trimStart().startsWith('/*')) {
        push(remaining, VS_COLORS.comment);
        return tokens;
    }

    if (remaining.trimStart().startsWith('`') && remaining.trimEnd().endsWith('`;')) {
        push(remaining, VS_COLORS.string);
        return tokens;
    }

    const tokenRegex = /(\s+)|(\/\/.*|\/\*.*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b(?:const|let|var|function|return|class|interface|type|enum|export|import|async|await|extends|implements|private|readonly|public|protected|as|new|this|from)\b)|(\b(?:string|number|boolean|void|null|undefined|any|never|unknown|Promise|High|Unwavering|Vision|Fragment|Timeless|Legacy|Craft|Visionary|Attention|Detail|Excellence|Intent|Logic|T)\b)|(\b\d+(?:\.\d+)?\b)|(\b[a-z]\w*(?=\s*\())|(\b[A-Z]\w*(?=\s*[=<{(]))|([a-zA-Z_]\w*)|([{}()[\]:;,.<>=&|!?+\-*/])/g;

    let match;
    let lastIndex = 0;

    while ((match = tokenRegex.exec(remaining)) !== null) {
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

export const HeroSection: React.FC = () => {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#eef1f5]">
            
            {/* Right side light gradient */}
            <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 75% 50%, #ffffff 0%, #eef1f5 100%)' }} />

            {/* Premium Left-Side Dark Gradient */}
            <div className="absolute inset-y-0 left-0 w-full lg:w-[65%] xl:w-[60%] pointer-events-none z-0">
                {/* Base linear gradient from black to transparent */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#111111] to-transparent" />
                {/* Deep radial dark core on the far left */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_50%,rgba(0,0,0,1)_0%,rgba(17,17,17,0.8)_50%,transparent_100%)]" />
                
                {/* Colored Dot Pattern Layer */}
                <NeuralPattern />
            </div>

            {/* The Giant "R" anchored to the bottom left */}
            <div className="absolute bottom-0 left-0 w-48 sm:w-64 xl:w-80 h-[280px] sm:h-[360px] xl:h-[420px] z-0 opacity-20 lg:opacity-100 transform -translate-x-10 translate-y-10 lg:translate-x-0 lg:translate-y-0">
                <div className="relative w-full h-full">
                    {/* Subtle glow behind R */}
                    <div
                        className="absolute inset-0 -z-10 blur-3xl"
                        style={{ background: 'radial-gradient(circle at 50% 40%, rgba(0, 224, 90, 0.12), transparent 60%)' }}
                    />
                    <svg viewBox="0 0 240 360" className="w-full h-full" preserveAspectRatio="none">
                        <rect x="0" y="0" width="50" height="360" className="fill-[#1a1a1a]" />
                        <path d="M 70 0 L 145 0 C 230 0, 230 160, 145 160 L 70 160 L 70 0 Z" className="fill-[#1a1a1a]" />
                        <rect x="85" y="40" width="65" height="80" rx="32" ry="40" className="fill-[#000000]" />
                        <path d="M 70 160 L 120 160 L 230 360 L 165 360 Z" className="fill-[#1a1a1a]" />
                    </svg>

                    {/* Stem overlay with scrolling micro-text */}
                    <div className="absolute overflow-hidden" style={{ left: '0%', top: '0%', width: '20.8%', height: '100%' }}>
                        <div className="hero-stem-scroll">
                            {[1, 2, 3, 4, 5, 6].flatMap(() => STEM_TEXT_LINES).map((line, index) => (
                                <div key={index} className="font-mono text-[5px] xl:text-[6px] leading-relaxed whitespace-nowrap px-1">
                                    {highlightLine(line)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Vertical Left Edge "ARCHIVE" text */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden 2xl:flex flex-col items-center opacity-10 pointer-events-none z-10">
                <span className="font-display font-black text-9xl tracking-[0.2em] text-white" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}>
                    ARCHIVE
                </span>
            </div>

            {/* Main Content Container - 2 Column Layout */}
            <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 2xl:pl-48 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 py-12">
                
                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* LEFT ZONE - Editorial Content */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="flex-1 w-full flex flex-col items-start space-y-8 animate-fade-in-up">
                    
                    {/* CTAs and Socials Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-4">
                        


                        {/* Social Media Icons */}
                        <div className="flex items-center gap-4 border-l border-white/20 pl-8">
                            <a href="https://github.com/riteshkumarlenka2005" target="_blank" rel="noopener noreferrer" className="group text-gray-400 hover:text-white transition-colors duration-300">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            </a>
                            <a href="https://www.linkedin.com/in/ritesh-kumar-lenka-186010320/" target="_blank" rel="noopener noreferrer" className="group text-gray-400 hover:text-blue-400 transition-colors duration-300">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                            </a>
                            <a href="mailto:lenkariteshkumar2005@gmail.com" className="group text-gray-400 hover:text-green-400 transition-colors duration-300">
                                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            </a>
                            <a href="https://x.com/RiteshKuma6338" target="_blank" rel="noopener noreferrer" className="group text-gray-400 hover:text-white transition-colors duration-300">
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* RIGHT ZONE - Hexagon Mosaic */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                <div className="flex-1 w-full lg:w-auto flex justify-center lg:justify-end items-center relative pointer-events-auto">
                    <HexagonMosaic />
                </div>

            </div>
        </section>
    );
};
