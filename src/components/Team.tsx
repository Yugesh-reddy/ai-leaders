
import React from 'react';

const Team: React.FC = () => {
    // Mock data
    const team = [
        { name: "Sarah Johnson", role: "Program Director" },
        { name: "David Chen", role: "Lead Instructor" },
        { name: "Amara Okeke", role: "Community Manager" },
        { name: "Michael Smith", role: "Curriculum Developer" }
    ];

    return (
        <section id="team" className="py-24 bg-black">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-16">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Meet the Team</h2>
                        <p className="text-gray-400">The experts and mentors dedicated to your success.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, idx) => (
                        <div key={idx} className="group">
                            <div className="aspect-[3/4] bg-zinc-900 rounded-xl mb-6 overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                                {/* Placeholder for actual image */}
                                <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-bold text-6xl">
                                    {member.name.charAt(0)}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white group-hover:text-gray-300 transition-colors">{member.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
