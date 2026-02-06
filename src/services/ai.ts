import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API client
// Note: In a production environment, you should never expose your API key on the client side.
// Ideally, this should be proxied through a backend service.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Missing VITE_GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(API_KEY || '');
// Use Gemini 2.0 Flash Lite for analysis.
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

export interface AssessmentResult {
    curiosity: number;
    clarity: number;
    motivation: number;
    experience: number;
    feedback: {
        curiosity: string;
        clarity: string;
        motivation: string;
        experience: string;
    };
}

const SYSTEM_PROMPT = `
You are an expert evaluator for the "AI Leaders" program, assessing an applicant's short answer response.
The prompt they answered is: "Describe technical projects you've worked on and why you're interested in scaling up your AI and WordPress skills to earn a living-wage job."

You must evaluate their response on 4 dimensions (0-100 score):
1. **Curiosity**: Did they ask "why" or "how"? Did they explore concepts deeply?
2. **Clarity**: Is the communication structured, logical, and easy to follow?
3. **Motivation**: Do they show genuine drive for a career (living-wage), not just a job?
4. **Experience**: Do they describe technical projects? Does it show hands-on experience or genuine effort?

Return ONLY a valid JSON object with the following structure, no markdown formatting:
{
  "curiosity": number,
  "clarity": number,
  "motivation": number,
  "experience": number,
  "feedback": {
    "curiosity": "1 sentence specific feedback",
    "clarity": "1 sentence specific feedback",
    "motivation": "1 sentence specific feedback",
    "experience": "1 sentence specific feedback"
  }
}
`;

export const analyzeApplication = async (response: string): Promise<AssessmentResult> => {
    if (import.meta.env.VITE_DISABLE_GEMINI === 'true') {
        console.info('Gemini AI analysis is disabled (VITE_DISABLE_GEMINI=true). Returning mock response.');
        // Return a mock "passing" response for testing
        return {
            curiosity: 85,
            clarity: 90,
            motivation: 88,
            experience: 82,
            feedback: {
                curiosity: "Mock curiosity feedback.",
                clarity: "Mock clarity feedback.",
                motivation: "Mock motivation feedback.",
                experience: "Mock experience feedback."
            }
        };
    }

    if (!API_KEY) {
        throw new Error("Gemini API Key is missing. Please check your .env configuration.");
    }

    try {
        const result = await model.generateContent([
            SYSTEM_PROMPT,
            `Applicant Response: "${response}"`
        ]);

        const responseText = result.response.text();
        console.log("Raw AI Response:", responseText);

        // Clean up markdown code blocks if present
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            return JSON.parse(cleanedText) as AssessmentResult;
        } catch (parseError) {
            console.error("Failed to parse AI response as JSON:", cleanedText);
            throw new Error("The AI returned an invalid format. Please try again.");
        }
    } catch (error: any) {
        console.error("Error calling Gemini API:", error);

        // Handle specific Gemini error cases
        if (error.message?.includes('API_KEY_INVALID')) {
            throw new Error("Invalid Gemini API Key. Please check your .env file.");
        }

        if (error.status === 404 || error.message?.includes('not found')) {
            throw new Error("Gemini model 'gemini-2.0-flash-lite' not found. This usually means your API Key is invalid or doesn't have access to this model.");
        }

        if (error.status === 429) {
            throw new Error("Gemini API rate limit exceeded. Please wait a moment before trying again.");
        }

        throw new Error(`AI Analysis failed: ${error.message || 'Unknown error'}`);
    }
};

export const chatWithLesson = async (
    lessonContext: string,
    masteryCriteria: string,
    history: { role: 'user' | 'model'; content: string }[],
    newMessage: string
): Promise<string> => {
    if (import.meta.env.VITE_DISABLE_GEMINI === 'true') {
        return "This is a mock response because VITE_DISABLE_GEMINI is true.";
    }

    if (!API_KEY) {
        throw new Error("Gemini API Key is missing. Please check your .env configuration.");
    }

    try {
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{
                        text: `You are an AI Tutor for the "AI Leaders" program. 
Your goal is to help the student understand the following lesson content. 
Answer their questions based on this content. Be encouraging, clear, and helpful.
Do not make up facts outside the lesson unless it's general knowledge to explain a concept.

If the student asks you to review their work or an assignment, use the MASTERY CRITERIA provided below to give them feedback.
Tell them if they are on the right track or what specifically they need to improve.

LESSON CONTENT:
${lessonContext}

MASTERY CRITERIA:
${masteryCriteria}
` }]
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to help the student with this lesson and review their work against the criteria." }]
                },
                ...history.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }))
            ]
        });

        const result = await chat.sendMessage(newMessage);
        return result.response.text();

    } catch (error: any) {
        console.error("Error in chatWithLesson:", error);
        return "I'm having trouble connecting to the AI right now. Please try again later.";
    }
};

export interface LessonAssessmentResult {
    score: number;
    passed: boolean;
    feedback: string;
}

export const assessLessonWork = async (
    lessonTitle: string,
    masteryCriteria: string,
    userWork: string
): Promise<LessonAssessmentResult> => {
    if (import.meta.env.VITE_DISABLE_GEMINI === 'true') {
        return {
            score: 85,
            passed: true,
            feedback: "Great work! This is a mock passing assessment."
        };
    }

    if (!API_KEY) {
        throw new Error("Gemini API Key is missing.");
    }

    const prompt = `
    You are an expert evaluator assessing a student's work for the lesson: "${lessonTitle}".
    
    MASTERY CRITERIA:
    ${masteryCriteria}
    
    STUDENT SUBMISSION:
    "${userWork}"
    
    Evaluate the submission based strictly on the mastery criteria.
    If the submission meets the criteria, give a score of 80 or above (passing).
    If it is incomplete or incorrect, give a score below 80.
    
    Return ONLY a valid JSON object:
    {
        "score": number (0-100),
        "passed": boolean,
        "feedback": "Concise, constructive feedback explaining the score and what to improve if needed."
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedText) as LessonAssessmentResult;
    } catch (error) {
        console.error("Error assessing lesson:", error);
        throw new Error("Assessment failed. Please try again.");
    }
};
