"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
// User login validation schema
const loginSchema = joi_1.default.object({
    email: joi_1.default.string()
        .email()
        .required()
        .messages({
        'string.empty': 'Email is required',
        'string.email': 'Please provide a valid email address'
    }),
    password: joi_1.default.string()
        .required()
        .messages({
        'string.empty': 'Password is required'
    })
});
exports.default = loginSchema;
//# sourceMappingURL=login.dto.js.map