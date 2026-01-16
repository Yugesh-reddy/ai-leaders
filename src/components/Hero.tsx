
import React from 'react';

const Hero: React.FC = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-40 z-0"></div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                    <span className="text-sm font-medium tracking-wide text-gray-300">Applications Open for Spring 2026</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent pb-2">
                    Learn AI. <br className="hidden md:block" />
                    Learn WordPress. <br className="hidden md:block" />
                    Earn Living-Wage Jobs.
                </h1>

                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Master the tools defining the future of work. Join a community of innovators and secure your path to financial independence.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <a
                        href="#apply"
                        className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105"
                    >
                        Start Your Application
                    </a>
                    <a
                        href="#about"
                        className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-lg hover:bg-white/5 transition-all"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
