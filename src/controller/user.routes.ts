/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management endpoints (Authentication handled by Better Auth at /api/auth/*)
 *
 * components:
 *   securitySchemes:
 *     betterAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: Session Token
 *       description: Better Auth session token (user ID)
 *
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - email
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           format: cuid
 *           description: Unique user identifier (CUID format)
 *           example: "ckl1234567890abcdef"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address (unique)
 *           example: "user@example.com"
 *         name:
 *           type: string
 *           description: User's display name
 *           example: "John Doe"
 *         role:
 *           type: string
 *           enum: [admin, user, guest]
 *           default: user
 *           description: User's role in the system
 *           example: "user"
 *         age:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *           description: User's age
 *           example: 25
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Invalid credentials"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Error timestamp
 *           example: "2024-01-15T10:30:00Z"
 *
 *     Role:
 *       type: string
 *       enum: [admin, user, guest]
 *       description: User role in the system
 */
import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service.js';
import { userToDTO, usersToDTO } from '../dto/user.dto.js';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users or search by email
 *     tags:
 *       - Users
 *     parameters:
 *       - in: query
 *         name: email
 *         required: false
 *         schema:
 *           type: string
 *           format: email
 *         description: Email address to search for a specific user
 *         example: "user@example.com"
 *     responses:
 *       200:
 *         description: List of users (or single user if email query provided)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const { email } = req.query;

        if (email) {
            const user = await userService.getUserByEmail({ email: String(email) });
            res.status(200).json([userToDTO(user)]);
        } else {
            const users = await userService.getAllUsers();
            res.status(200).json(usersToDTO(users || []));
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        if (error instanceof Error && error.message.includes('does not exist')) {
            res.status(404).json({
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        } else {
            res.status(500).json({
                error: 'Internal server error',
                timestamp: new Date().toISOString(),
            });
        }
    }
});

/**
 * @swagger
 * /users/name/{name}:
 *   get:
 *     summary: Get user by username
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Username
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
userRouter.get('/name/:name', async (req: Request, res: Response) => {
    try {
        const name = Array.isArray(req.params.name) ? req.params.name[0] : req.params.name;
        const user = await userService.getUserByName({ name });
        res.status(200).json(userToDTO(user));
    } catch (error) {
        console.error('Error fetching user by name:', error);
        if (error instanceof Error && error.message.includes('does not exist')) {
            res.status(404).json({
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        } else {
            res.status(500).json({
                error: 'Internal server error',
                timestamp: new Date().toISOString(),
            });
        }
    }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (CUID)
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        const user = await userService.getUserById({ id });
        res.status(200).json(userToDTO(user));
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        if (error instanceof Error && error.message.includes('does not exist')) {
            res.status(404).json({
                error: error.message,
                timestamp: new Date().toISOString(),
            });
        } else {
            res.status(500).json({
                error: 'Internal server error',
                timestamp: new Date().toISOString(),
            });
        }
    }
});

export { userRouter };
