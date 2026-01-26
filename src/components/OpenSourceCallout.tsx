import React from 'react';

const GithubIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
);

const OpenSourceCallout: React.FC = () => {
    return (
        <section className="relative bg-zinc-950 border-y border-white/5 py-12 overflow-hidden">
            {/* Dynamic Coding Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Subtle Grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                ></div>

                {/* Glowing Blobs */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full"></div>
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full"></div>

                {/* Decorative Code Fragments */}
                <div className="absolute top-4 left-6 text-[8px] font-mono text-zinc-800 select-none hidden lg:block opacity-30">
                    <pre>{`const platform = {\n  type: 'Open Source',\n  license: 'MIT'\n}`}</pre>
                </div>
                <div className="absolute bottom-4 right-6 text-[8px] font-mono text-zinc-800 select-none hidden lg:block opacity-30 text-right">
                    <pre>{`git push origin main`}</pre>
                </div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl mx-auto">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                            AI Leaders is an Open Source Platform
                        </h2>
                        <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
                            Work toward a job while contributing to a platform others can use.
                            Join our community of builders.
                        </p>
                    </div>
                    <a
                        href="https://github.com/1111philo/ai-leaders"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                    >
                        <GithubIcon className="w-4 h-4 transition-transform group-hover:rotate-12" />
                        <span>Star our GitHub</span>
                        <div className="absolute inset-0 rounded-full bg-white blur-md opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default OpenSourceCallout;
