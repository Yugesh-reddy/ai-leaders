
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
        const sections = ['about', 'advisors', 'faq', 'apply'];

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
        { name: 'Advisors', href: '#advisors', id: 'advisors' },
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
                    <div className="flex items-center space-x-4">
                        <a
                            href="http://github.com/1111philo/ai-leaders/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-white transition-colors"
                            aria-label="GitHub Repository"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                            </svg>
                        </a>
                        <a
                            href="#apply"
                            className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${activeSection === 'apply' ? 'bg-zinc-200 text-black scale-105' : 'bg-white text-black hover:bg-zinc-200'}`}
                        >
                            Apply Now
                        </a>
                    </div>
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
