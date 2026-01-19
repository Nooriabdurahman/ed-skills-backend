"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_services_1 = require("../auth/auth-services");
const passport_1 = __importDefault(require("../../common/config/passport"));
const register_dto_1 = __importDefault(require("../auth/validator/register.dto"));
const generateToken_1 = __importDefault(require("../../common/utils/generateToken"));
const router = express_1.default.Router();
// Validation middleware
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((detail) => ({
                field: detail.path[0],
                message: detail.message
            }));
            res.status(400).json({ status: 'error', message: 'Validation failed', errors });
            return;
        }
        next();
    };
};
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */
/**
 * @swagger
 * /users/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/users', auth_services_1.getUsers);
/**
 * @swagger
 * /users/users/{id}:
 *   get:
 *     summary: Get a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found successfully
 *       404:
 *         description: User not found
 */
router.get('/users/:id', auth_services_1.getUserById);
/**
 * @swagger
 * /users/users:
 *   post:
 *     summary: Create a new user (Register)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               age:
 *                 type: integer
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post('/users', validateRequest(register_dto_1.default), auth_services_1.createUser);
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', auth_services_1.loginUser);
/**
 * @swagger
 * /users/google-login:
 *   post:
 *     summary: Login with Google
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               googleId:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/google-login', auth_services_1.googleLogin);
/**
 * @swagger
 * /users/apple-login:
 *   post:
 *     summary: Login with Apple
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               appleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/apple-login', auth_services_1.appleLogin);
/**
 * @swagger
 * /users/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Users]
 *     responses:
 *       302:
 *         description: Redirects to Google login page
 */
router.get('/auth/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/user.birthday.read']
}));
/**
 * @swagger
 * /users/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Users]
 *     responses:
 *       302:
 *         description: Redirects to frontend with token and user data
 */
router.get('/auth/google/callback', passport_1.default.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, generate token and redirect or send response
    const user = req.user;
    const token = (0, generateToken_1.default)(user);
    // Redirect to frontend with token (you might want to adjust this URL)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth-success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
});
/**
 * @swagger
 * /users/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               age:
 *                 type: integer
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/users/:id', auth_services_1.updateUser);
/**
 * @swagger
 * /users/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', auth_services_1.deleteUser);
exports.default = router;
//# sourceMappingURL=auth-route.js.map