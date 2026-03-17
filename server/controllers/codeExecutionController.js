const axios = require("axios");

// RapidAPI Judge0 configuration (using the free tier / public endpoint example)
// For production, the user should provide their own RAPIDAPI_KEY
const JUDGE0_URL = "https://judge0-ce.p.rapidapi.com/submissions";
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || ""; 

exports.executeCode = async (req, res) => {
    try {
        const { source_code, language_id = 63, stdin = "" } = req.body; // 63 is JavaScript (Node.js)

        if (!source_code) {
            return res.status(400).json({ message: "No code provided" });
        }

        if (!RAPIDAPI_KEY) {
            console.warn("RAPIDAPI_KEY not found in env. Falling back to mock execution for demonstration.");
            return res.json({
                stdout: `Mock Output: ${source_code.substring(0, 50)}...`,
                status: { description: "Accepted" },
                time: "0.001",
                memory: "100"
            });
        }

        // 1. Create submission
        const response = await axios.post(`${JUDGE0_URL}?base64_encoded=false&wait=true`, {
            source_code,
            language_id,
            stdin
        }, {
            headers: {
                "x-rapidapi-key": RAPIDAPI_KEY,
                "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                "Content-Type": "application/json"
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error("Code Execution Error:", error.response?.data || error.message);
        res.status(500).json({ 
            message: "Failed to execute code", 
            error: error.response?.data?.message || error.message 
        });
    }
};
