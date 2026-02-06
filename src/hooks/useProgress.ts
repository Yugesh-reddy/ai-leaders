
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ai_leaders_progress';

export const useProgress = () => {
    const [completedLessons, setCompletedLessons] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setCompletedLessons(JSON.parse(stored));
        }
    }, []);

    const markLessonComplete = (lessonId: string) => {
        if (!completedLessons.includes(lessonId)) {
            const newCompleted = [...completedLessons, lessonId];
            setCompletedLessons(newCompleted);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newCompleted));
        }
    };

    const isLessonComplete = (lessonId: string) => {
        return completedLessons.includes(lessonId);
    };

    const getDomainProgress = (lessons: { id: string, domain: string }[]) => {
        const domains: Record<string, { total: number, completed: number }> = {};

        lessons.forEach(l => {
            if (!domains[l.domain]) {
                domains[l.domain] = { total: 0, completed: 0 };
            }
            domains[l.domain].total++;
            if (completedLessons.includes(l.id)) {
                domains[l.domain].completed++;
            }
        });

        return domains;
    };

    return { completedLessons, markLessonComplete, isLessonComplete, getDomainProgress };
};
