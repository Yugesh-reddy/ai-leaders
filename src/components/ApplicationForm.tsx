
import React from 'react';

const ApplicationForm: React.FC = () => {
    return (
        <section id="apply" className="py-24 bg-zinc-950">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Apply Now</h2>
                    <p className="text-gray-400">Take the first step towards your new career. Applications are reviewed on a rolling basis.</p>
                </div>

                <form className="space-y-8 bg-black border border-white/10 p-8 md:p-10 rounded-2xl shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="firstName" className="text-sm font-medium text-gray-300">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                                placeholder="Jane"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="lastName" className="text-sm font-medium text-gray-300">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-300">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                            placeholder="jane@example.com"
                        />
                    </div>

                    <div className="space-y-6 pt-4 border-t border-white/5">
                        <h3 className="text-xl font-bold text-white mb-4">AI Literacy Assessment</h3>
                        <p className="text-sm text-gray-500 mb-6">Based on the Student Agency Metrics of the AI Innovation Framework. Please rate your current understanding.</p>

                        {[
                            { id: 'impact', label: "Understanding AI's Impact", description: "I understand how AI can be both helpful and harmful to me and others." },
                            { id: 'design', label: "Understanding AI's Design", description: "I understand how AI systems work, including how they use data, patterns, and make predictions." },
                            { id: 'skills', label: "Skilled Use of AI", description: "I have strategies for effectively using AI tools (writing prompts, improving output, evaluating accuracy)." },
                            { id: 'agency', label: "AI Agency", description: "I know how to design and build with AI to address real-world challenges." }
                        ].map((metric) => (
                            <div key={metric.id} className="space-y-3">
                                <label className="text-sm font-medium text-gray-300 block">{metric.label}</label>
                                <p className="text-xs text-gray-500 italic mb-2">{metric.description}</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                        <label key={level} className="flex items-center justify-center p-2 rounded border border-zinc-800 hover:bg-zinc-900 cursor-pointer transition-colors has-[:checked]:bg-white has-[:checked]:text-black has-[:checked]:border-white has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-black">
                                            <input type="radio" name={metric.id} value={level} className="sr-only" />
                                            <span className="text-xs font-medium uppercase tracking-wider">{level}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 pt-4 border-t border-white/5">
                        <label htmlFor="wordpress" className="text-sm font-medium text-gray-300">WordPress Familiarity</label>
                        <textarea
                            id="wordpress"
                            rows={3}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                            placeholder="Describe your experience with WordPress (e.g., used it for a blog, built professional sites, none)..."
                        ></textarea>
                    </div>

                    <p className="text-xs text-center text-gray-500 italic">
                        By submitting, you agree to the selection process described in the FAQ.
                    </p>

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors mt-4 text-sm tracking-wide uppercase shadow-lg shadow-white/5"
                    >
                        Submit Application
                    </button>
                </form>
            </div>
        </section>
    );
};

export default ApplicationForm;
