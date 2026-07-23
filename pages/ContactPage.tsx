import React, { useEffect } from 'react';
import { InteractiveFooter } from '../components/InteractiveFooter';
import { CommunicationEngine } from '../AI/index';

export const ContactPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);



    return (
        <div className="bg-[#0a0a0a] text-white font-sans selection:bg-amber-500/30">
            {/* Main Content */}
            <main className="min-h-screen flex flex-col justify-center w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 pt-20 pb-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Left Column: Text & Info */}
                    <div className="flex flex-col">
                        <h1 className="text-[10vw] lg:text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] font-black tracking-[-0.04em] leading-[0.85] mb-5 md:mb-6 text-white uppercase">
                            Contact me
                        </h1>
                        <p className="text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed max-w-md mb-8 md:mb-12">
                            Whether you're hiring, offering an internship, or have an exciting project — I'd love to hear from you. Use the AI assistant to craft the perfect message in seconds.
                        </p>

                        <div className="space-y-8">
                            {/* Email */}
                            <div className="flex items-center gap-5 text-gray-300">
                                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0 border border-white/5">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <span className="text-sm md:text-lg font-medium truncate">lenkariteshkumar2005@gmail.com</span>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-5 text-gray-300">
                                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0 border border-white/5">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                </div>
                                <span className="text-lg font-medium">Odisha, India</span>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-5 text-gray-300">
                                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center shrink-0 border border-white/5">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                    </svg>
                                </div>
                                <span className="text-lg font-medium">+91 82600 49064</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form Card */}
                    <div className="w-full">
                        <div className="bg-gradient-to-br from-gray-200 via-gray-600 to-[#0a0a0a] rounded-[2rem] md:rounded-[2.5rem] p-1.5 relative shadow-2xl overflow-hidden">
                            {/* Top Frame Header */}
                             <div className="px-5 pt-4 pb-3 md:px-6 md:pt-5 md:pb-4 flex justify-between items-start text-black">
                                <div>
                                    <div className="font-bold italic text-xs md:text-sm tracking-wider mb-0.5">Let's Connect</div>
                                    <div className="font-bold italic text-xl md:text-3xl font-sans tracking-tight">Let's Build Something Together.</div>
                                </div>
                            </div>

                            {/* Inner Card */}
                             <div className="bg-[#0a0a0a] rounded-[1.75rem] md:rounded-[2.25rem] p-5 sm:p-6 md:p-8 lg:p-10 shadow-inner">
                                <CommunicationEngine />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <InteractiveFooter />
        </div>
    );
};
