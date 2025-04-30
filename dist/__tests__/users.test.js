"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
jest.mock("axios");
jest.mock("../config/redis", () => ({
    get: jest.fn(),
    set: jest.fn(),
}));
const axios_1 = __importDefault(require("axios"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const redis_1 = __importDefault(require("../config/redis"));
const ioredis_1 = __importDefault(require("ioredis"));
const mockedAxios = axios_1.default.get;
const mockedRedis = redis_1.default;
beforeEach(async () => {
    const redisClient = new ioredis_1.default(process.env.REDIS_URL || "redis://localhost:6379");
    await redisClient.del("github_users");
    await redisClient.quit();
    process.env.GITHUB_TOKEN = "test-token";
});
afterAll(async () => {
    await app_1.server.close();
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
        const response = await (0, supertest_1.default)(app_1.server).get("/api/users");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("users");
        expect(Array.isArray(response.body.users)).toBe(true);
        expect(response.body.users[0]).toHaveProperty("username", "mockuser");
        expect(response.body.users[0]).toHaveProperty("identifier", 123);
        expect(response.body.users[0]).toHaveProperty("profile_image", "https://avatar.url");
    });
    it("should return 429 if GitHub rate limit is hit repeatedly", async () => {
        mockedRedis.get.mockResolvedValue(null); // No cache
        mockedAxios.mockRejectedValue({ response: { status: 429 } });
        const response = await (0, supertest_1.default)(app_1.server).get("/api/users");
        expect(response.status).toBe(429);
        expect(response.body.message).toMatch(/rate limit/i);
        expect(mockedAxios).toHaveBeenCalledTimes(4);
    }, 15000);
});
