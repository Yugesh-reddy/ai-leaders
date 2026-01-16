
import React, { useState, useEffect } from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const sections = ['about', 'team', 'faq', 'apply'];

        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            observer.disconnect();
        };
    }, []);

    const navLinks = [
        { name: 'About', href: '#about', id: 'about' },
        { name: 'Team', href: '#team', id: 'team' },
        { name: 'FAQ', href: '#faq', id: 'faq' },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black">
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold tracking-tighter cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>AI LEADERS</div>
                    <div className="hidden md:flex space-x-8 text-sm font-medium">
                        {navLinks.map((link) => (
                            <a
                                key={link.id}
                                href={link.href}
                                className={`transition-all duration-300 ${activeSection === link.id ? 'text-white border-b border-white' : 'text-zinc-500 hover:text-white'}`}
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                    <a
                        href="#apply"
                        className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${activeSection === 'apply' ? 'bg-zinc-200 text-black scale-105' : 'bg-white text-black hover:bg-zinc-200'}`}
                    >
                        Apply Now
                    </a>
                </div>
            </nav>

            <main className="flex-grow pt-20">
                {children}
            </main>

            <footer className="bg-black border-t border-white/10 py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0">
                            <h3 className="text-xl font-bold tracking-tight mb-2">AI LEADERS</h3>
                            <p className="text-gray-500 text-sm">Empowering the next generation of tech leaders.</p>
                        </div>
                        <div className="text-gray-400 text-sm">
                            Questions? Email <a href="mailto:help@ai-leaders.org" className="text-white hover:underline transition-all">help@ai-leaders.org</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
