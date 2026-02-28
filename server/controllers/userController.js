const User = require("../models/User");
const Interview = require("../models/Interview");

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getUserInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(interviews);
    } catch (error) {
        console.error("Error fetching user interviews:", error);
        res.status(500).json({ message: "Server error" });
    }
};