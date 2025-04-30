# GitHub Users API

A Node.js + TypeScript REST API that fetches public GitHub users, caches the response using Redis for 5 minutes.

---

## 🚀 Features

- 🔐 Authenticated GitHub API requests
- ⚡ Redis caching to reduce redundant API calls (5-minute TTL)
- 📄 Swagger UI for API documentation
- ✅ Unit & integration tests with Jest and Supertest
- 🌐 Express.js RESTful API
- 🛠️ Type-safe development with TypeScript

---

## 🏁 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/github-users-api.git
cd github-users-api
```
### 2. Install Dependencies
```bash
yarn install
```
### 3. Setup Environment Variables
Create a .env file:
```bash
cp .env.example .env
```
Then update it with your details:
```bash
GITHUB_TOKEN=your_personal_access_token
REDIS_URL=redis://localhost:6379
PORT=3000
```
### 4. Run the Server
#### Development
```bash
yarn dev
```
#### Production
```bash
yarn build
yarn start
```
### 📦 API Endpoints
#### GET /api/users
Fetch a list of public GitHub users (transformed). Uses Redis to cache responses for 5 minutes.

**Example Response**
```bash
{
  "users": [
    {
      "username": "octocat",
      "identifier": 1,
      "profile_image": "https://github.com/images/error/octocat_happy.gif"
    }
  ]
}
```
### 📘 API Documentation
Visit:
```bash
http://localhost:3000/api-docs
```
Interactive Swagger UI to test and explore the API.
### 🧪 Testing
Run tests using:
```bash
yarn test
```
Includes:
- ✅ Unit tests
- 🔁 Integration tests
- 💡 Mocked API calls and Redis cache behavior
###  📁 Project Structure
```bash
src/
├── app.ts              # Main app entry
├── routes/             # Route definitions
├── controllers/        # Route handlers
├── services/           # GitHub API logic
├── config/             # Redis setup
├── swagger.ts          # Swagger documentation
__tests__/
├── users.test.ts       # Unit tests
├── users.integration.test.ts  # Integration tests
```
###  🧰 Tech Stack
- Node.js + Express.js
- TypeScript
- Redis (ioredis)
- Axios for HTTP requests
- Jest + Supertest for testing
- Swagger UI for documentation
