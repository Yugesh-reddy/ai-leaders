
import React, { useState } from 'react';

const FaqItem: React.FC<{ question: string; answer: React.ReactNode }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-white/10">
            <button
                className="w-full py-6 flex justify-between items-center text-left focus:outline-none group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-medium text-gray-200 group-hover:text-white transition-colors">{question}</span>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-gray-500`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <div className="text-gray-400 leading-relaxed max-w-2xl">{answer}</div>
            </div>
        </div>
    );
};

const FAQ: React.FC = () => {
    const faqs = [
        {
            question: "What is the AI Leader Program and what do I get?",
            answer: "A remote workforce program starting March 2026 that helps you earn a WordPress micro-credential and compete for living-wage WordPress job placement. Students are paid $20/hr for completing the course (about 40 hours, ~$800 total before withholdings)."
        },
        {
            question: "Who can apply?",
            answer: "The first cohort is limited to 80 people in Louisiana and Illinois."
        },
        {
            question: "How do I apply and how are students selected?",
            answer: (
                <ol className="list-decimal list-inside space-y-2">
                    <li>Apply at AI-Leaders.org — we'll evaluate your submission based on curiosity, clarity, and motivation.</li>
                    <li>By March 1, 2026, 80 students will be selected to enter a provisional 18-hour Generative AI + AI Literacy course.</li>
                    <li>From that provisional course, 40 students will be chosen for direct living-wage WordPress job placement with ongoing cohort-leader support.</li>
                </ol>
            )
        },
        {
            question: "Where do I take the course, and is there a place I can work from?",
            answer: "The course is remote. Optional facility access is available at Louisiana Tech, University of Louisiana Lafayette, Tulane University, and University of Illinois Chicago."
        }
    ];

    return (
        <section id="faq" className="py-24 bg-black">
            <div className="container mx-auto px-6 max-w-4xl">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12 text-center">Frequently Asked Questions</h2>
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <FaqItem key={index} question={faq.question} answer={faq.answer} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
