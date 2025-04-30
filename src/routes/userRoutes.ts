import express from 'express';
import { getUsers } from '../controllers/userController';

const router = express.Router();

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
router.get('/', getUsers);

export default router;