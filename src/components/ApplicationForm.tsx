import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import type { TransparencyStage } from './EvaluationDimensions';
import EvaluationDimensions from './EvaluationDimensions';
import { analyzeApplication } from '../services/ai';
import { sendNotification } from '../services/notifications';

const ApplicationForm: React.FC = () => {
    const [stage, setStage] = useState<TransparencyStage>(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Load attempts from local storage
    const [attempts, setAttempts] = useState(() => {
        const saved = localStorage.getItem('ai_leaders_attempts');
        return saved ? parseInt(saved, 10) : 0;
    });

    useEffect(() => {
        localStorage.setItem('ai_leaders_attempts', attempts.toString());
    }, [attempts]);

    const { executeRecaptcha } = useGoogleReCaptcha();

    const [scores, setScores] = useState<Record<string, number>>({
        curiosity: 0,
        clarity: 0,
        motivation: 0,
        experience: 0
    });
    const [aiFeedback, setAiFeedback] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        linkedin: '',
        affiliation: '',
        affiliationOther: '',
        response: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        // Clear error when user starts typing
        if (errors[id]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Validation
        const newErrors: Record<string, string> = {};
        if (!formData.firstName) newErrors.firstName = "First name is required";
        if (!formData.lastName) newErrors.lastName = "Last name is required";
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!formData.linkedin) {
            newErrors.linkedin = "LinkedIn profile is required";
        } else if (!formData.linkedin.includes('linkedin.com/')) {
            newErrors.linkedin = "Please enter a valid LinkedIn URL";
        }
        if (!formData.affiliation) newErrors.affiliation = "Please select an affiliation";
        if (formData.affiliation === 'Other' && !formData.affiliationOther) {
            newErrors.affiliationOther = "Please specify your organization";
        }
        if (!formData.response) {
            newErrors.response = "Your response is required";
        } else if (formData.response.length < 50) {
            newErrors.response = "Response is too short (min 50 chars)";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            // Scroll to the first error
            const firstErrorId = Object.keys(newErrors)[0];
            const element = document.getElementById(firstErrorId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // 2. Rate Limiting Check
        if (attempts >= 3) {
            alert("You have reached the maximum number of attempts for this session.");
            return;
        }

        // 3. Captcha Check & Token Generation
        if (!executeRecaptcha) {
            console.warn("ReCAPTCHA has not yet loaded. Please try again in a moment.");
            return;
        }

        const token = await executeRecaptcha('application_submit');
        if (!token) {
            alert("Security verification failed. Please try again.");
            return;
        }

        setIsAnalyzing(true);

        try {
            // 4. AI Analysis
            const result = await analyzeApplication(formData.response);

            // Update scores and feedback from AI result
            const newScores = {
                curiosity: result.curiosity,
                clarity: result.clarity,
                motivation: result.motivation,
                experience: result.experience
            };
            setScores(newScores);
            setAiFeedback(result.feedback);

            // Calculate average score
            const averageScore = Object.values(newScores).reduce((a, b) => a + b, 0) / Object.values(newScores).length;

            // Increment attempts
            const newAttempts = attempts + 1;
            setAttempts(newAttempts);

            // Check for immediate pass (90%+)
            if (averageScore >= 90) {
                await sendNotification({
                    ...formData,
                    scores: newScores,
                    status: 'ACCEPTED'
                });
                setStage(3);
                return;
            }

            // Determine Stage based on persistence
            if (newAttempts === 1) {
                setStage(1); // Reveal Explanations
            } else if (newAttempts === 2) {
                setStage(2); // Reveal Full Rubric
            } else if (newAttempts >= 3) {
                // If they fail the 3rd try after guidance
                await sendNotification({
                    ...formData,
                    scores: newScores,
                    status: 'MAX_ATTEMPTS_REACHED'
                });
                // No need for alert, UI will handle it
            }

        } catch (error: any) {
            console.error(error);
            alert(error.message || "An error occurred during analysis. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    if (stage === 3) {
        return (
            <section id="apply" className="py-24 bg-zinc-950 min-h-[80vh] flex items-center justify-center">
                <div className="container mx-auto px-6 max-w-2xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900/50 border border-green-500/30 p-12 rounded-2xl shadow-2xl backdrop-blur-sm"
                    >
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Application Submitted</h2>
                        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                            You've demonstrated the curiosity, persistence, and willingness to improve that defines an AI Leader. We have recorded your submission and will notify you of next steps on March 1, 2026.
                        </p>
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                            <p className="text-green-400 text-sm font-bold">
                                Next Update: March 1, 2026
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>
        );
    }

    if (attempts >= 3) {
        return (
            <section id="apply" className="py-24 bg-zinc-950 min-h-[80vh] flex items-center justify-center">
                <div className="container mx-auto px-6 max-w-2xl text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-zinc-900/50 border border-indigo-500/30 p-12 rounded-2xl shadow-2xl backdrop-blur-sm"
                    >
                        <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Maximum Attempts Reached</h2>
                        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                            We value your effort and persistence. However, you have reached the maximum of 3 attempts for this session. We have recorded your final revision and will review it manually.
                        </p>
                        <p className="text-zinc-500 italic text-sm">
                            Thank you for applying to AI Leaders.
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section id="apply" className="py-24 bg-zinc-950">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Join the Program</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-10">
                        Apply for AI Leaders. We'll notify all applicants of next steps on March 1, 2026.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    {/* Column 1, 2, 3: The Form (Left) */}
                    <div className="lg:col-span-3 order-2 lg:order-1">
                        <form onSubmit={handleSubmit} className="bg-black border border-white/10 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
                            {/* Identity Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div className="space-y-3">
                                    <label htmlFor="firstName" className="text-xs font-black uppercase tracking-widest text-gray-500">First Name</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={`w-full bg-zinc-900 border ${errors.firstName ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium`}
                                        required
                                    />
                                    {errors.firstName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.firstName}</p>}
                                </div>
                                <div className="space-y-3">
                                    <label htmlFor="lastName" className="text-xs font-black uppercase tracking-widest text-gray-500">Last Name</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={`w-full bg-zinc-900 border ${errors.lastName ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium`}
                                        required
                                    />
                                    {errors.lastName && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.lastName}</p>}
                                </div>
                            </div>

                            <div className="space-y-8 mb-10">
                                <div className="space-y-3">
                                    <label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-gray-500">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full bg-zinc-900 border ${errors.email ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium`}
                                        required
                                    />
                                    {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.email}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="linkedin" className="text-xs font-black uppercase tracking-widest text-gray-500">LinkedIn Profile URL</label>
                                    <input
                                        type="url"
                                        id="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleInputChange}
                                        placeholder="https://linkedin.com/in/yourprofile"
                                        className={`w-full bg-zinc-900 border ${errors.linkedin ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium`}
                                        required
                                    />
                                    {errors.linkedin && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.linkedin}</p>}
                                </div>

                                <div className="space-y-3">
                                    <label htmlFor="affiliation" className="text-xs font-black uppercase tracking-widest text-gray-500">Affiliation</label>
                                    <div className="relative group">
                                        <select
                                            id="affiliation"
                                            value={formData.affiliation}
                                            onChange={handleInputChange}
                                            className={`w-full bg-zinc-900 border ${errors.affiliation ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium appearance-none cursor-pointer pr-12 hover:border-zinc-700`}
                                            required
                                        >
                                            <option value="" disabled>Select your affiliation</option>
                                            <option value="University of Illinois Chicago">University of Illinois Chicago</option>
                                            <option value="University of Louisiana at Lafayette">University of Louisiana at Lafayette</option>
                                            <option value="Louisiana Tech University">Louisiana Tech University</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-hover:text-zinc-300 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.affiliation && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.affiliation}</p>}
                                </div>
                            </div>

                            <AnimatePresence>
                                {formData.affiliation === 'Other' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-3"
                                    >
                                        <label htmlFor="affiliationOther" className="text-xs font-black uppercase tracking-widest text-gray-500">Please Specify</label>
                                        <input
                                            type="text"
                                            id="affiliationOther"
                                            value={formData.affiliationOther}
                                            onChange={handleInputChange}
                                            placeholder="Enter your organization or university"
                                            className={`w-full bg-zinc-900 border ${errors.affiliationOther ? 'border-red-500' : 'border-zinc-800'} rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-medium`}
                                            required
                                        />
                                        {errors.affiliationOther && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.affiliationOther}</p>}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-6 mt-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-none px-3 py-1 bg-zinc-800 rounded text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                            Application Task
                                        </div>
                                        <div className="flex-grow h-px bg-white/5" />
                                        <span className="shrink-0 text-[10px] font-black uppercase tracking-widest text-green-400 border border-green-500/20 px-3 py-1 rounded-full bg-green-500/5">
                                            AI Usage Encouraged
                                        </span>
                                    </div>
                                    <p className="text-xl md:text-2xl font-light text-white leading-relaxed max-w-2xl">
                                        Describe technical projects you've worked on and why you're interested in scaling up your AI and WordPress skills to earn a living-wage job.
                                    </p>
                                </div>
                                <textarea
                                    id="response"
                                    value={formData.response}
                                    onChange={handleInputChange}
                                    rows={12}
                                    className={`w-full bg-zinc-950 border ${errors.response ? 'border-red-500' : 'border-zinc-800'} rounded-2xl px-6 py-6 text-white focus:outline-none focus:ring-2 focus:ring-white/10 transition-all font-mono text-sm leading-relaxed`}
                                    placeholder="Write your response here... feel free to use AI to help you draft and refine it."
                                    required
                                ></textarea>
                                {errors.response && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-1">{errors.response}</p>}
                            </div>

                            {/* Feedback Area */}
                            <AnimatePresence>
                                {stage > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-8 p-6 rounded-2xl bg-yellow-900/10 border border-yellow-500/20 shadow-xl"
                                    >
                                        <div className="flex items-start gap-4">
                                            <span className="text-3xl">🎯</span>
                                            <div>
                                                <h4 className="text-yellow-500 font-black text-sm uppercase tracking-wider mb-2">
                                                    {stage === 1 ? "Guidance: Level 1" : "Guidance: Final Push"}
                                                </h4>
                                                <p className="text-gray-300 text-sm leading-relaxed">
                                                    {stage === 1
                                                        ? "Your draft has been analyzed. We've unlocked the 4 dimension explanations on the right to help you improve your score. Dig deeper into each area."
                                                        : "Great persistence! We've now unlocked the full scoring rubric. Align your response with these specific targets to complete your application."
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Attempts & Status */}
                            <div className="mt-8 space-y-4">
                                <div className="flex justify-between items-center px-2">
                                    <p className="text-xs text-zinc-600 font-mono">
                                        Protected by ReCAPTCHA v3
                                    </p>
                                    <p className={`text-xs font-black uppercase tracking-widest ${attempts >= 2 ? 'text-red-500' : 'text-zinc-500'}`}>
                                        Attempts Remaining: {3 - attempts}
                                    </p>
                                </div>
                                {!import.meta.env.VITE_RECAPTCHA_SITE_KEY && (
                                    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
                                        <p className="text-red-400 text-xs font-bold mb-1">Configuration Error</p>
                                        <p className="text-gray-400 text-[10px] leading-relaxed">
                                            ReCAPTCHA Site Key is missing. Check your <code className="text-white">.env</code> file.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <motion.button
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                                type="submit"
                                disabled={isAnalyzing || attempts >= 3 || !executeRecaptcha}
                                className="group relative w-full font-black py-5 rounded-2xl border border-white/10 mt-4 text-xs tracking-[0.2em] uppercase overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-300 cursor-pointer"
                            >
                                {/* 1. Pulsing Glow Layer */}
                                <motion.div
                                    className="absolute inset-0 z-0 bg-blue-500/5 rounded-2xl blur-lg"
                                    animate={{
                                        opacity: [0.2, 0.4, 0.2],
                                        scale: [0.98, 1.02, 0.98],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />

                                {/* 2. Background Layer */}
                                <motion.div
                                    className="absolute inset-0 z-1"
                                    variants={{
                                        initial: { backgroundColor: "rgba(24, 24, 27, 1)" },
                                        hover: { backgroundColor: "rgba(255, 255, 255, 1)" }
                                    }}
                                />

                                {/* 3. Continuous Color Shimmer */}
                                <motion.div
                                    className="absolute inset-0 z-2 w-[200%] h-full bg-gradient-to-r from-transparent via-blue-500/5 via-purple-500/15 via-blue-500/5 to-transparent"
                                    animate={{ x: ["-100%", "100%"] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                />

                                {/* 4. Content */}
                                <motion.span
                                    className="relative z-10 flex items-center justify-center gap-3"
                                    variants={{
                                        initial: { color: "#ffffff" },
                                        hover: { color: "#000000" }
                                    }}
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing...
                                        </>
                                    ) : (
                                        stage === 0 ? "Submit Initial Draft" : "Process Revision"
                                    )}
                                </motion.span>
                            </motion.button>
                        </form>
                    </div>

                    {/* Column 4 & 5: Evaluation Dimensions (Right) */}
                    <div className="lg:col-span-2 space-y-10 order-1 lg:order-2">
                        <div className="border-l-2 border-white/10 pl-6 py-2">
                            <h3 className="text-2xl font-black text-white mb-3">Evaluation Criteria</h3>
                            <p className="text-gray-500 leading-relaxed italic">
                                We don't judge you on what you already know. We value how you think, learn, and iterate.
                            </p>
                        </div>

                        <EvaluationDimensions stage={stage} scores={scores} feedback={aiFeedback} />

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-10">
                            <p className="text-xs text-gray-400 leading-relaxed italic">
                                <strong>Note:</strong> We value persistence. If your first score isn't perfect, use the unlocked feedback to refine your answer and resubmit.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ApplicationForm;
