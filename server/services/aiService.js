const { Groq } = require("groq-sdk");

// Initialize Groq client
// It will automatically use process.env.GROQ_API_KEY
const groq = new Groq({});

// Safer JSON parser
const parseJSON = (text, isArrayExpected = true) => {
    try {
        if (!text) return isArrayExpected ? [] : {};

        let cleanText = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // Find the absolute first and last boundaries of the JSON object/array
        const firstBrace = cleanText.indexOf("{");
        const lastBrace = cleanText.lastIndexOf("}");
        const firstBracket = cleanText.indexOf("[");
        const lastBracket = cleanText.lastIndexOf("]");

        if (isArrayExpected && firstBracket !== -1 && lastBracket !== -1 && lastBracket >= firstBracket) {
            cleanText = cleanText.substring(firstBracket, lastBracket + 1);
        } else if (!isArrayExpected && firstBrace !== -1 && lastBrace !== -1 && lastBrace >= firstBrace) {
            cleanText = cleanText.substring(firstBrace, lastBrace + 1);
        }

        // Final safety cleanup for common AI hallucinations
        cleanText = cleanText.trim();

        return JSON.parse(cleanText);
    } catch (err) {
        console.error("Failed to parse JSON from Groq. Raw text was:", text, "\nError:", err.message);
        return isArrayExpected ? [] : {};
    }
};

/**
 * Generate interview questions based on resume
 */
exports.generateQuestionsFromResume = async (resumeText, numQuestions = 5, role = "Software Engineer", testRequired = false) => {
    try {
        console.log("Checking GROQ_API_KEY for questions generation...");
        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === "") {
            console.log("No Groq API Key found. Returning mock AI assessment object.");
            return {
                "resume_analysis": {
                    "summary": "Experienced Software Engineer with a solid background.",
                    "key_skills_found": ["JavaScript", "React", "Node.js"]
                },
                "interview_questions": [
                    "Can you explain the architecture of the main project listed on your resume?",
                    "What was the most challenging technical problem you solved in your previous role?",
                    "How do you ensure the code you write is scalable and maintainable?",
                    "Describe a time you had to learn a new technology quickly to meet a deadline.",
                    "Can you walk me through your process for debugging a complex issue in production?"
                ],
                "evaluation_framework": {
                    "technical_depth": "Evaluate understanding of core concepts and language features.",
                    "problem_solving": "Assess ability to break down complex issues.",
                    "communication": "Check clarity and structure of explanations."
                },
                "skill_test": {
                    "type": "coding",
                    "problem": {
                        "problem_title": "String Reversal Challenge",
                        "difficulty_level": "Medium",
                        "problem_description": "Write a function to reverse a string in place without using built-in methods.",
                        "input_format": "A single string s",
                        "output_format": "The reversed string",
                        "constraints": "1 <= s.length <= 10^5",
                        "example_input": "hello",
                        "example_output": "olleh",
                        "explanation": "The characters are swapped from the outside in."
                    },
                    "test_cases": [
                        { "input": "hello", "expected_output": "olleh" },
                        { "input": "world", "expected_output": "dlrow" },
                        { "input": "a", "expected_output": "a" },
                        { "input": "", "expected_output": "" },
                        { "input": "racecar", "expected_output": "racecar" }
                    ]
                },
                "scoring_system": {
                    "coding_weight": 50,
                    "conceptual_weight": 50,
                    "total": 100
                },
                "resume_improvements": [
                    {
                        "category": "missing measurable achievements",
                        "suggestion": "Add specific metrics to your project descriptions, e.g., 'Improved performance by 20%'."
                    },
                    {
                        "category": "rewrite",
                        "suggestion": "Instead of 'Worked on backend API', use 'Designed and implemented a scalable RESTful API using Node.js, reducing average response time by 150ms'."
                    }
                ]
            };
        }
        console.log("GROQ_API_KEY exists! Proceeding with API call.");

        const trimmedResume = resumeText.substring(0, 3000);

        const prompt = `
You are an expert technical interviewer and assessment generator.

The candidate is preparing for a "${role}" interview.

Based on the candidate's resume below, generate a comprehensive skill test and assessment following these exact rules:

1. Coding Role Assessment: If the role is a coding role (Software Engineer, Backend Developer, Frontend Developer, Full Stack Developer, ML Engineer), generate ONE complete coding challenge including problem_title, difficulty_level, problem_description, input_format, output_format, constraints, example_input, example_output, and explanation. Also generate 5 to 8 test cases with input and expected_output. Include scoring logic out of 100.
2. Non-Coding Role Assessment: If it is a non-coding role, generate ONE practical scenario-based assessment including scenario, candidate_task, expected_solution_approach, evaluation_rubric, and scoring_criteria out of 100.
3. Interview Questions: Provide exactly ${numQuestions} standard interview questions tailored to the resume and role.
4. Resume Improvement Suggestions: Analyze the resume to provide suggestions for missing measurable achievements, weak project descriptions, missing relevant skills, formatting, and ATS optimization. Rewrite ONE project description to be stronger.

Resume:
${trimmedResume}

IMPORTANT: Return the response ONLY in valid structured JSON with the exact following format. Do NOT wrap it in markdown. Do not include any text outside the JSON:
{
  "resume_analysis": {},
  "interview_questions": [],
  "evaluation_framework": {},
  "skill_test": {
    "type": "coding | practical",
    "problem": {},
    "test_cases": []
  },
  "scoring_system": {},
  "resume_improvements": []
}
`;

        console.log("Executing chat completions for questions using llama-3.3-70b-versatile...");
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_completion_tokens: 8192,
            top_p: 1,
            stream: false,
            stop: null
        });

        // Extract content payload natively as Groq standard
        const raw = chatCompletion.choices[0]?.message?.content || "";
        console.log("Groq Questions Raw Output Length:", raw?.length);
        console.log("Groq Questions Raw Output Preview:", raw?.substring(0, 100));

        const parsedQuestions = parseJSON(raw, false);

        if (!parsedQuestions || !parsedQuestions.interview_questions) {
            console.error("Parsed JSON returned an invalid assessment object, using fallback.");
            throw new Error("Parsed JSON returned an invalid assessment object.");
        }

        return parsedQuestions;

    } catch (error) {
        console.error("Error generating questions from Groq:", error.message);
        return [
            "Tell me about yourself and your background.",
            "What are your greatest technical strengths?",
            "Can you describe a challenging engineering problem you've solved?",
            "Where do you see yourself in 5 years?",
            "How do you handle disagreements with colleagues?",
            "Describe a time you failed and what you learned.",
            "What is your ideal work environment?",
            testRequired ? "Coding Test: Implement a basic debounce function and explain how it prevents excessive function calls." : "Do you have any questions for us?"
        ];
    }
};

