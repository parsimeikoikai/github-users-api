import axios from "axios";
import { GitHubUserResponse, TransformedUser } from "../types/github";

const GITHUB_API_URL = "https://api.github.com/users";
const MAX_RETRIES = 3;
const BASE_DELAY = 1000;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const transformGitHubUsers = (data: GitHubUserResponse[]): TransformedUser[] =>
  data.map((user) => ({
    username: user.login,
    identifier: user.id,
    profile_image: user.avatar_url,
  }));

export const fetchGitHubUsers = async (
  token: string
): Promise<{ users: TransformedUser[] }> => {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await axios.get<GitHubUserResponse[]>(GITHUB_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
        timeout: 5000,
      });

      return { users: transformGitHubUsers(response.data) };

    } catch (error: any) {
      const status = error?.response?.status;
      const isFinalAttempt = attempt === MAX_RETRIES - 1;

      if (status === 401 || status === 403) {
        throw new Error("Authentication with GitHub failed");
      }

      if (status === 429) {
        if (isFinalAttempt) break;
        const waitTime = Math.pow(2, attempt) * BASE_DELAY;
        console.warn(`Rate limited. Retrying in ${waitTime}ms...`);
        await delay(waitTime);
        continue;
      }

      if (error.code === "ECONNABORTED") {
        throw new Error("GitHub API request timed out");
      }

      // For other errors
      throw new Error(`GitHub API error: ${error.message}`);
    }
  }

  throw new Error("GitHub API rate limit exceeded — retries exhausted");
};