const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} = require("../controllers/task.controller");

// Apply auth middleware to all task routes
router.use(authMiddleware);

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
