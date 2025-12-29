"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        res.status(500).json({ error: 'JWT secret not configured' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
            const payload = decoded;
            req.user = { id: payload.id }; // ✅ userId from token
            next();
        }
        else {
            res.status(401).json({ error: 'Invalid token payload' });
            return;
        }
    }
    catch {
        res.status(401).json({ error: 'Invalid token' });
        return;
    }
};
exports.auth = auth;
//# sourceMappingURL=auth.js.map