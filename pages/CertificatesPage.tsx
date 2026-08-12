import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { InteractiveFooter } from '../components/InteractiveFooter';
import { Trophy } from 'lucide-react';

const CERTIFICATES = [
    { title: "IDS Certificate", path: "/certificates/IDS_Certificate.png" },
    { title: "IBM", path: "/certificates/IBM.jpg" },
    { title: "CMMC MacLead", path: "/certificates/CMMC_MacLead.jpg" },
    { title: "NPTEL", path: "/certificates/NPTEL.png" },
    { title: "NPTEL IoT", path: "/certificates/NptelIoT.jpeg" },
    { title: "Data Science Course", path: "/certificates/DataScienceCourse.jpg" },
    { title: "Internship", path: "/certificates/Internship.png" },
    { title: "EduSkills", path: "/certificates/EduSkills.png" },
    { title: "Hacknovation 2.0", path: "/certificates/Hacknovation2.0.png" },
    { title: "Hackathon", path: "/certificates/Hakathon.png" },
    { title: "IoT Workshop", path: "/certificates/IoT_workshop.png" },
    { title: "AI Workshop", path: "/certificates/AI_Workshop.png" },
];

const FESTIVAL_CERTIFICATES = [
    { title: "Waste O Craft — 1st Position", path: "/certificates/WasteOCraft(1st Position).jpeg" },
    { title: "Data Decode — 2nd Position", path: "/certificates/Data Decode(2nd position).jpeg" },
    { title: "Prompt To Prototype — 2nd Position", path: "/certificates/Prompt To Prototype(2nd position).jpeg" },
    { title: "Startup Carnival — 2nd Position", path: "/certificates/Startup Carnival(2nd position).jpeg" },
];

export const CertificatesPage: React.FC = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">

                {/* Header */}
                <div className="max-w-3xl mx-auto text-center flex flex-col items-center mb-16 md:mb-24">
                    <button
                        onClick={() => window.history.back()}
                        className="mb-8 text-sm font-semibold tracking-widest text-white/50 hover:text-white transition-colors flex items-center gap-2 uppercase"
                    >
                        <span>←</span> Back
                    </button>
                    <h1 className="flex flex-wrap justify-center gap-x-5 md:gap-x-10 text-6xl md:text-8xl font-black uppercase tracking-tight mb-6 leading-none">
                        <span>Professional</span>
                        <span className="text-white/40">Certificates</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light">
                        A collection of achievements, workshops, and certifications that have shaped my technical foundation and continuous learning journey.
                    </p>
                </div>

                {/* Main Certificates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {CERTIFICATES.map((cert, i) => (
                        <div key={i} className="group flex flex-col gap-4">
                            <div className="relative overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                                <img
                                    src={cert.path}
                                    alt={cert.title}
                                    className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                                    loading="lazy"
                                />
                            </div>
                            <h3 className="text-lg font-semibold tracking-tight px-1 text-white/90">
                                {cert.title}
                            </h3>
                        </div>
                    ))}
                </div>

                {/* College Festival Events Section */}
                <div className="mt-24 md:mt-32">
                    {/* Section Divider */}
                    <div className="border-t border-white/10 mb-16 md:mb-20" />

                    {/* Section Title */}
                    <div className="flex flex-col items-center text-center mb-16 md:mb-20">
                        <div className="flex items-center gap-3 mb-4">
                            <Trophy size={22} className="text-yellow-400" />
                            <span className="text-xs font-bold tracking-[0.3em] text-white/40 uppercase">College Festival Events</span>
                            <Trophy size={22} className="text-yellow-400" />
                        </div>
                        <h2 className="flex flex-wrap justify-center gap-x-4 md:gap-x-8 text-4xl md:text-6xl font-black uppercase tracking-tight leading-none">
                            <span>Fest</span>
                            <span className="text-white/40">Victories</span>
                        </h2>
                        <p className="mt-5 text-base md:text-lg text-white/50 font-light max-w-xl">
                            Recognition earned at college cultural and technical festivals — competing, building, and winning.
                        </p>
                    </div>

                    {/* Festival Certificates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
                        {FESTIVAL_CERTIFICATES.map((cert, i) => (
                            <div key={i} className="group flex flex-col gap-4">
                                <div className="relative overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center">
                                    <img
                                        src={cert.path}
                                        alt={cert.title}
                                        className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold tracking-tight px-1 text-white/90">
                                    {cert.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
            <InteractiveFooter />
        </div>
    );
};


