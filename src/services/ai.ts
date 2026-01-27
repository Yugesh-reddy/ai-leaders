import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API client
// Note: In a production environment, you should never expose your API key on the client side.
// Ideally, this should be proxied through a backend service.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Missing VITE_GEMINI_API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(API_KEY || '');
// Use the 'gemini-flash-latest' alias to ensure we always use the current supported Flash model.
// As of Jan 2026, this typically resolves to Gemini 3 Flash.
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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
            throw new Error("Gemini model 'gemini-1.5-flash' not found. This usually means your API Key is invalid or doesn't have access to this model.");
        }

        if (error.status === 429) {
            throw new Error("Gemini API rate limit exceeded. Please wait a moment before trying again.");
        }

        throw new Error(`AI Analysis failed: ${error.message || 'Unknown error'}`);
    }
};
