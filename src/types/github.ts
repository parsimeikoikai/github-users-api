export interface GitHubUserResponse {
  login: string;
  id: number;
  avatar_url: string;
}
export interface TransformedUser {
  username: string;
  identifier: number;
  profile_image: string;
}
