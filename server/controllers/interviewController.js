const Resume = require("../models/Resume");
const Interview = require("../models/Interview");
const InterviewSession = require("../models/InterviewSession");
const InterviewResult = require("../models/InterviewResult");
const { generateQuestionsFromResume, evaluateInterview } = require("../services/aiService");

exports.generateQuestions = async (req, res) => {
  try {
    const { role = "Software Engineer", testRequired = false } = req.body;
    
    // Check for existing in-progress session
    let session = await InterviewSession.findOne({ user: req.user._id, status: "in_progress" });
    if (session) {
        return res.json(session);
    }

    const resume = await Resume.findOne({ user: req.user._id });
    if (!resume || !resume.extractedText) {
      return res.status(400).json({ message: "Upload resume first" });
    }

    // Call AI Service
    const assessment = await generateQuestionsFromResume(resume.extractedText, 8, role, testRequired);

    // Create a new Interview document (legacy compatibility)
    const interview = await Interview.create({
      user: req.user._id,
      assessment,
    });

    // Create a new InterviewSession
    session = await InterviewSession.create({
        user: req.user._id,
        role,
        questions: assessment.interview_questions,
        skillTest: assessment.skill_test,
        assessment,
        status: "in_progress"
    });

    res.json(session);
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ message: "Failed to generate interview questions" });
  }
};

exports.getActiveSession = async (req, res) => {
    try {
        const session = await InterviewSession.findOne({ user: req.user._id, status: "in_progress" });
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: "Error fetching session" });
    }
};

exports.saveAnswer = async (req, res) => {
    try {
        const { sessionId, questionIndex, answer, skillAnswer } = req.body;
        const session = await InterviewSession.findById(sessionId);
        
        if (!session || session.status === "completed") {
            return res.status(404).json({ message: "Session not found or already completed" });
        }

        if (answer !== undefined && questionIndex !== undefined) {
            const newAnswers = [...session.answers];
            newAnswers[questionIndex] = answer;
            session.answers = newAnswers;
            session.currentQuestionIndex = questionIndex + 1;
        }

        if (skillAnswer !== undefined) {
            session.skillAnswer = skillAnswer;
        }

        await session.save();
        res.json({ message: "Progress saved" });
    } catch (error) {
        res.status(500).json({ message: "Error saving answer" });
    }
};

exports.submitAnswers = async (req, res) => {
  try {
    const { sessionId, answers } = req.body;

    const session = await InterviewSession.findById(sessionId);
    if (!session || session.status === "completed") {
      return res.status(404).json({ message: "Interview session not found or already completed" });
    }

    // Prepare final answer format for AI evaluation
    const finalAnswers = answers || {
        questions: session.answers,
        skill_test_answer: session.skillAnswer
    };

    // Trigger AI Evaluation
    const evaluation = await evaluateInterview(session.assessment, finalAnswers);

    // Create a legacy result record if needed or just use results collection
    const result = await InterviewResult.create({
      user: req.user._id,
      interview: session._id, // Map results to session now
      evaluation: evaluation
    });

    // Finalize session
    session.status = "completed";
    session.completedAt = Date.now();
    await session.save();

    res.json({ message: "Answers submitted and evaluated successfully", resultId: result._id });
  } catch (error) {
    console.error("Error submitting answers:", error);
    res.status(500).json({ message: "Failed to process answers" });
  }
};