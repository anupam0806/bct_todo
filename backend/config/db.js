const mongoose = require("mongoose");

let cached;
async function connectDB() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MongoDB connection URI missing: set MONGODB_URI or MONGO_URI env variable");
    }
    if (!cached) {
        cached = globalThis.mongoose = { conn: null, promise: null };
    }
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(uri, { bufferCommands: false }).then((mongoose) => mongoose);
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}

module.exports = connectDB;