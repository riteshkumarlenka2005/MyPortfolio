import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ScrollNavbar } from '../components/ScrollNavbar';
import { HeritageFrame } from '../components/HeritageFrame';

export const AboutPage: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const isReturning = typeof window !== 'undefined' && !!sessionStorage.getItem('hasVisited');

    useEffect(() => {
        // Fast entry on return visits, slower on first visit
        const delay = isReturning ? 300 : 2200;
        sessionStorage.setItem('hasVisited', 'true');
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, []);

    // Stagger timing for hero words
    const heroBaseDelay = isReturning ? 100 : 2200;
    const heroStagger = isReturning ? 60 : 150;
    const underlineDelay = isReturning ? 600 : 3400;

    return (
        <div className="min-h-screen bg-parchment-100 dark:bg-antique-50 text-parchment-900 dark:text-antique-800 transition-colors duration-500">
            <HeritageFrame />
            <ScrollNavbar />

            {/* Main Content - Manuscript Style */}
            <main className={`
        relative z-10 
        max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-20
        transform transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]
        ${visible ? 'opacity-100 translate-y-0 scale-100 blur-none' : 'opacity-0 translate-y-32 scale-90 blur-md'}
      `}>

                {/* Hero Statement */}
                <div className="mb-20 py-16 text-center relative overflow-hidden">
                    {/* Subtle background accent */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(160,160,160,0.06) 0%, transparent 70%)',
                        }}
                    />

                    <h1 className="relative font-display font-black tracking-tight leading-[0.95]">
                        {['I', 'am', 'the', 'CEO', 'of', 'my', 'Life'].map((word, i) => (
                            <span
                                key={word + i}
                                className="inline-block mx-2 md:mx-3 transition-all duration-700 ease-out"
                                style={{
                                    fontSize: word === 'CEO' || word === 'Life' ? undefined : undefined,
                                    transitionDelay: `${heroBaseDelay + i * heroStagger}ms`,
                                    opacity: visible ? 1 : 0,
                                    transform: visible
                                        ? 'translateY(0) scale(1)'
                                        : 'translateY(40px) scale(0.9)',
                                }}
                            >
                                <span className={`
                                    ${word === 'CEO' ? 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl bg-gradient-to-b from-parchment-900 to-parchment-700 dark:from-antique-900 dark:to-antique-700 bg-clip-text text-transparent' : ''}
                                    ${word === 'Life' ? 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl bg-gradient-to-b from-parchment-900 to-parchment-700 dark:from-antique-900 dark:to-antique-700 bg-clip-text text-transparent' : ''}
                                    ${word !== 'CEO' && word !== 'Life' ? 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-parchment-800 dark:text-antique-800' : ''}
                                `}>
                                    {word}
                                </span>
                            </span>
                        ))}
                    </h1>

                    {/* Animated underline */}
                    <div
                        className="mx-auto mt-8 h-[2px] bg-gradient-to-r from-transparent via-parchment-500 to-transparent dark:via-antique-600 transition-all duration-1000 ease-out"
                        style={{
                            width: visible ? '60%' : '0%',
                            transitionDelay: `${underlineDelay}ms`,
                            opacity: visible ? 0.4 : 0,
                        }}
                    />
                </div>

                {/* Profile Photo - Circular */}
                <div className="flex justify-center mb-16">
                    <div className="relative">
                        {/* Outer ring */}
                        <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full border-2 border-amber-700/20 dark:border-amber-600/20 p-2">
                            {/* Inner ring */}
                            <div className="w-full h-full rounded-full border border-parchment-400/30 dark:border-antique-300/20 p-1">
                                {/* Photo */}
                                <div className="w-full h-full rounded-full overflow-hidden shadow-xl shadow-amber-900/15 dark:shadow-amber-600/10">
                                    <img
                                        src="/MyPhoto.png"
                                        alt="Ritesh Kumar Lenka"
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Decorative corners */}
                        <div className="absolute -top-1 -left-1 w-5 h-5 border-l-2 border-t-2 border-amber-700/25 dark:border-amber-600/25" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-r-2 border-b-2 border-amber-700/25 dark:border-amber-600/25" />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    <a
                        href="/MyRESUME.pdf"
                        download="Ritesh_Kumar_Lenka_Resume.pdf"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-parchment-100 dark:text-antique-100 font-serif font-bold tracking-widest uppercase text-sm transition-all duration-300 shadow-lg hover:shadow-amber-900/30 rounded-sm hover:-translate-y-0.5"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Download Resume
                    </a>
                    <a
                        href="/MyUpdated CV.pdf"
                        download="Ritesh_Kumar_Lenka_CV.pdf"
                        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-amber-700 dark:border-amber-600 text-amber-700 dark:text-amber-500 hover:bg-amber-700/10 dark:hover:bg-amber-600/10 font-serif font-bold tracking-widest uppercase text-sm transition-all duration-300 rounded-sm hover:-translate-y-0.5"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Download CV
                    </a>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-700 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white font-serif font-bold tracking-widest uppercase text-sm transition-all duration-300 shadow-lg hover:shadow-green-900/30 rounded-sm hover:-translate-y-0.5"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                        Hire Me
                    </Link>
                </div>

                {/* Page Title - Understated */}
                <header className="mb-16 border-b border-parchment-400/30 dark:border-antique-200/20 pb-8">
                    <div className="flex items-center gap-4 mb-4 opacity-50">
                        <div className="h-[1px] w-8 bg-current"></div>
                        <span className="font-serif italic text-sm tracking-widest uppercase">About the Author</span>
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-wide text-parchment-900 dark:text-antique-900">
                        The Mind Behind the Archive
                    </h2>
                </header>

                {/* Introduction */}
                <section className="mb-16">
                    <div className="font-serif text-lg md:text-xl leading-relaxed space-y-6 text-justify">
                        <p className="first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:mr-2 first-letter:float-left first-letter:leading-none first-letter:text-amber-700 dark:first-letter:text-amber-600">
                            I am Ritesh Kumar Lenka, a B.Tech Computer Science student passionate about artificial intelligence,
                            data science, and building real-world technology solutions. My journey into engineering started early
                            with small experimental projects and an insatiable curiosity about how complex systems work from the inside out.
                        </p>
                        <p>
                            This archive represents my path of discovery—each project being a milestone in my learning.
                            I approach technology with a builder's mindset, believing that the best way to understand
                            a system is to engineer it from scratch. Whether it's training a neural network or
                            designing a responsive interface, I am driven by the search for elegant, efficient solutions.
                        </p>
                    </div>
                </section>

                {/* Decorative Divider */}
                <div className="flex items-center justify-center gap-6 my-16 opacity-30">
                    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-current"></div>
                    <div className="w-2 h-2 rotate-45 border border-current"></div>
                    <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-current"></div>
                </div>

                {/* Academic & Personal Journey */}
                <section className="mb-16">
                    <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-4">
                        <span className="text-amber-700/30 dark:text-amber-600/30 text-4xl font-light">I.</span>
                        My Story & Academic Journey
                    </h2>
                    <div className="font-serif text-lg leading-relaxed space-y-6 text-justify">
                        <p>
                            Currently pursuing my Bachelor's degree in Computer Science and Engineering, I have focused my
                            academic work on the intersection of Machine Learning and robust Software Engineering.
                            What began as curiosity about simple automate algorithms has evolved into a deep dive into
                            Predictive Modeling, Computer Vision, and Full-Stack development.
                        </p>
                        <p>
                            My engineering education has been defined by proactive learning. Beyond the classroom,
                            I spend my time participating in hackathons, competing in coding challenges, and
                            collaborating on open-source projects. These experiences have taught me that true
                            engineering is about problem-solving under constraints and constant iteration.
                        </p>
                    </div>
                </section>

                {/* Technical Interests */}
                <section className="mb-16">
                    <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-4">
                        <span className="text-amber-700/30 dark:text-amber-600/30 text-4xl font-light">II.</span>
                        Technical Interests
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { title: 'Artificial Intelligence', desc: 'Predictive modeling, deep learning, and making sense of unstructured data' },
                            { title: 'Full-Stack Engineering', desc: 'Building seamless connections between data engines and user interfaces' },
                            { title: 'Experimental Dev', desc: 'Rapid prototyping of hardware-software integrations and automation' },
                            { title: 'Logic & Algorithms', desc: 'Optimizing performance and solving complex computational puzzles' },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="p-6 border border-parchment-400/20 dark:border-antique-200/10 hover:border-amber-700/30 dark:hover:border-amber-600/20 transition-colors duration-500 rounded-lg bg-parchment-200/5 dark:bg-antique-100/5"
                            >
                                <h3 className="font-display text-lg mb-3 text-parchment-900 dark:text-antique-900">{item.title}</h3>
                                <p className="font-serif text-base leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Currently Learning */}
                <section className="mb-16">
                    <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-4">
                        <span className="text-amber-700/30 dark:text-amber-600/30 text-4xl font-light">III.</span>
                        What I Am Currently Learning
                    </h2>
                    <div className="font-serif text-lg leading-relaxed space-y-6 text-justify">
                        <p>
                            The landscape of technology is shifting rapidly, particularly in the realm of AI.
                            Currently, I am deepening my understanding of Large Language Models (LLMs) and
                            exploring the implementation of autonomous agents. Every day is a new research
                            session into how we can make machine-human interaction more intuitive and impactful.
                        </p>
                    </div>
                </section>

                {/* Future Vision */}
                <section className="mb-16">
                    <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-4">
                        <span className="text-amber-700/30 dark:text-amber-600/30 text-4xl font-light">IV.</span>
                        Future Vision & Research
                    </h2>
                    <div className="font-serif text-lg leading-relaxed space-y-6 text-justify">
                        <p>
                            My goal is to contribute to research and development that creates a tangible positive
                            impact on society. I am particularly interested in how AI can be leveraged for better
                            education, accessibility, and environmental sustainability. For me, engineering is not
                            just about writing code—it's about building the future, one deliberate project at a time.
                        </p>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="border-t border-parchment-400/30 dark:border-antique-200/20 pt-12 mt-20">
                    <h2 className="font-display text-2xl font-semibold mb-6">Correspondence</h2>
                    <p className="font-serif text-lg leading-relaxed mb-8">
                        I am always open to discussing new ideas, collaborating on projects, or sharing learning
                        resources. Feel free to reach out.
                    </p>
                    <div className="flex flex-wrap gap-6">
                        <a
                            href="mailto:your-email@example.com"
                            className="group font-serif text-lg border-b border-transparent hover:border-amber-700 dark:hover:border-amber-600 transition-colors duration-300"
                        >
                            <span className="opacity-50 group-hover:opacity-100 transition-opacity">→ </span>
                            Email Me
                        </a>
                        <a
                            href="https://github.com/riteshkumarlenka2005"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group font-serif text-lg border-b border-transparent hover:border-amber-700 dark:hover:border-amber-600 transition-colors duration-300"
                        >
                            <span className="opacity-50 group-hover:opacity-100 transition-opacity">→ </span>
                            GitHub
                        </a>
                        <a
                            href="https://www.linkedin.com/in/ritesh-kumar-lenka-186010320/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group font-serif text-lg border-b border-transparent hover:border-amber-700 dark:hover:border-amber-600 transition-colors duration-300"
                        >
                            <span className="opacity-50 group-hover:opacity-100 transition-opacity">→ </span>
                            LinkedIn
                        </a>
                    </div>
                </section>

                {/* Footer Spacer */}
                <div className="h-20"></div>
            </main>

            {/* Subtle Footer Line */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-900/10 to-transparent pointer-events-none"></div>
        </div>
    );
};
