import React, { useEffect, useState } from 'react';
import { InteractiveFooter } from '../components/InteractiveFooter';

export const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ fullName: '', email: '', phone: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-amber-500/30">
            {/* Main Content */}
            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-12 pt-28 md:pt-32 lg:pt-40 pb-16 md:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

                    {/* Left Column: Text & Info */}
                    <div className="flex flex-col lg:pt-8">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tighter mb-5 md:mb-6 text-white uppercase leading-none">
                            Contact me
                        </h1>
                        <p className="text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed max-w-md mb-8 md:mb-12">
                            Feel free to reach out for collaborations, freelance projects, or just to say hello. I am currently available for new opportunities.
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
                                    <div className="font-bold italic text-xl md:text-3xl font-sans tracking-tight">I'd love to hear from you.</div>
                                </div>
                            </div>

                            {/* Inner Card */}
                            <div className="bg-[#0a0a0a] rounded-[1.75rem] md:rounded-[2.25rem] p-5 sm:p-6 md:p-8 lg:p-10 shadow-inner">
                                {submitted ? (
                                    <div className="flex flex-col items-center justify-center text-center h-[500px]">
                                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-4xl mb-6">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">Message Sent!</h3>
                                        <p className="text-gray-400 mb-8 max-w-sm mx-auto">
                                            Thanks for reaching out. I'll get back to you as soon as possible.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="bg-[#2a2a2a] hover:bg-[#333] text-white px-6 py-3 rounded-xl transition-colors font-medium"
                                        >
                                            Send Another Message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                                            {/* Full Name */}
                                            <div>
                                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1.5">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text" id="fullName" name="fullName" required
                                                    value={formData.fullName} onChange={handleInputChange}
                                                    className="w-full bg-[#1e1e1e] border border-transparent focus:border-gray-600 focus:bg-[#252525] text-white rounded-2xl px-4 py-3 focus:outline-none transition-colors placeholder:text-gray-600 text-sm md:text-base"
                                                    placeholder="Enter Full Name"
                                                />
                                            </div>

                                            {/* Email Address */}
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                                                    Email
                                                </label>
                                                <input
                                                    type="email" id="email" name="email" required
                                                    value={formData.email} onChange={handleInputChange}
                                                    className="w-full bg-[#1e1e1e] border border-transparent focus:border-gray-600 focus:bg-[#252525] text-white rounded-2xl px-4 py-3 focus:outline-none transition-colors placeholder:text-gray-600 text-sm md:text-base"
                                                    placeholder="Enter Email"
                                                />
                                            </div>
                                        </div>

                                        {/* Phone Number */}
                                        <div>
                                            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1.5">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel" id="phone" name="phone"
                                                value={formData.phone} onChange={handleInputChange}
                                                className="w-full bg-[#1e1e1e] border border-transparent focus:border-gray-600 focus:bg-[#252525] text-white rounded-2xl px-4 py-3 focus:outline-none transition-colors placeholder:text-gray-600 text-sm md:text-base"
                                                placeholder="Enter Phone Number"
                                            />
                                        </div>

                                        {/* Message */}
                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1.5">
                                                Message
                                            </label>
                                            <textarea
                                                id="message" name="message" required rows={3}
                                                value={formData.message} onChange={handleInputChange}
                                                className="w-full bg-[#1e1e1e] border border-transparent focus:border-gray-600 focus:bg-[#252525] text-white rounded-2xl px-4 py-3 focus:outline-none transition-colors resize-none placeholder:text-gray-600 text-sm md:text-base"
                                                placeholder="Write Your Message"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-white hover:bg-gray-200 text-black px-8 py-3.5 rounded-full font-semibold transition-colors flex items-center justify-center w-full md:w-auto gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? 'Sending...' : 'Send Message'}
                                                {!isSubmitting && (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}


                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <InteractiveFooter />
        </div>
    );
};
