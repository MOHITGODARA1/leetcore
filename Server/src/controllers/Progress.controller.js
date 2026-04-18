import Progress from "../models/Progress.model.js";
import questions from "../data/questions.json" with { type: "json" };

// GET Progress (for UI)
export const getProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { topic } = req.query;

        // Filter questions by topic (case-insensitive)
        const topicQuestions = questions.filter(q => q.topic.toLowerCase() === topic.toLowerCase());

        const total = topicQuestions.length;

        const easyTotal = topicQuestions.filter(q => q.difficulty === "Easy").length;
        const mediumTotal = topicQuestions.filter(q => q.difficulty === "Medium").length;
        const hardTotal = topicQuestions.filter(q => q.difficulty === "Hard").length;

        const progress = await Progress.findOne({ userId, topic });

        res.json({
            topic,
            total,
            solved: progress?.solved || 0,

            easy: {
                solved: progress?.easy?.solved || 0,
                total: easyTotal
            },

            medium: {
                solved: progress?.medium?.solved || 0,
                total: mediumTotal
            },

            hard: {
                solved: progress?.hard?.solved || 0,
                total: hardTotal
            },

            solvedQuestions: progress?.solvedQuestions || []
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// UPDATE Progress (when user solves question)
export const updateProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { topic, question_name, difficulty } = req.body;

        let progress = await Progress.findOne({ userId, topic });

        if (!progress) {
            progress = new Progress({
                userId,
                topic,
                solved: 0,
                easy: { solved: 0 },
                medium: { solved: 0 },
                hard: { solved: 0 },
                solvedQuestions: []
            });
        }

        //  Prevent duplicate solve
        const alreadySolved = progress.solvedQuestions.find(
            q => q.question_name === question_name
        );

        if (alreadySolved) {
            return res.json({ message: "Already solved" });
        }

        //  Add solved question
        progress.solvedQuestions.push({ question_name, difficulty });

        progress.solved += 1;

        if (difficulty === "Easy") progress.easy.solved += 1;
        if (difficulty === "Medium") progress.medium.solved += 1;
        if (difficulty === "Hard") progress.hard.solved += 1;

        await progress.save();

        res.json({ message: "Progress updated", progress });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};