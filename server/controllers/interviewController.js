const Resume = require("../models/Resume");
const Interview = require("../models/Interview");

const { generateQuestionsFromResume, evaluateInterview } = require("../services/aiService");
const InterviewResult = require("../models/InterviewResult");

exports.generateQuestions = async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id });

    if (!resume || !resume.extractedText) {
      return res.status(400).json({ message: "Upload resume first" });
    }

    // Call AI Service
    const questions = await generateQuestionsFromResume(resume.extractedText, 5);

    const interview = await Interview.create({
      user: req.user._id,
      questions,
    });

    res.json(interview);
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ message: "Failed to generate interview questions" });
  }
};

exports.submitAnswers = async (req, res) => {
  try {
    const { interviewId, answers } = req.body;

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    interview.answers = answers;
    await interview.save();

    // Trigger AI Evaluation
    const evaluation = await evaluateInterview(interview.questions, answers);

    // Save Results
    const result = await InterviewResult.create({
      user: req.user._id,
      interview: interviewId,
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths || [],
      weaknesses: evaluation.weaknesses || []
    });

    // Update interview mapping as well
    interview.score = evaluation.score;
    interview.feedback = evaluation.feedback;
    await interview.save();

    res.json({ message: "Answers submitted and evaluated successfully", resultId: result._id });
  } catch (error) {
    console.error("Error submitting answers:", error);
    res.status(500).json({ message: "Failed to process answers" });
  }
};