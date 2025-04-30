import { server } from "../app";
import request from "supertest";
import Redis from "ioredis";

jest.mock("axios");

afterAll(async () => {
  const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
  await redis.quit();
});

describe("GET /api/users", () => {
  beforeAll(() => {
    delete process.env.GITHUB_TOKEN;
  });

  it("should return 401 if GitHub token is missing", async () => {
    const response = await request(server).get("/api/users");
    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/token missing/i);
  });
});
