import axios from "axios";
import { GitHubUserResponse, TransformedUser } from "../types/github";

const GITHUB_API_URL = "https://api.github.com/users";
const MAX_RETRIES = 3;

export const fetchGitHubUsers = async (
  token: string
): Promise<{ users: TransformedUser[] }> => {
  let retries = 0;
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.get<GitHubUserResponse[]>(GITHUB_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
        timeout: 5000,
      });

      const users: TransformedUser[] = response.data.map((user: any) => ({
        username: user.login,
        identifier: user.id,
        profile_image: user.avatar_url,
      }));

      return { users };
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        throw new Error("Authentication with GitHub failed");
      }

      if (status === 429) {
        const waitTime = Math.pow(2, retries) * 1000;
        await delay(waitTime);
        retries++;
        continue;
      }

      if (error.code === "ECONNABORTED") {
        throw new Error("GitHub API request timed out");
      }

      throw new Error("GitHub API error");
    }
  }

  throw new Error("GitHub API rate limit exceeded — retries exhausted");
};
