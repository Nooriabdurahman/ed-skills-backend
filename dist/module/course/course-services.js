"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.getCourseById = exports.getAllCourses = exports.createCourse = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
const createCourse = async (data) => {
    return prisma_1.default.course.create({ data });
};
exports.createCourse = createCourse;
const getAllCourses = async () => {
    return prisma_1.default.course.findMany();
};
exports.getAllCourses = getAllCourses;
const getCourseById = async (id) => {
    return prisma_1.default.course.findUnique({ where: { id } });
};
exports.getCourseById = getCourseById;
const updateCourse = async (id, data) => {
    return prisma_1.default.course.update({ where: { id }, data });
};
exports.updateCourse = updateCourse;
const deleteCourse = async (id) => {
    return prisma_1.default.course.delete({ where: { id } });
};
exports.deleteCourse = deleteCourse;
//# sourceMappingURL=course-services.js.map