import React, { useEffect, useState } from 'react';
import { ScrollNavbar } from '../components/ScrollNavbar';
import { HeritageFrame } from '../components/HeritageFrame';

// Social links - customize with your actual links
const SOCIAL_LINKS = [
    { id: 'github', label: 'GitHub', href: 'https://github.com/riteshkumarlenka2005', icon: '◈' },
    { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/ritesh-kumar-lenka-186010320/', icon: '◇' },
    { id: 'twitter', label: 'Twitter/X', href: 'https://twitter.com/ritesh_kumar_lenka', icon: '◆' },
    { id: 'instagram', label: 'Instagram', href: 'https://instagram.com/ritesh_kumar_lenka', icon: '○' },
];

export const ContactPage: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const isReturning = sessionStorage.getItem('hasVisited');
        const delay = isReturning ? 300 : 2200;
        sessionStorage.setItem('hasVisited', 'true');
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission - replace with actual submission logic
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-parchment-100 dark:bg-antique-50 text-parchment-900 dark:text-antique-800 transition-colors duration-500">
            <HeritageFrame />
            <ScrollNavbar />

            {/* Main Content */}
            <main className={`
                max-w-4xl mx-auto px-6 md:px-12 pt-32 pb-20
                transform transition-all duration-1000 delay-100 ease-[cubic-bezier(0.25,1,0.5,1)]
                ${visible ? 'opacity-100 translate-y-0 scale-100 blur-none' : 'opacity-0 translate-y-32 scale-90 blur-md'}
            `}>

                {/* Page Title */}
                <header className="mb-16 border-b border-parchment-400/30 dark:border-antique-200/20 pb-8">
                    <div className="flex items-center gap-4 mb-4 opacity-50">
                        <div className="h-[1px] w-8 bg-current"></div>
                        <span className="font-serif italic text-sm tracking-widest uppercase">Get in Touch</span>
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-wide text-parchment-900 dark:text-antique-900 mb-4">
                        Contact
                    </h1>
                    <p className="font-serif text-lg max-w-2xl leading-relaxed">
                        Whether you have a question, a project proposal, or simply wish to exchange ideas—
                        I welcome thoughtful correspondence. Every message receives careful attention.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-4">
                            <span className="text-amber-700/30 dark:text-amber-600/30 text-4xl font-light">I.</span>
                            Send a Message
                        </h2>

                        {submitted ? (
                            <div className="p-8 border border-amber-700/30 dark:border-amber-600/30 bg-amber-50/30 dark:bg-amber-900/10 text-center">
                                <div className="text-4xl mb-4">✓</div>
                                <h3 className="font-display text-xl mb-2">Message Received</h3>
                                <p className="font-serif">
                                    Thank you for reaching out. I shall respond within a fortnight.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="mt-6 font-serif text-amber-700 dark:text-amber-600 hover:underline"
                                >
                                    Send another message →
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <label htmlFor="name" className="block font-serif text-sm uppercase tracking-wider">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-parchment-200/50 dark:bg-antique-100/50 border border-parchment-400/30 dark:border-antique-200/20 font-serif text-lg focus:outline-none focus:border-amber-700/50 dark:focus:border-amber-600/50 transition-colors duration-300 placeholder:"
                                        placeholder="John Doe"
                                    />
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label htmlFor="email" className="block font-serif text-sm uppercase tracking-wider">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-parchment-200/50 dark:bg-antique-100/50 border border-parchment-400/30 dark:border-antique-200/20 font-serif text-lg focus:outline-none focus:border-amber-700/50 dark:focus:border-amber-600/50 transition-colors duration-300 placeholder:"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                {/* Subject Field */}
                                <div className="space-y-2">
                                    <label htmlFor="subject" className="block font-serif text-sm uppercase tracking-wider">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 bg-parchment-200/50 dark:bg-antique-100/50 border border-parchment-400/30 dark:border-antique-200/20 font-serif text-lg focus:outline-none focus:border-amber-700/50 dark:focus:border-amber-600/50 transition-colors duration-300 placeholder:"
                                        placeholder="Project Inquiry"
                                    />
                                </div>

                                {/* Message Field */}
                                <div className="space-y-2">
                                    <label htmlFor="message" className="block font-serif text-sm uppercase tracking-wider">
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 bg-parchment-200/50 dark:bg-antique-100/50 border border-parchment-400/30 dark:border-antique-200/20 font-serif text-lg focus:outline-none focus:border-amber-700/50 dark:focus:border-amber-600/50 transition-colors duration-300 resize-none placeholder:"
                                        placeholder="Write your message here..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`
                                        w-full py-4 font-display text-lg tracking-wider uppercase
                                        border-2 border-parchment-900 dark:border-antique-800
                                        transition-all duration-500
                                        ${isSubmitting
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-parchment-900 dark:hover:bg-antique-800 hover:text-parchment-100 dark:hover:text-antique-100'
                                        }
                                    `}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                                            Sending...
                                        </span>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Direct Contact */}
                        <div>
                            <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-4">
                                <span className="text-amber-700/30 dark:text-amber-600/30 text-4xl font-light">II.</span>
                                Direct Contact
                            </h2>
                            <div className="space-y-4">
                                <a
                                    href="mailto:lenkariteshkumar2005@gmail.com"
                                    className="group flex items-start gap-3 font-serif text-lg hover:text-amber-700 dark:hover:text-amber-600 transition-colors duration-300"
                                >
                                    <span className="opacity-40 group-hover:opacity-100 transition-opacity">→</span>
                                    <div>
                                        <div className="text-sm uppercase tracking-wider mb-1">Email</div>
                                        <div>lenkariteshkumar2005@gmail.com</div>
                                    </div>
                                </a>
                                <a
                                    href="tel:+918260049064"
                                    className="group flex items-start gap-3 font-serif text-lg hover:text-amber-700 dark:hover:text-amber-600 transition-colors duration-300"
                                >
                                    <span className="opacity-40 group-hover:opacity-100 transition-opacity">→</span>
                                    <div>
                                        <div className="text-sm uppercase tracking-wider mb-1">Phone</div>
                                        <div>+91-8260049064</div>
                                    </div>
                                </a>
                                <a
                                    href="tel:+917847935309"
                                    className="group flex items-start gap-3 font-serif text-lg hover:text-amber-700 dark:hover:text-amber-600 transition-colors duration-300"
                                >
                                    <span className="opacity-40 group-hover:opacity-100 transition-opacity">→</span>
                                    <div>
                                        <div className="text-sm uppercase tracking-wider mb-1">Alternate Phone</div>
                                        <div>+91-7847935309</div>
                                    </div>
                                </a>
                                <div
                                    className="group flex items-start gap-3 font-serif text-lg text-parchment-900/60 dark:text-antique-800/60"
                                >
                                    <span className="opacity-40 transition-opacity">→</span>
                                    <div>
                                        <div className="text-sm uppercase tracking-wider mb-1">Location</div>
                                        <div>Odisha, India</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div>
                            <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-4">
                                <span className="text-amber-700/30 dark:text-amber-600/30 text-3xl font-light">III.</span>
                                Elsewhere
                            </h3>
                            <div className="space-y-3">
                                {SOCIAL_LINKS.map(link => (
                                    <a
                                        key={link.id}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-3 font-serif text-lg hover:text-amber-700 dark:hover:text-amber-600 transition-colors duration-300"
                                    >
                                        <span className="opacity-30 group-hover:opacity-70 transition-opacity">{link.icon}</span>
                                        <span>{link.label}</span>
                                        <span className="opacity-0 group-hover: transition-opacity text-sm">↗</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="p-6 border border-parchment-400/20 dark:border-antique-200/10 bg-parchment-200/30 dark:bg-antique-100/30">
                            <h3 className="font-display text-lg font-semibold mb-3">Current Availability</h3>
                            <p className="font-serif text-base leading-relaxed mb-4">
                                I am currently accepting new projects and collaborations.
                                Response time is typically within 48 hours.
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="font-serif text-sm">Available for work</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Divider */}
                <div className="flex items-center justify-center gap-6 my-16 opacity-30">
                    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-current"></div>
                    <div className="w-2 h-2 rotate-45 border border-current"></div>
                    <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-current"></div>
                </div>

                {/* Location Note */}
                <div className="text-center max-w-2xl mx-auto">
                    <p className="font-serif text-lg italic leading-relaxed">
                        "The best conversations begin with a simple message.
                        I look forward to hearing from you."
                    </p>
                </div>

                {/* Footer Spacer */}
                <div className="h-20"></div>
            </main>

            {/* Subtle Footer Line */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-900/10 to-transparent pointer-events-none"></div>
        </div>
    );
};
