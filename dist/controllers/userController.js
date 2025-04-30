"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = void 0;
const githubService_1 = require("../services/githubService");
const redis_1 = __importDefault(require("../config/redis"));
const CACHE_KEY = "github_users";
const CACHE_TTL = 300;
const getUsers = async (req, res) => {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        res.status(401).json({ message: "GitHub token missing" });
        return;
    }
    try {
        const cached = await redis_1.default.get(CACHE_KEY);
        if (cached) {
            res.status(200).json(JSON.parse(cached));
            return;
        }
        const users = await (0, githubService_1.fetchGitHubUsers)(token);
        await redis_1.default.set(CACHE_KEY, JSON.stringify(users), "EX", CACHE_TTL);
        res.status(200).json(users);
    }
    catch (error) {
        const message = error.message;
        if (message.includes("Authentication")) {
            res.status(403).json({ message });
        }
        else if (message.includes("rate limit")) {
            res.status(429).json({ message });
        }
        else if (message.includes("timed out")) {
            res.status(504).json({ message });
        }
        else {
            res.status(503).json({ message: "GitHub API error" });
        }
    }
};
exports.getUsers = getUsers;
