
import React from 'react';

const Partners: React.FC = () => {
    return (
        <section id="partners" className="py-24 bg-zinc-950 border-y border-white/5">
            <div className="container mx-auto px-6 text-center">
                <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase mb-12">Trusted by Industry Leaders</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholders for logos */}
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-20 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group">
                            <span className="text-zinc-600 font-bold text-xl group-hover:text-zinc-400">PARTNER {i}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partners;
