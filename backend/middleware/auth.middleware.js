const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const authMiddleware = async (req, res, next) => {
    try {
        console.log("Incoming Authorization header:", req.header("Authorization")); // Temporary debugging log

        const authHeader = req.header("Authorization");
        
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided, authorization denied." });
        }

        const token = authHeader.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ message: "Authorization token missing." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user and attach to req.user as requested
        const user = await User.findById(decoded.userId).select("-password");
        
        if (!user) {
            return res.status(401).json({ message: "User not found, authorization denied." });
        }
        
        req.user = user;
        console.log("req.user assigned:", req.user._id.toString()); // Temporary debugging log
        
        next();
    } catch (error) {
        res.status(401).json({ message: "Token is not valid." });
    }
};

module.exports = authMiddleware;
