"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCourse = exports.courseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
// Schema for course validation
exports.courseSchema = joi_1.default.object({
    name: joi_1.default.string().min(3).max(200).required().messages({
        'string.empty': 'Course name is required',
        'string.min': 'Course name must be at least 3 characters long',
        'string.max': 'Course name cannot exceed 200 characters',
    }),
    description: joi_1.default.string().min(10).required().messages({
        'string.empty': 'Course description is required',
        'string.min': 'Course description must be at least 10 characters long',
    }),
    subject: joi_1.default.string().allow(''),
    materialType: joi_1.default.string().valid('course', 'pages', 'quiz').default('course'),
    materialCount: joi_1.default.string().allow(''),
    firstRecommendation: joi_1.default.string().allow(''),
    secondRecommendation: joi_1.default.string().allow(''),
    trainer: joi_1.default.string().allow(''),
    dialog: joi_1.default.string().allow(null, ''),
    nextStep: joi_1.default.string().allow(null, ''),
    topic: joi_1.default.string().allow(null, ''),
    content: joi_1.default.string().allow(null, ''),
    contentType: joi_1.default.string().allow(null, ''),
    points: joi_1.default.string().allow(null, ''),
    passingPoints: joi_1.default.string().allow(null, ''),
    quizTotalScore: joi_1.default.number().optional(),
    quizPassingScore: joi_1.default.number().optional(),
    status: joi_1.default.string().valid('notStarted', 'inProgress', 'completed').default('notStarted'),
    materialStatusType: joi_1.default.string().allow(null, '').optional(),
    isCertified: joi_1.default.boolean().default(false),
    type: joi_1.default.string().allow(null, ''),
    progress: joi_1.default.number().default(0),
    duration: joi_1.default.string().allow(null, '')
});
// Helper function to validate course
const validateCourse = (data) => {
    return exports.courseSchema.validate(data, { convert: true });
};
exports.validateCourse = validateCourse;
//# sourceMappingURL=course-validate.js.map