/**
 * Evaluate interview answers
 */
exports.evaluateInterview = async (questions, answers) => {
    try {
        console.log("Checking GROQ_API_KEY for interview evaluation...");
        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY.trim() === "") {
            console.log("No Groq API Key found. Returning mock evaluation.");
            return {
                score: 85,
                feedback: "Solid performance overall. Demonstrated good understanding of core concepts.",
                strengths: ["Clear communication", "Strong fundamentals"],
                weaknesses: ["Needs deeper system design knowledge", "Could give more concrete examples"]
            };
        }
        console.log("GROQ_API_KEY exists! Proceeding with evaluation API call.");

        // Force a 0 score if the candidate simply did not answer anything
        const answersArray = Array.isArray(answers) ? answers : Object.values(answers || {});
        const allEmpty = answersArray.every(ans => !ans || String(ans).trim() === "");
        if (allEmpty) {
            console.log("Candidate provided exactly 0 answers. Forcing a score of 0 to prevent AI leniency.");
            return {
                score: 0,
                feedback: "The candidate left the entire assessment blank and provided no answers.",
                coding_feedback: "No code was submitted.",
                conceptual_feedback: "No conceptual answers were provided.",
                strengths: ["N/A"],
                weaknesses: ["Did not attempt the assessment"]
            };
        }

        const prompt = `
You are an expert technical interviewer evaluating a candidate's performance.

The candidate has completed an assessment that includes a mix of conceptual questions and a practical/coding problem.
Here is the Assessment structure (including the questions, problems, expected test cases, and the scoring system/evaluation framework):
${JSON.stringify(questions)}

Here are the Candidate's Answers (indexed matched to the required tasks/questions):
${JSON.stringify(answers)}

Carefully evaluate the candidate's answers against the evaluation framework and test cases provided in the assessment.

CRITICAL GRADING INSTRUCTIONS:
1. If the candidate left a question completely blank or provided a nonsensical answer (e.g., "idk", single letters), score that specific section a 0.
2. If the candidate left the coding challenge blank or provided non-compiling code that misses the point entirely, score the coding section a 0.
3. The overall "score" must mathematically reflect these grades heavily. A submission that is entirely blank or "skipped" across all answers MUST receive a score between 0 and 10. Do not give a default passing/average score (like 60) for empty submissions.

CRITICAL FORMATTING INSTRUCTION:
Return ONLY valid JSON. Your response must BEGIN with \`{\` and END with \`}\`. Do not use markdown blocks (e.g., \`\`\`json). Do not add any conversational text.

{
  "score": 5,
  "feedback": "A comprehensive summary of their performance.",
  "coding_feedback": "Specific feedback on their practical/coding challenge, including whether they passed the edge cases.",
  "conceptual_feedback": "Specific feedback on their conceptual answers.",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"]
}
`;

        console.log("Executing chat completions for evaluation using llama-3.3-70b-versatile...");
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_completion_tokens: 8192,
            top_p: 1,
            stream: false,
            stop: null
        });

        // Extract content payload 
        const raw = chatCompletion.choices[0]?.message?.content || "";
        console.log("Groq Evaluation Raw Output Length:", raw?.length);
        console.log("Groq Evaluation Raw Output Preview:", raw?.substring(0, 100));

        const evaluation = parseJSON(raw, false);

        if (typeof evaluation.score !== 'number' || !evaluation.feedback) {
            console.error("Parsed JSON did not contain expected evaluation schema, using fallback.");
            throw new Error("Parsed JSON did not contain expected evaluation schema.");
        }

        return evaluation;

    } catch (error) {
        console.error("Error evaluating interview from Groq:", error.message);
        return {
            score: 0,
            feedback: "Unable to evaluate answers due to AI syntax or network error.",
            strengths: ["N/A"],
            weaknesses: ["N/A"]
        };
    }
};
