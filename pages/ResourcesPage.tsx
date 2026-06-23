import React, { useEffect, useState } from 'react';
import { InteractiveFooter } from '../components/InteractiveFooter';

// -------------------------------------------------------------------------------
// --- RESOURCES PAGE -----------------------------------------------------------
// -------------------------------------------------------------------------------

export const ResourcesPage: React.FC = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const isReturning = sessionStorage.getItem('hasVisited');
        const delay = isReturning ? 300 : 2200;
        sessionStorage.setItem('hasVisited', 'true');
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-parchment-100 dark:bg-antique-50 text-parchment-900 dark:text-antique-800 transition-colors duration-500">
            <main className={`
                max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-20
                transition-all duration-1000 ease-out
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}>
                <header className="mb-16 pb-8">
                    <div className="flex items-center gap-4 mb-4 opacity-50">
                        <div className="h-[1px] w-8 bg-current" />
                        <span className="font-serif italic text-sm tracking-widest uppercase">The Knowledge Vault</span>
                    </div>
                    <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-wide text-parchment-900 dark:text-antique-900 mb-4">
                        Resource Archive
                    </h1>
                    <div className="flex items-center gap-4 mt-8 opacity-20">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-current to-transparent" />
                        <div className="w-1.5 h-1.5 rotate-45 border border-current" />
                    </div>
                </header>

                {/* Coming Soon Placeholder */}
                <div className="flex flex-col items-center justify-center py-32 opacity-40">
                    <div className="text-6xl mb-6">??</div>
                    <p className="font-display text-2xl font-semibold mb-2">Coming Soon</p>
                    <p className="font-serif text-base italic">Resources are being collected and curated.</p>
                </div>

                <div className="h-20" />
            </main>

            <InteractiveFooter />
        </div>
    );
};
