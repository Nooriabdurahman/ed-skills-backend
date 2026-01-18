"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appleLogin = exports.googleLogin = exports.deleteUser = exports.updateUser = exports.loginUser = exports.createUser = exports.getUserById = exports.getUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
const generateToken_1 = __importDefault(require("../../common/utils/generateToken"));
const getUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany();
        res.json(users);
        console.log('✅ Users fetched successfully');
    }
    catch (error) {
        console.error('❌ Error fetching users:', error);
        res.status(500).json({ error: 'There was an error fetching users' });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id: Number(id) }
        });
        if (!user) {
            res.status(200).json({ user: null, error: 'User not found' });
            return;
        }
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
        console.log(`✅ User with id ${id} fetched successfully`);
    }
    catch (error) {
        console.error('❌ Error fetching user:', error);
        res.status(500).json({ error: 'Error fetching user' });
    }
};
exports.getUserById = getUserById;
const createUser = async (req, res) => {
    const { email, username, password, age, interests, skills } = req.body;
    try {
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma_1.default.user.create({
            data: { email, username, password: hashedPassword, age, interests, skills },
        });
        const token = (0, generateToken_1.default)(newUser);
        res.status(201).json({ user: newUser, token });
    }
    catch (error) {
        console.error('❌ Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }
        if (!user.password) {
            res.status(400).json({ error: 'This account uses social login. Please log in with Google or Apple.' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ error: 'Invalid email or password' });
            return;
        }
        const { password: _, ...userWithoutPassword } = user;
        const token = (0, generateToken_1.default)(user);
        res.json({ user: userWithoutPassword, token });
    }
    catch (error) {
        console.error('❌ Login failed:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};
exports.loginUser = loginUser;
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, username, password, age, interests, skills } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({ where: { id: Number(id) } });
        if (!user) {
            res.status(200).json({ user: null, error: 'User not found' });
            return;
        }
        const updatedData = {};
        if (email)
            updatedData.email = email;
        if (username)
            updatedData.username = username;
        if (password)
            updatedData.password = await bcryptjs_1.default.hash(password, 10);
        if (age !== undefined)
            updatedData.age = age;
        if (interests !== undefined)
            updatedData.interests = interests;
        if (skills !== undefined)
            updatedData.skills = skills;
        const updatedUser = await prisma_1.default.user.update({
            where: { id: Number(id) },
            data: updatedData,
        });
        res.json({ user: updatedUser });
    }
    catch (error) {
        console.error('❌ Error updating user:', error);
        res.status(500).json({ error: 'Error updating user' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma_1.default.user.findUnique({ where: { id: Number(id) } });
        if (!user) {
            res.status(200).json({ user: null, error: 'User not found' });
            return;
        }
        await prisma_1.default.user.delete({ where: { id: Number(id) } });
        res.json({ message: 'User deleted successfully' });
        console.log(`✅ User with id ${id} deleted successfully`);
    }
    catch (error) {
        console.error('❌ Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
};
exports.deleteUser = deleteUser;
const googleLogin = async (req, res) => {
    const { email, username, googleId, profilePicture } = req.body;
    try {
        let user = await prisma_1.default.user.findUnique({ where: { email } });
        if (user) {
            // If user exists, update their googleId if it's not set
            if (!user.googleId) {
                user = await prisma_1.default.user.update({
                    where: { email },
                    data: { googleId, profilePicture: user.profilePicture || profilePicture },
                });
            }
        }
        else {
            // Create new user if they don't exist
            user = await prisma_1.default.user.create({
                data: {
                    email,
                    username: username || email.split('@')[0],
                    googleId,
                    profilePicture,
                    // Since it's social login, password is null
                },
            });
        }
        const token = (0, generateToken_1.default)(user);
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
        console.log(`✅ User ${email} logged in via Google`);
    }
    catch (error) {
        console.error('❌ Google Login failed:', error);
        res.status(500).json({ error: 'Google Login failed' });
    }
};
exports.googleLogin = googleLogin;
const appleLogin = async (req, res) => {
    const { email, username, appleId } = req.body;
    try {
        let user = await prisma_1.default.user.findUnique({ where: { email } });
        if (user) {
            if (!user.appleId) {
                user = await prisma_1.default.user.update({
                    where: { email },
                    data: { appleId },
                });
            }
        }
        else {
            user = await prisma_1.default.user.create({
                data: {
                    email,
                    username: username || email.split('@')[0],
                    appleId,
                },
            });
        }
        const token = (0, generateToken_1.default)(user);
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
        console.log(`✅ User ${email} logged in via Apple`);
    }
    catch (error) {
        console.error('❌ Apple Login failed:', error);
        res.status(500).json({ error: 'Apple Login failed' });
    }
};
exports.appleLogin = appleLogin;
//# sourceMappingURL=auth-services.js.map