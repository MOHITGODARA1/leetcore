import Streak from "../models/Streak.model.js";

export const setStreak = async (req, res) => {
    try {
        const userId = req.user._id;
        const streak = await Streak.findOne({ userId });
        if (!streak) {
            const newStreak = new Streak({ userId });
            await newStreak.save();
            return res.status(201).json({ success: true, streak: newStreak });
        }
        return res.status(200).json({ success: true, streak });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const getStreak = async (req, res) => {
    try {
        const userId = req.user._id;
        let streak = await Streak.findOne({ userId });
        if (!streak) {
            streak = new Streak({ userId });
            await streak.save();
        }
        return res.status(200).json({ success: true, streak });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const updateStreakDate = async (userId) => {
    try {
        let streak = await Streak.findOne({ userId });
        if (!streak) {
            streak = new Streak({ userId });
        }
        
        // Adjust server time (usually UTC) to IST (+05:30)
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const todayDate = new Date(now.getTime() + istOffset);
        
        const todayStr = `${todayDate.getUTCFullYear()}-${String(todayDate.getUTCMonth() + 1).padStart(2, '0')}-${String(todayDate.getUTCDate()).padStart(2, '0')}`;
        
        if (!streak.activeDates.includes(todayStr)) {
            streak.activeDates.push(todayStr);
            // simple streak bump logic for now
            streak.currentStreak += 1;
            if (streak.currentStreak > streak.longestStreak) {
                streak.longestStreak = streak.currentStreak;
            }
            await streak.save();
        }
    } catch (error) {
        console.error("Error updating streak:", error);
    }
}