
import React from 'react';

const Team: React.FC = () => {
    // Mock data
    const team = [
        { name: "Blake Bertuccelli-Booth", role: "Program Lead" },
        { name: "Stefin Pasternak", role: "Program Lead" },
        { name: "Mary Hubbard", role: "Advisor" }
    ];

    return (
        <section id="team" className="py-24 bg-black">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Team and Advisors</h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">The experts and mentors dedicated to your success.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-12 lg:gap-16">
                    {team.map((member, idx) => (
                        <div key={idx} className="group w-full sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.33%-3rem)] max-w-xs">
                            <div className="aspect-[3/4] bg-zinc-900 rounded-xl mb-6 overflow-hidden relative border border-white/5">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                                {/* Placeholder for actual image */}
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-800 font-bold text-7xl select-none group-hover:scale-110 transition-transform duration-500">
                                    {member.name.charAt(0)}
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-white group-hover:text-gray-300 transition-colors">{member.name}</h3>
                                <p className="text-sm text-gray-500 mt-2 font-medium tracking-wide uppercase">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
