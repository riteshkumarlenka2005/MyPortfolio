import React, { useEffect, useState } from 'react';
import { QuillIcon, ScrollIcon } from './Icons';

export const HeroContent: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Content fades in AFTER the scroll navbar has largely finished
        const timer = setTimeout(() => {
            setVisible(true);
        }, 2200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <main className={`
            flex flex-col items-center justify-center min-h-screen px-6 pt-32 pb-20
            transition-opacity duration-[2000ms] ease-in-out
            ${visible ? 'opacity-100' : 'opacity-0'}
        `}>
            
            <div className="max-w-4xl w-full text-center space-y-12">
                
                {/* Section Header */}
                <div className="space-y-6">
                    <div className="inline-flex items-center justify-center space-x-4 opacity-60">
                         <div className="h-[1px] w-12 bg-current"></div>
                         <span className="font-serif italic tracking-widest text-sm uppercase">Est. MMXXIV</span>
                         <div className="h-[1px] w-12 bg-current"></div>
                    </div>
                    
                    <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight text-parchment-900 dark:text-antique-900 drop-shadow-sm">
                        Curiosity <span className="font-script font-light text-6xl md:text-8xl lg:text-9xl text-amber-700 dark:text-amber-600 block my-2">&</span> Intellect
                    </h1>
                </div>

                {/* Main Body Text */}
                <div className="max-w-2xl mx-auto font-serif text-lg md:text-xl leading-relaxed text-parchment-800 dark:text-antique-800 space-y-6 text-justify md:text-center">
                    <p>
                        Welcome to the archive. Here lies a collection of thoughts, rigorous research, and digital artifacts crafted with patience. 
                        Unlike the fleeting noise of the modern web, this space is designed for contemplation.
                    </p>
                    <p>
                        Please, unroll the manuscript above, select a chapter, and begin your exploration.
                    </p>
                </div>

                {/* Call to Actions (Ceremonial Buttons) */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8">
                    <button className="group relative px-8 py-4 bg-transparent border border-parchment-900 dark:border-antique-400 overflow-hidden transition-all duration-500 hover:border-transparent">
                        <span className="absolute inset-0 w-0 bg-parchment-900 dark:bg-antique-300 transition-all duration-[400ms] ease-out group-hover:w-full opacity-10 dark:opacity-20"></span>
                        <div className="flex items-center gap-3">
                            <QuillIcon className="w-5 h-5" />
                            <span className="font-serif font-bold tracking-widest uppercase text-sm">Read the Journal</span>
                        </div>
                    </button>

                    <button className="group relative px-8 py-4 bg-transparent border border-transparent hover:border-parchment-900/30 dark:hover:border-antique-400/30 transition-all duration-500">
                        <div className="flex items-center gap-3">
                            <span className="font-serif font-bold tracking-widest uppercase text-sm border-b border-transparent group-hover:border-current transition-all duration-500">View Artifacts</span>
                            <ScrollIcon className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-500" />
                        </div>
                    </button>
                </div>
            </div>

            {/* Decorative Divider */}
            <div className="mt-24 mb-12 flex flex-col items-center opacity-30">
                <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-current to-transparent"></div>
            </div>

            {/* Grid of "Recent Findings" - Layout Demo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
                 {[1, 2, 3].map((i) => (
                     <div key={i} className="group relative p-8 border border-parchment-400/30 dark:border-antique-200/10 hover:border-parchment-900/20 dark:hover:border-antique-400/20 transition-colors duration-500 cursor-pointer">
                         <div className="absolute top-4 right-4 font-display text-4xl opacity-5 dark:opacity-10 group-hover:opacity-10 transition-opacity">0{i}</div>
                         <h3 className="font-display text-xl mb-3">Ancient Algorithms</h3>
                         <p className="font-serif text-sm leading-relaxed">
                             Exploring the mathematical foundations of early computing devices and their impact on modern heritage preservation.
                         </p>
                         <div className="mt-6 w-8 h-[1px] bg-amber-700/50 group-hover:w-16 transition-all duration-500"></div>
                     </div>
                 ))}
            </div>

        </main>
    );
};
