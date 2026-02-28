const OpenAI = require("openai");

// Initialize the OpenAI client
// It will automatically use process.env.OPENAI_API_KEY
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || "demo-key-replace-me",
});

/**
 * Generates interview questions based on the extracted resume text.
 * @param {string} resumeText - The text extracted from the user's resume.
 * @param {number} numQuestions - The number of questions to generate.
 * @returns {Promise<Array<string>>} An array of generated questions.
 */
exports.generateQuestionsFromResume = async (resumeText, numQuestions = 5) => {
    try {
        const prompt = `
      You are an expert technical interviewer. I will provide you with a candidate's resume text. 
      Please generate ${numQuestions} personalized, challenging, and relevant interview questions based on their experience and skills.
      
      Resume Text:
      ${resumeText}
      
      Output ONLY a JSON array of strings containing the questions, and nothing else. No markdown, no introductory text.
      Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
    `;

        // If using a demo key, we shouldn't actually call the API since it will fail.
        // We'll add a check to return mock questions if the real key isn't present.
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "demo-key-replace-me" || process.env.OPENAI_API_KEY.trim() === "") {
            console.log("Using demo key. Returning mock AI questions.");
            return [
                "Can you explain the architecture of the main project listed on your resume?",
                "What was the most challenging technical problem you solved in your previous role?",
                "How do you ensure the code you write is scalable and maintainable?",
                "Describe a time you had to learn a new technology quickly to meet a deadline.",
                "Can you walk me through your process for debugging a complex issue in production?"
            ];
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // You can switch to gpt-4 if preferred
            messages: [
                { role: "system", content: "You are an expert technical interviewer." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
        });

        const outputText = response.choices[0].message.content.trim();

        // Parse the JSON array from the response
        const questions = JSON.parse(outputText);
        return questions;

    } catch (error) {
        console.error("Error generating questions from OpenAI:", error);
        // Fallback questions in case of API failure
        return [
            "Tell me about yourself and your background.",
            "What are your greatest technical strengths?",
            "Can you describe a challenging engineering problem you've solved?",
            "Where do you see yourself in 5 years?",
            "Do you have any questions for us?"
        ];
    }
};

/**
 * Evaluates the candidate's answers using OpenAI.
 * @param {Array<string>} questions - The list of questions asked.
 * @param {Array<string>} answers - The list of answers provided by the candidate.
 * @returns {Promise<Object>} An evaluation object containing score, feedback, strengths, and weaknesses.
 */
exports.evaluateInterview = async (questions, answers) => {
    try {
        const prompt = `
            You are an expert technical interviewer evaluating a candidate's interview performance. 
            Below are the questions asked and the answers provided by the candidate.
            
            Questions: ${JSON.stringify(questions)}
            Answers: ${JSON.stringify(answers)}
            
            Please evaluate the candidate's performance. Output ONLY a valid JSON object with the following exact structure, and nothing else. Do not use markdown wrappers.
            {
                "score": <A number from 0 to 100 representing the overall score>,
                "feedback": "<A 2-3 sentence overall summary of their performance>",
                "strengths": ["<strength 1>", "<strength 2>"],
                "weaknesses": ["<area for improvement 1>", "<area for improvement 2>"]
            }
        `;

        // If using a demo key, return mock evaluation
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === "demo-key-replace-me" || process.env.OPENAI_API_KEY.trim() === "") {
            console.log("Using demo key. Returning mock AI evaluation.");
            return {
                score: 85,
                feedback: "Solid performance overall. Demonstrated good understanding of core concepts but lacked some depth in advanced architectural principles.",
                strengths: ["Clear communication", "Good foundational knowledge"],
                weaknesses: ["Needs more experience with scalability", "Could provide more specific examples"]
            };
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an expert technical interviewer and evaluator." },
                { role: "user", content: prompt }
            ],
            temperature: 0.5,
        });

        const outputText = response.choices[0].message.content.trim();
        return JSON.parse(outputText);

    } catch (error) {
        console.error("Error evaluating interview from OpenAI:", error);
        return {
            score: 70,
            feedback: "Unable to complete AI evaluation due to a service error. Please try again later.",
            strengths: ["N/A"],
            weaknesses: ["N/A"]
        };
    }
};
