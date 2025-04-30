"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGitHubUsers = void 0;
const axios_1 = __importDefault(require("axios"));
const GITHUB_API_URL = 'https://api.github.com/users';
const MAX_RETRIES = 3;
const fetchGitHubUsers = async (token) => {
    let retries = 0;
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    while (retries < MAX_RETRIES) {
        try {
            const response = await axios_1.default.get(GITHUB_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/vnd.github+json',
                },
                timeout: 5000,
            });
            const users = response.data.map((user) => ({
                username: user.login,
                identifier: user.id,
                profile_image: user.avatar_url,
            }));
            return { users };
        }
        catch (error) {
            const status = error?.response?.status;
            if (status === 401 || status === 403) {
                throw new Error('Authentication with GitHub failed');
            }
            if (status === 429) {
                const waitTime = Math.pow(2, retries) * 1000;
                await delay(waitTime);
                retries++;
                continue;
            }
            if (error.code === 'ECONNABORTED') {
                throw new Error('GitHub API request timed out');
            }
            throw new Error('GitHub API error');
        }
    }
    throw new Error('GitHub API rate limit exceeded — retries exhausted');
};
exports.fetchGitHubUsers = fetchGitHubUsers;
