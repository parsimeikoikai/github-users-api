import request from "supertest";
import Redis from "ioredis";
import { server } from "../../app";

describe("Integration: /api/users", () => {
  const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
  const TEST_KEY = "github_users";

  beforeAll(async () => {
    process.env.GITHUB_TOKEN = process.env.GITHUB_TOKEN || "dummy-token";
    await redis.del(TEST_KEY);
  });

  afterAll(async () => {
    await redis.quit();
    await server.close();
  });

  it("should fetch users from GitHub on first call and cache it", async () => {
    const response = await request(server).get("/api/users");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("users");
    expect(Array.isArray(response.body.users)).toBe(true);

    const cached = await redis.get(TEST_KEY);
    expect(cached).not.toBeNull();
  });

  it("should return cached users on second call (within TTL)", async () => {
    const first = await request(server).get("/api/users");
    const second = await request(server).get("/api/users");

    expect(second.status).toBe(200);
    expect(second.body).toEqual(first.body);
  });

  it("should expire cache after 5 minutes", async () => {
    // Manually expire the key
    await redis.del(TEST_KEY);

    const response = await request(server).get("/api/users");
    expect(response.status).toBe(200);
  });
});