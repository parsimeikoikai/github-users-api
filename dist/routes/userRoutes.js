"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get GitHub users
 *     description: Returns a list of GitHub users with caching and error handling.
 *     responses:
 *       200:
 *         description: A list of transformed GitHub users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                         example: octocat
 *                       identifier:
 *                         type: integer
 *                         example: 1
 *                       profile_image:
 *                         type: string
 *                         example: https://github.com/images/error/octocat_happy.gif
 *       401:
 *         description: GitHub token missing
 *       429:
 *         description: Rate limit exceeded
 *       503:
 *         description: GitHub API error
 */
router.get('/', userController_1.getUsers);
exports.default = router;
