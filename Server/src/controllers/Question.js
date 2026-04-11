import fs from "fs";
import path from "path";
// load JSON manually
const filePath = path.resolve(import.meta.dirname, "../data/questions.json");
const questions = JSON.parse(fs.readFileSync(filePath, "utf-8"));

export const getQuestionsByTopic = (req, res) => {
    try {
        const { topic } = req.params;

        const filtered = questions.filter(
            (q) => q.topic.toLowerCase() === topic.toLowerCase()
        );

        if (filtered.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No questions found"
            });
        }

        res.status(200).json({
            success: true,
            count: filtered.length,
            data: filtered
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};