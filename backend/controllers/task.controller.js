const Task = require("../models/task.model");

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, status } = req.body;
        
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        const task = new Task({
            title,
            status: status || "todo",
            user: req.userId,
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, status } = req.body;

        const task = await Task.findOne({ _id: id, user: req.userId });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (title !== undefined) task.title = title;
        if (status !== undefined) task.status = status;

        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        
        const task = await Task.findOneAndDelete({ _id: id, user: req.userId });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
