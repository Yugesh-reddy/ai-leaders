
import React from 'react';

const Partners: React.FC = () => {
    return (
        <section id="partners" className="py-24 bg-zinc-950 border-y border-white/5">
            <div className="container mx-auto px-6 text-center">
                <p className="text-sm font-semibold tracking-widest text-gray-500 uppercase mb-12">Backed by Trusted Organizations</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {[
                        "University of Illinois Chicago",
                        "WordPress",
                        "Louisiana Tech University",
                        "University of Louisiana at Lafayette"
                    ].map((name) => (
                        <div key={name} className="h-24 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group p-4">
                            <span className="text-zinc-500 font-bold text-sm md:text-base group-hover:text-zinc-300 text-center">{name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Partners;
