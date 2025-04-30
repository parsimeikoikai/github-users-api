"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("../app");
const supertest_1 = __importDefault(require("supertest"));
const ioredis_1 = __importDefault(require("ioredis"));
jest.mock("axios");
afterAll(async () => {
    const redis = new ioredis_1.default(process.env.REDIS_URL || "redis://localhost:6379");
    await redis.quit();
});
describe("GET /api/users", () => {
    beforeAll(() => {
        delete process.env.GITHUB_TOKEN;
    });
    it("should return 401 if GitHub token is missing", async () => {
        const response = await (0, supertest_1.default)(app_1.server).get("/api/users");
        expect(response.status).toBe(401);
        expect(response.body.message).toMatch(/token missing/i);
    });
});
