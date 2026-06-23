import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { InteractiveFooter } from '../components/InteractiveFooter';






interface ProjectDetail {
    id: number;
    title: string;
    era: string;
    context: string;
    coreIdea: string;
    implementation: string;
    outcome: string;
    tags: string[];
    liveUrl?: string;
    sourceUrl?: string;
    // Optional: rich structured content that overrides the 4 plain-text fields
    richSections?: React.ReactNode;
}

// Full project data
const PROJECTS: ProjectDetail[] = [
    {
        id: 1,
        title: "Data Science Club Website",
        era: "2nd Year · Full-Stack Platform & Community Ecosystem",
        context: "",
        coreIdea: "",
        implementation: "",
        outcome: "",
        tags: ["React 19", "TypeScript", "Node.js", "Express.js", "Supabase", "PostgreSQL", "JWT + OAuth", "Framer Motion", "GSAP", "pdf-lib", "QR Attendance", "RBAC"],
        richSections: (
            <div className="space-y-14">

                {/* ── Overview ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Project Overview
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">
                        DS Club Official is a production-ready, full-stack web platform built for the Data Science Club at GIET University.
                        Rather than a simple brochure website, it was conceived as a <em>community operating system</em> — a unified digital ecosystem
                        that manages the complete lifecycle of club membership, from first discovery all the way through to alumni engagement.
                        The platform serves students, active members, alumni, and administrators through a single, cohesive interface.
                    </p>
                </section>

                {/* ── Problem ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        The Problem
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed mb-5 text-justify">
                        Before this platform existed, the club operated on fragmented, manual infrastructure that could not scale.
                        Communication was scattered, processes were error-prone, and there was no single source of truth for the community.
                    </p>
                    <ul className="space-y-3 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                        {[
                            "Member communication lived across disconnected WhatsApp groups and email threads.",
                            "Event registrations were handled through Google Forms with no automated follow-up or tracking.",
                            "Attendance was logged manually — slow, inaccurate, and impossible to audit.",
                            "There was no structured system to issue certificates of participation or recognition.",
                            "Students had no dedicated space to build or showcase a club portfolio.",
                            "Alumni had no directory, severing the bridge between past and present members.",
                            "Administrators lacked a dashboard — oversight of users, blogs, and events required jumping between tools."
                        ].map((point, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── Architecture & Tech Stack ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Architecture & Technology Stack
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed mb-7 text-justify">
                        The project is structured as a <strong>monorepo</strong>, cleanly separating the client, server, and database layers
                        while sharing configuration and types across boundaries. Each layer was chosen deliberately — prioritising
                        developer experience, production reliability, and long-term maintainability.
                    </p>

                    <div className="space-y-7">
                        {/* Frontend */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">Frontend — Client</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "Framework", value: "React 19 with TypeScript — full type-safety across components and API contracts." },
                                    { label: "Build Tool", value: "Vite 6 — sub-second HMR and optimised production bundles." },
                                    { label: "Styling", value: "Tailwind CSS v4 — utility-first, fully responsive across all breakpoints." },
                                    { label: "Animations", value: "Framer Motion + GSAP — smooth page transitions, micro-interactions, and a premium feel." },
                                    { label: "Routing", value: "React Router DOM v7 with hash-based routing and lazy-loaded route components." },
                                    { label: "Auth UI", value: "@react-oauth/google for seamless Google Sign-In integration on the client." },
                                    { label: "QR Tools", value: "html5-qrcode (scanning) + qrcode.react (generation) for the attendance flow." },
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Backend */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">Backend — Server</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "Runtime", value: "Node.js with Express.js — lightweight, battle-tested REST API layer." },
                                    { label: "Language", value: "TypeScript end-to-end, shared types across client and server." },
                                    { label: "Security", value: "Helmet, CORS, and Express Rate Limit to harden the API surface against common attacks." },
                                    { label: "Auth", value: "Custom JWT tokens combined with Google Auth Library for verified OAuth flows." },
                                    { label: "File Handling", value: "Multer for multipart uploads — profile photos, event media, and gallery assets." },
                                    { label: "PDF Generation", value: "pdf-lib for server-side, template-driven certificate generation — no third-party services." },
                                    { label: "Logging", value: "Morgan for structured HTTP request logging in all environments." },
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Database */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">Database & Backend-as-a-Service</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "Database", value: "Supabase (PostgreSQL) — managed, scalable, with real-time capabilities." },
                                    { label: "Schema", value: "Automated SQL migrations and seed scripts under supabase/migrations/ for reproducible environments." },
                                    { label: "Client SDK", value: "@supabase/supabase-js for type-safe database queries directly from the server." },
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── Key Features ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Key Features & Engineering Highlights
                    </h3>

                    <div className="space-y-8">
                        {[
                            {
                                title: "Role-Based Access Control (RBAC)",
                                body: "The platform enforces four distinct access tiers — Guest, Student, Member, and Admin. Every route and API endpoint is protected based on the user's role, ensuring that administrative capabilities are strictly gated and never accidentally exposed. Authentication combines custom JWT tokens with Google OAuth, giving users a secure and familiar sign-in experience."
                            },
                            {
                                title: "QR-Based Attendance Tracking",
                                body: "When a user registers for an event, they receive a unique QR code bound to their registration. At the venue, administrators use the built-in QR scanner (powered by html5-qrcode) to scan and instantly verify attendance in real time. This eliminated the manual sign-in sheets entirely, reducing errors and giving admins an auditable attendance log from day one."
                            },
                            {
                                title: "Automated Certificate Generation",
                                body: "Using pdf-lib, the server dynamically generates personalised PDF certificates for event attendees — no manual effort from the team required. Users can view, download, and manage all earned certificates directly from their personal dashboard, creating a tangible, shareable record of their contributions."
                            },
                            {
                                title: "User Profiles & Digital Portfolios",
                                body: "Every member gets a personalised profile with a portfolio section, social media links, and an activity feed. The 'My Dashboard' view gives users a complete picture of their event registrations, authored blog posts, earned certificates, and ongoing club contributions — all in one place."
                            },
                            {
                                title: "Blog Engine & Tech Resource Library",
                                body: "A full-featured publishing system supports rich blog posts with embedded text, images, and video fields. Alongside it, a curated Tech Resources section provides the community with a growing library of tutorials, datasets, tools, and guides. Lazy loading ensures the reading experience stays fast regardless of how large the content library grows."
                            },
                            {
                                title: "Community & Club Ecosystem",
                                body: "Beyond events and blogs, the platform hosts a dynamic Photo Gallery with categorised albums, a Projects Showcase for member-built work, a structured Alumni Directory bridging current students with past graduates, and a formal Membership Application pipeline that streamlines onboarding for prospective members."
                            },
                            {
                                title: "Comprehensive Admin Dashboard",
                                body: "A centralised command centre gives administrators full visibility and control over the platform. From a single interface, admins can manage user accounts, oversee event registrations, moderate blog content, curate the gallery, track activity logs, and maintain the team directory — eliminating the need for any external tools."
                            },
                        ].map(({ title, body }) => (
                            <div key={title}>
                                <h4 className="font-sans text-lg font-semibold mb-3 text-white">{title}</h4>
                                <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Outcome ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Outcome & Learning
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed mb-5 text-justify">
                        DS Club Official became the operational backbone of the club — a real system that real people depend on.
                        It represents a complete, end-to-end software development lifecycle: from database schema design and
                        normalisation, through secure authentication architecture, to dynamic UI and server-side document automation.
                    </p>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">
                        Building this platform deepened my expertise in full-stack TypeScript, monorepo architecture, and production
                        security patterns. More than anything, it taught me the difference between code that works in a demo and
                        software that a community trusts — the discipline of reliability, auditability, and thoughtful design at every layer.
                    </p>
                </section>

            </div>
        ),
        liveUrl: "https://www.gietdsclub.me/",
        sourceUrl: "https://github.com/riteshkumarlenka2005/DS_ClubOfficial"
    },
    {
        id: 2,
        title: "Room Finder Platform",
        era: "2nd Year · Real-World Deployment",
        context: "Finding suitable accommodation or domestic help in Indian cities remains a challenge. Existing platforms are often cluttered, unreliable, or fail to understand local preferences and constraints.",
        coreIdea: "A streamlined platform connecting room seekers with landlords and domestic help providers. Search functionality respects locality, comfort requirements, and personal preferences—delivering relevant results without noise.",
        implementation: "The full-stack application features location-based search, preference filtering, and a verification system for listings. Deployed and maintained for real users, handling actual transactions and building genuine community utility.",
        outcome: "Unlike academic projects, this platform serves real people with real needs. It taught the difference between working code and deployed systems—the importance of reliability, user experience, and responsive maintenance.",
        tags: ["Next.js 15", "React", "Prisma ORM", "MySQL", "Supabase Auth", "Tailwind CSS", "Shadcn UI", "Deployed Product"],
        richSections: (
            <div className="space-y-14">

                {/* ── Overview ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Project Overview
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">
                        The Room Finder Platform is a fully responsive, two-sided marketplace designed to bridge the gap between property owners and tenants in Indian cities. More than just a real estate listing site, it also integrates a unique module for finding verified domestic help (Maushi Services), addressing a critical daily need for students and working professionals.
                    </p>
                </section>

                {/* ── Problem ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        The Problem
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed mb-5 text-justify">
                        Urban migration for education and work has created a chaotic, unorganized rental market. Students and professionals struggle with transparency, while landlords deal with high vacancy periods.
                    </p>
                    <ul className="space-y-3 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                        {[
                            "Brokerage fees are exorbitant, and existing platforms are heavily cluttered with fake listings.",
                            "Information regarding exact amenities, localized rules, and pricing is often hidden until the last minute.",
                            "Once a room is found, sourcing reliable, verified domestic help is entirely dependent on word-of-mouth.",
                            "Property owners lack a simple, unified dashboard to manage multiple rooms or beds simultaneously."
                        ].map((point, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── Architecture & Tech Stack ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Architecture & Technology Stack
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed mb-7 text-justify">
                        This application was built embracing modern Server-Side Rendering (SSR) paradigms, ensuring blazing fast load times and excellent SEO out of the box.
                    </p>

                    <div className="space-y-7">
                        {/* Frontend */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">Frontend</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "Framework", value: "Next.js 15 (App Router) for hybrid static & server rendering." },
                                    { label: "UI Components", value: "Shadcn UI layered over Radix UI primitives for high accessibility and complete styling control." },
                                    { label: "Styling", value: "Tailwind CSS for a fluid, mobile-first responsive design." },
                                    { label: "Forms", value: "React Hook Form combined with Zod for strict, type-safe client and server validation." },
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Backend */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">Backend & Database</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "API Layer", value: "Next.js Route Handlers enabling secure, serverless backend logic." },
                                    { label: "Database", value: "MySQL managed and queried efficiently via Prisma ORM." },
                                    { label: "Authentication", value: "Supabase Auth integrated with SSR tools for robust session management and email verification." },
                                    { label: "Document Gen", value: "Custom PDF generator routines for automated agreements and receipts." },
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── Key Features ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Key Features & Engineering Highlights
                    </h3>

                    <div className="space-y-8">
                        {[
                            {
                                title: "Advanced Search & Preference Filtering",
                                body: "The platform provides a highly dynamic search interface. Users can filter properties by exact location, property type (PG, Apartment, Room), price thresholds, and specific amenities. The filtering happens with minimal latency, ensuring a frictionless discovery process."
                            },
                            {
                                title: "Property Owner Command Center",
                                body: "Property owners have access to a dedicated dashboard. From here, they can easily post new ads with image uploads, toggle availability, edit details, and track inquiries. It abstracts the complexity of property management into a clean, intuitive interface."
                            },
                            {
                                title: "Integrated 'Maushi' (Helper) Services",
                                body: "Recognizing a unique local need, the platform includes a directory for domestic helpers. Users can browse profiles, check verified skills, and connect directly with cooks and caretakers, transforming the application from a mere real estate tool into a holistic living solution."
                            },
                            {
                                title: "Bulletproof Authentication Flows",
                                body: "Leveraged Supabase to implement a secure authentication architecture supporting role-based logins (Owner vs Student/Tenant), complete with forgot password flows, secure email verification, and protected server-side routes."
                            }
                        ].map(({ title, body }) => (
                            <div key={title}>
                                <h4 className="font-sans text-lg font-semibold mb-3 text-white">{title}</h4>
                                <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Outcome ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Outcome & Learning
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">
                        Unlike academic exercises, Room Finder was built for actual deployment. Managing the complexities of a two-sided marketplace taught me invaluable lessons in data modeling with Prisma, the nuances of Next.js Server Components, and the critical importance of a mobile-first UI approach using Shadcn and Tailwind. It reinforced that successful software isn't just about elegant code—it's about understanding the user's exact pain points.
                    </p>
                </section>

            </div>
        ),
        liveUrl: "https://room-finder-kappa.vercel.app/",
        sourceUrl: "https://github.com/riteshkumarlenka2005/RoomFinder"
    },
    {
        id: 3,
        title: "CyberGuardian AI",
        era: "2nd Year · Adversarial AI & Psychology",
        context: "Cybersecurity awareness training often fails because it's abstract and non-threatening. Real scammers succeed through emotional manipulation—fear, urgency, greed. Traditional education doesn't prepare people for these psychological pressures.",
        coreIdea: "An AI system that simulates realistic scammer behavior, employing the same emotional manipulation tactics used by actual fraudsters. When users fall for the simulation, the AI pauses to educate—transforming failure into a learning moment.",
        implementation: "The conversational AI uses emotion-detection and psychological modeling to craft convincing scam scenarios. Response analysis determines user vulnerability. Upon detecting potential capitulation, the system breaks character and provides targeted awareness training.",
        outcome: "This project explored the ethical edges of AI—using deceptive techniques for educational purposes. It deepened my understanding of human psychology, conversational AI, and the responsibility of building systems that influence behavior.",
        tags: ["React 19", "FastAPI", "PostgreSQL", "Redis", "OpenRouter API", "Tailwind CSS"],
        richSections: (
            <div className="space-y-14">

                {/* ── Overview ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Project Overview
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">
                        <strong>CyberGuardian AI</strong> transforms digital safety education into an active, immersive learning experience. Instead of traditional warning-based education, the platform simulates realistic scam scenarios in a controlled, risk-free environment. It allows users to experience how digital manipulation unfolds step-by-step, providing real-time interventions and explanations to build practical resilience against cyber threats.
                    </p>
                </section>

                {/* ── Core Features ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Core Features & Functionality
                    </h3>

                    <div className="space-y-8">
                        {[
                            {
                                title: "Immersive Scam Simulations",
                                body: "Generates realistic interactions for common fraud vectors including Bank Fraud, Job Offer Scams, Government Impersonation, and Relative Emergencies. The system dynamically adapts the attacker's approach and the mentor's communication style based on the user's demographic profile (e.g., Student, Senior Citizen, Job Seeker, Teenager)."
                            },
                            {
                                title: "Intelligent AI Mentor System",
                                body: "Automatically detects risky user responses and pauses the simulation to provide immediate, contextual guidance. It deconstructs the specific psychological manipulation techniques (e.g., false urgency, authority bias) the 'attacker' is using and provides step-by-step guidance on how to safely verify the interaction."
                            },
                            {
                                title: "Advanced Risk Detection Engine",
                                body: "Continuously evaluates user messages against known vulnerability patterns via behavioral analysis. It seamlessly manages state transitions between SIMULATOR (attacker role) and MENTOR (educational role) based on detected risk levels."
                            },
                            {
                                title: "Comprehensive Progress Tracking",
                                body: "Features an analytics dashboard that tracks learning metrics, successful scam evasions, and areas of vulnerability, utilizing responsive charts to visualize user improvement over time."
                            }
                        ].map(({ title, body }) => (
                            <div key={title}>
                                <h4 className="font-sans text-lg font-semibold mb-3 text-white">{title}</h4>
                                <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Architecture & Tech Stack ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Technical Architecture & Stack
                    </h3>

                    <div className="space-y-7 mt-5">
                        {/* Frontend */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">Frontend (Client-Side)</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "Framework", value: "React 19 with TypeScript for robust, type-safe UI components." },
                                    { label: "Build Tool & Styling", value: "Vite for optimized builds, and Tailwind CSS for a highly responsive, modern UI with full Dark/Light theme support." },
                                    { label: "State & Data", value: "React Router DOM for navigation and Recharts for dynamic rendering of user progress." }
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Backend */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">Backend (Server-Side)</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "Framework", value: "Python with FastAPI for high-performance, asynchronous REST API endpoints." },
                                    { label: "Database Architecture", value: "PostgreSQL (managed via asyncpg and SQLAlchemy) with Alembic for automated schema migrations." },
                                    { label: "Caching & Auth", value: "Redis integration for high-speed sessions, and custom OAuth flows utilizing Authlib." }
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* AI & ML */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">AI & Machine Learning Infrastructure</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "LLM Integration", value: "OpenRouter API orchestration powering both the adversarial simulation and the mentor guidance." },
                                    { label: "Prompt Engineering Engine", value: "Sophisticated prompt builders that dynamically inject persona contexts, scam variables, and age-appropriate constraints." }
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── Engineering Highlights ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Engineering Highlights & Value
                    </h3>
                    <ul className="space-y-3 font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify mb-6">
                        {[
                            "Designed a complex, multi-agent conversational flow that reliably switches context between an adversarial scammer and an educational mentor without breaking character or hallucinating.",
                            "Built a fully asynchronous FastAPI backend capable of handling multiple concurrent real-time simulation streams.",
                            "Implemented robust session handling and user data protection measures, critical for a cybersecurity-focused application."
                        ].map((point, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">
                        CyberGuardian AI bridges the gap between theoretical cybersecurity knowledge and practical application. By allowing users to safely "fail" in a simulated environment, the platform effectively inoculates them against modern social engineering tactics, drastically reducing the likelihood of real-world financial or data loss.
                    </p>
                </section>

            </div>
        ),
        liveUrl: "https://www.cyberguardianai.tech/",
        sourceUrl: "https://github.com/riteshkumarlenka2005/CyberGuardianAI"
    },
    {
        id: 4,
        title: "Holistic Interview Intelligence",
        era: "2nd Year · Multimodal AI",
        context: "Interview success depends not just on knowledge, but on presentation—confidence, clarity, emotional regulation. Traditional preparation focuses on content while ignoring the crucial non-verbal dimensions that often determine outcomes.",
        coreIdea: "A multimodal AI system that analyzes both verbal and non-verbal interview performance. Real-time facial analysis detects confidence, nervousness, and emotional states. Parallel speech analysis evaluates clarity, rate, and accuracy.",
        implementation: "Computer vision models process webcam feeds for facial expression analysis. Speech recognition and NLP pipelines evaluate verbal responses. The fusion layer synthesizes these modalities into coherent feedback, identifying specific improvement areas with actionable recommendations.",
        outcome: "This platform represents the culmination of my AI journey so far—integrating computer vision, speech processing, and behavioral analysis. It directly serves student placement readiness, combining technical sophistication with genuine social value.",
        tags: ["React", "FastAPI", "WebRTC", "PostgreSQL", "MediaPipe", "Whisper AI", "Docker", "XAI"],
        richSections: (
            <div className="space-y-14">

                {/* ── Overview ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Project Overview
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">
                        Holistic Interview Intelligence is a comprehensive platform built to help candidates master their interviewing skills. Unlike traditional mock interviews, this system leverages a microservices architecture to provide real-time, multimodal AI analysis during WebRTC-based live interview sessions.
                    </p>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed mt-4 text-justify">
                        The platform evaluates candidates across three core dimensions: <strong>Verbal</strong> (speech rate, fillers, prosody), <strong>Non-Verbal</strong> (gaze direction, posture, facial expressions), and <strong>Multimodal Reasoning</strong> (congruence between speech and body language). It generates deeply insightful post-session reports, incorporating Explainable AI (XAI) to ensure users understand precisely why a specific score or recommendation was given.
                    </p>
                </section>

                {/* ── Architecture & Tech Stack ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Architecture & Technology Stack
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed mb-7 text-justify">
                        The platform is designed as a scalable, distributed system using microservices, ensuring high availability for compute-intensive AI operations.
                    </p>

                    <div className="space-y-7">
                        {/* Frontend */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">Frontend Layer (Client-Side)</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "Framework", value: "React embedded within an Astro shell for optimal performance and SEO." },
                                    { label: "Styling & UI", value: "Tailwind CSS, Radix UI, Framer Motion for micro-animations, and Recharts for data visualization." },
                                    { label: "Real-Time Rendering", value: "Three.js and custom WebRTC hooks to render live AI insights over the video feed." }
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Backend */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">Backend Services (Core API)</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "Framework", value: "FastAPI (Python) for high-performance, asynchronous API endpoints." },
                                    { label: "Database Layer", value: "PostgreSQL via SQLAlchemy and AsyncPG for relational data, managed with Alembic." },
                                    { label: "Caching & Async Tasks", value: "Redis and Celery for queueing intensive AI processing jobs asynchronously." },
                                    { label: "Security", value: "OAuth2, JWT with Python-Jose, and bcrypt hashing." }
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* AI Microservices */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">AI Processing Microservices</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "Speech Analysis", value: "OpenAI Whisper (faster-whisper), Librosa, and Transformers for transcription, prosody mapping, and filler-word detection." },
                                    { label: "Vision & Behavioral Analysis", value: "MediaPipe, OpenCV, and TensorFlow for facial landmark tracking, gaze detection, and posture assessment." },
                                    { label: "Multimodal Fusion", value: "GPT-4 and Google Generative AI for synthesizing verbal and non-verbal data into cohesive 'authenticity' and 'congruence' scores." },
                                    { label: "Explainability (XAI)", value: "SHAP and LIME to generate human-readable explanations for AI-derived metrics." }
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Realtime & DevOps */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">Realtime Infrastructure & DevOps</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "WebRTC & WebSockets", value: "Custom signaling server and media router handling peer-to-peer and client-server low-latency video streaming." },
                                    { label: "Infrastructure", value: "Docker, Kubernetes (K8s) manifests, Terraform, and GitHub Actions for CI/CD." }
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── Key Features ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Key Features & Engineering Highlights
                    </h3>

                    <div className="space-y-8">
                        {[
                            {
                                title: "Real-Time Multimodal AI Analysis",
                                body: "Simultaneously processes audio and video feeds to track gaze, posture, speech rate, and emotional congruence in real time during the WebRTC live session."
                            },
                            {
                                title: "Explainable AI (XAI) Feedback",
                                body: "Utilizes models like SHAP/LIME to provide transparent reasoning behind confidence scores and communication metrics, ensuring actionable and trustworthy feedback."
                            },
                            {
                                title: "Comprehensive Assessment Reports",
                                body: "Deep-dive analytics that break down performance into specific metrics (e.g., filler word rate, eye contact percentage, dominant posture) with AI synthesizing all metrics to output distinct strengths, areas for improvement, and actionable tips."
                            },
                            {
                                title: "Progress Tracking & Growth",
                                body: "Aggregates historical data to visualize a candidate's improvement trajectory over time across behavioral, technical, and HR interview types."
                            }
                        ].map(({ title, body }) => (
                            <div key={title}>
                                <h4 className="font-sans text-lg font-semibold mb-3 text-white">{title}</h4>
                                <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Outcome ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Outcome & Learning
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">
                        Holistic Interview Intelligence goes far beyond simple LLM wrapper applications. It integrates complex computer vision and audio processing pipelines via WebRTC in real-time, orchestrated across a microservices architecture. The inclusion of Explainable AI (XAI) addresses the critical issue of "black box" AI, making it a robust, production-ready, and user-centric platform for professional development.
                    </p>
                </section>

            </div>
        ),
        liveUrl: "https://www.vivasense.app/",
        sourceUrl: "https://github.com/riteshkumarlenka2005/Holistic-Interview-Intelligence"
    },
    {
        id: 5,
        title: "TaskManager",
        era: "2nd Year · Productivity & Cloud",
        context: "TaskManager is a modern, all-in-one productivity platform designed to help users organize their daily workflow with clarity and efficiency. Built with a clean, minimal, and high-performance design philosophy.",
        coreIdea: "Combining smart task management, seamless note-taking, and secure cloud synchronization into a single, intuitive interface. It allows users to manage tasks, capture ideas, and access their data anytime, anywhere.",
        implementation: "Developed with a focus on speed and distraction-free productivity. The platform integrates a robust backend for secure data synchronization across devices, paired with a sleek, responsive frontend for an optimal user experience.",
        outcome: "An ideal solution for students, developers, and professionals who want to simplify their work. The project showcases my ability to build utility-focused applications that bridge the gap between complex functionality and user-friendly design.",
        tags: ["React 19", "Spring Boot", "PostgreSQL", "Java 17", "Tailwind CSS"],
        richSections: (
            <div className="space-y-14">

                {/* ── Overview ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Project Overview
                    </h3>
                    <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">
                        <strong>TaskManager</strong> is a comprehensive, production-ready Full-Stack application designed to streamline personal productivity. It combines advanced task management with a Notion-style block document editor and a custom HTML5 canvas drawing engine. The project features a responsive React web client, a robust Java Spring Boot REST API, and a dedicated native Android wrapper app, ensuring a seamless experience across desktop and mobile devices.
                    </p>
                </section>

                {/* ── Core Features ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Core Features & Functionality
                    </h3>

                    <div className="space-y-8">
                        {[
                            {
                                title: "Secure Authentication & Authorization",
                                body: "Robust user registration and login system with passwords securely hashed before database storage. The stateless REST API is secured by Bearer JWT tokens, ensuring fast and scalable authentication across all endpoints."
                            },
                            {
                                title: "Advanced Task Management",
                                body: "Full CRUD operations for tasks supporting customizable priorities and dynamic status tracking. Includes an interactive Dashboard providing a high-level overview of pending and completed workflows."
                            },
                            {
                                title: "Notion-Style Document Editor",
                                body: "Features a block-based architecture allowing users to create modular documents using various blocks (Text, Headings, Images, Tables, Checklists, Code snippets, Quotes, Callouts, and embedded Media). Supports Drag-and-Drop block reordering, 'slash' commands (/), auto-saving, and one-click export to HTML or PDF."
                            },
                            {
                                title: "Integrated HTML5 Canvas Drawing",
                                body: "A fully functional, zero-dependency canvas drawing application integrated directly into the web client featuring Pen, Pencil, Eraser with customizable brush sizes, interactive color picker, history tracking (Undo), and direct-to-PNG downloading."
                            },
                            {
                                title: "Dedicated Mobile Experience",
                                body: "The React application includes a dedicated /mobile routing tree featuring highly optimized components. The native Android app loads this specific UI, providing a native look-and-feel while maintaining a single unified codebase for the frontend logic."
                            }
                        ].map(({ title, body }) => (
                            <div key={title}>
                                <h4 className="font-sans text-lg font-semibold mb-3 text-white">{title}</h4>
                                <p className="font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify">{body}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Architecture & Tech Stack ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Technical Architecture & Stack
                    </h3>

                    <div className="space-y-7 mt-5">
                        {/* Frontend */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">Frontend (Web Client)</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "Framework & Styling", value: "React 19 with TypeScript, powered by Vite. Tailwind CSS (v4) with custom Glassmorphism and Cyber-themed aesthetics." },
                                    { label: "State, Routing & Animation", value: "Context API, React Router v7 with protected routes, and Framer Motion for fluid micro-animations and transitions." },
                                    { label: "Rich Editor & Utilities", value: "Tiptap Headless Editor for block editing. html2canvas & jsPDF for PDF generation, Axios for API integration." }
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Backend */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">Backend (REST API)</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "Framework", value: "Java 17, Spring Boot 3.2.0." },
                                    { label: "Database & ORM", value: "PostgreSQL deployed via Neon Serverless DB, utilizing Spring Data JPA with Hibernate." },
                                    { label: "Security & Deployment", value: "Spring Security with stateless JWT authentication. Multi-stage Dockerfile optimized for Render deployment." }
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Mobile App */}
                        <div>
                            <h4 className="font-sans text-xs uppercase tracking-widest text-gray-500 mb-3">Mobile App (Android)</h4>
                            <ul className="space-y-2 font-sans text-lg md:text-xl text-gray-300 leading-relaxed">
                                {[
                                    { label: "Framework & Architecture", value: "Native Android (Java SDK 34). Customized immersive WebView wrapper acting as a secure shell for the React PWA." },
                                    { label: "Features", value: "Hardware-accelerated rendering, immersive fullscreen mode, Swipe-to-Refresh UI, and an Offline Fallback Activity." }
                                ].map(({ label, value }) => (
                                    <li key={label} className="flex items-start gap-3">
                                        <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                        <span><strong>{label}:</strong> {value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* ── Architectural Highlights & Deployment ── */}
                <section>
                    <h3 className="font-sans text-lg font-bold mb-4 flex items-center gap-3 text-white">
                        <span className="text-amber-500/60">§</span>
                        Architectural Highlights & Deployment
                    </h3>
                    <ul className="space-y-3 font-sans text-lg md:text-xl text-gray-300 leading-relaxed text-justify mb-6">
                        {[
                            "Layered Backend Design: The Spring Boot API strictly follows a Controller-Service-Repository pattern, ensuring clean separation of business logic, data access, and API routing.",
                            "DTO Pattern: Utilizes Data Transfer Objects with jakarta.validation to validate incoming client payloads securely before they reach the database layer.",
                            "Cross-Platform Delivery: Achieves cross-platform presence by pairing a responsive React web app with a lightweight Native Android WebView, eliminating the overhead of React Native or Flutter.",
                            "Deployment Strategy: Frontend deployed on Vercel, Backend containerized via Docker on Render, and Database hosted on Neon serverless PostgreSQL."
                        ].map((point, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="mt-[6px] shrink-0 w-1.5 h-1.5 rounded-full bg-amber-700/50 dark:bg-amber-600/50" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </section>

            </div>
        ),
        liveUrl: "https://task-manager-java.vercel.app/",
        sourceUrl: "https://github.com/riteshkumarlenka2005/TaskManager-JAVA-"
    }
];

export const ProjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    const projectId = parseInt(id || '1', 10);
    const project = PROJECTS.find(p => p.id === projectId);

    useEffect(() => {
        window.scrollTo(0, 0);
        const timer = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!project) {
        return (
            <div className="min-h-screen bg-parchment-100 dark:bg-antique-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-display text-4xl mb-4">Project Not Found</h1>
                    <Link to="/" className="font-serif text-amber-700 dark:text-amber-600 hover:underline">
                        Return to Archive
                    </Link>
                </div>
            </div>
        );
    }

    const prevProject = PROJECTS.find(p => p.id === projectId - 1);
    const nextProject = PROJECTS.find(p => p.id === projectId + 1);

    return (
        <div className="min-h-screen bg-parchment-100 dark:bg-antique-50 text-parchment-900 dark:text-antique-800 transition-colors duration-500">



            {/* Hero Section */}
            <header className={`
                relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 md:px-12
                transition-all duration-1000 ease-out
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}>
                {/* Background number */}
                <div className="absolute top-20 right-8 md:right-20 font-display text-[12rem] md:text-[20rem] leading-none text-parchment-300/20 dark:text-antique-200/10 pointer-events-none select-none">
                    {String(project.id).padStart(2, '0')}
                </div>

                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Back link */}
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-3 font-serif text-sm hover:opacity-100 hover:text-amber-700 dark:hover:text-amber-600 transition-all duration-300 mb-8"
                    >
                        <span>←</span>
                        <span>Back to Archive</span>
                    </button>

                    {/* Era badge */}
                    <div className="flex items-center gap-4 mb-6 opacity-60">
                        <div className="h-[1px] w-12 bg-current" />
                        <span className="font-serif italic text-sm tracking-widest">{project.era}</span>
                    </div>

                    {/* Title */}
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-parchment-900 dark:text-antique-900 mb-8">
                        {project.title}
                    </h1>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-3 mb-10">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-2 font-serif text-sm tracking-wide border border-parchment-400/40 dark:border-antique-200/30 text-parchment-800 dark:text-antique-800"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-8">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 text-amber-800 dark:text-amber-500 hover:text-amber-600 transition-colors"
                            >
                                <span className="font-serif italic text-lg border-b border-amber-800/30 dark:border-amber-500/30 leading-none pb-1">Live Project →</span>
                            </a>
                        )}
                        {project.sourceUrl && (
                            <a
                                href={project.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 text-amber-800 dark:text-amber-500 hover:text-amber-600 transition-colors"
                            >
                                <span className="font-serif italic text-lg border-b border-amber-800/30 dark:border-amber-500/30 leading-none pb-1">Source Code →</span>
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* Content Sections */}
            <main className={`
                max-w-5xl mx-auto px-6 md:px-12 pb-32
                transition-all duration-1000 delay-200 ease-out
                ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}>
                {/* Rich sections override the default 2-column grid */}
                {project.richSections ? (
                    <div>{project.richSections}</div>
                ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
                    {/* Left Column */}
                    <div className="space-y-16">
                        {/* Context */}
                        <section>
                            <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-3">
                                <span className="text-amber-700/50 dark:text-amber-600/50">§</span>
                                Context & Motivation
                            </h2>
                            <p className="font-serif text-lg leading-relaxed opacity-85 text-justify">
                                {project.context}
                            </p>
                        </section>

                        {/* Core Idea */}
                        <section>
                            <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-3">
                                <span className="text-amber-700/50 dark:text-amber-600/50">§</span>
                                Core Idea & Logic
                            </h2>
                            <p className="font-serif text-lg leading-relaxed opacity-85 text-justify">
                                {project.coreIdea}
                            </p>
                        </section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-16">
                        {/* Implementation */}
                        <section>
                            <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-3">
                                <span className="text-amber-700/50 dark:text-amber-600/50">§</span>
                                Implementation
                            </h2>
                            <p className="font-serif text-lg leading-relaxed opacity-85 text-justify">
                                {project.implementation}
                            </p>
                        </section>

                        {/* Outcome */}
                        <section>
                            <h2 className="font-display text-xl font-semibold mb-6 flex items-center gap-3">
                                <span className="text-amber-700/50 dark:text-amber-600/50">§</span>
                                Outcome & Learning
                            </h2>
                            <p className="font-serif text-lg leading-relaxed opacity-85 text-justify">
                                {project.outcome}
                            </p>
                        </section>
                    </div>
                </div>
                )}
            </main>

            {/* Navigation */}
            <nav className={`
                border-t border-parchment-400/20 dark:border-antique-200/10
                transition-all duration-1000 delay-400 ease-out
                ${visible ? 'opacity-100' : 'opacity-0'}
            `}>
                <div className="max-w-5xl mx-auto px-6 md:px-12 py-12">
                    <div className="flex justify-between items-center">
                        {/* Previous */}
                        {prevProject ? (
                            <Link
                                to={`/project/${prevProject.id}`}
                                className="group flex items-center gap-4 hover:text-amber-700 dark:hover:text-amber-600 transition-colors duration-300"
                            >
                                <span className="transform group-hover:-translate-x-2 transition-transform duration-300">←</span>
                                <div className="text-right">
                                    <span className="block font-serif text-xs uppercase tracking-widest">Previous</span>
                                    <span className="font-display text-lg">{prevProject.title}</span>
                                </div>
                            </Link>
                        ) : (
                            <div />
                        )}

                        {/* Next */}
                        {nextProject ? (
                            <Link
                                to={`/project/${nextProject.id}`}
                                className="group flex items-center gap-4 hover:text-amber-700 dark:hover:text-amber-600 transition-colors duration-300"
                            >
                                <div className="text-left">
                                    <span className="block font-serif text-xs uppercase tracking-widest">Next</span>
                                    <span className="font-display text-lg">{nextProject.title}</span>
                                </div>
                                <span className="transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </Link>
                        ) : (
                            <div />
                        )}
                    </div>
                </div>
            </nav>

            <InteractiveFooter />

            {/* Decorative Line */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-900/10 to-transparent pointer-events-none z-50" />
        </div>
    );
};
