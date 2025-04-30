import { Request, Response } from "express";
import { fetchGitHubUsers } from "../services/githubService";
import redis from "../config/redis";

const CACHE_KEY = "github_users";
const CACHE_TTL = 300;

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    res.status(401).json({ message: "GitHub token missing" });
    return;
  }
  try {
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      res.status(200).json(JSON.parse(cached));
      return;
    }
    const users = await fetchGitHubUsers(token);
    await redis.set(CACHE_KEY, JSON.stringify(users), "EX", CACHE_TTL);
    res.status(200).json(users);
  } catch (error: any) {
    const message = error.message;

    if (message.includes("Authentication")) {
      res.status(403).json({ message });
    } else if (message.includes("rate limit")) {
      res.status(429).json({ message });
    } else if (message.includes("timed out")) {
      res.status(504).json({ message });
    } else {
      res.status(503).json({ message: "GitHub API error" });
    }
  }
};
