jest.mock("axios");
jest.mock("../config/redis", () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

import axios from "axios";
import request from "supertest";
import { server } from "../app";
import redis from "../config/redis";
import Redis from "ioredis";

const mockedAxios = axios.get as jest.Mock;
const mockedRedis = redis as jest.Mocked<typeof redis>;

beforeEach(async () => {
  const redisClient = new Redis(
    process.env.REDIS_URL || "redis://localhost:6379"
  );
  await redisClient.del("github_users");
  await redisClient.quit();
  process.env.GITHUB_TOKEN = "test-token";
});

afterAll(async () => {
  await server.close();
});

describe("GET /api/users", () => {
  it("should return a list of transformed GitHub users", async () => {
    mockedRedis.get.mockResolvedValue(null); // simulate no cache
    mockedAxios.mockResolvedValueOnce({
      data: [
        {
          login: "mockuser",
          id: 123,
          avatar_url: "https://avatar.url",
        },
      ],
    });

    const response = await request(server).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("users");
    expect(Array.isArray(response.body.users)).toBe(true);
    expect(response.body.users[0]).toHaveProperty("username", "mockuser");
    expect(response.body.users[0]).toHaveProperty("identifier", 123);
    expect(response.body.users[0]).toHaveProperty(
      "profile_image",
      "https://avatar.url"
    );
  });

  it("should return 429 if GitHub rate limit is hit repeatedly", async () => {
    mockedRedis.get.mockResolvedValue(null);
    mockedAxios.mockRejectedValue({ response: { status: 429 } });

    const response = await request(server).get("/api/users");

    expect(response.status).toBe(429);
    expect(response.body.message).toMatch(/rate limit/i);
    expect(mockedAxios).toHaveBeenCalledTimes(4);
  }, 15000);
});
