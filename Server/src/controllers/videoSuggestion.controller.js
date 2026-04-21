import fs from "fs";
import path from "path";

// load json
const filePath = path.resolve(import.meta.dirname, "../data/DSA/VideoSuggestion.json");
const videoSuggestion = JSON.parse(fs.readFileSync(filePath, "utf-8"));

export const getVideoSuggestion = (req, res) => {
    try {
        let topic = req.query.topic || req.params.topic;
        
        if (!topic) {
            return res.status(400).json({
                success: false,
                message: "Topic parameter is required"
            });
        }

        topic = topic.toLowerCase().replace(/-/g, "_");
        if (topic === "two_pointers") topic = "two_pointer";

        let filtered = videoSuggestion[topic];
        
        if (!filtered || filtered.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No videos found"
            });
        }

        filtered = filtered.map(v => {
            const id = v.url ? v.url.split("/embed/")[1] : null;
            return {
                ...v,
                id
            };
        });

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
}