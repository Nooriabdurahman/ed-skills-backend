"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_route_1 = __importDefault(require("./module/auth/auth-route"));
const profile_route_1 = __importDefault(require("./module/profile/profile-route"));
const course_route_1 = __importDefault(require("./module/course/course-route"));
const course_history_routes_1 = __importDefault(require("./module/course-history/course-history-routes"));
const uploadRoute_1 = __importDefault(require("./routes/uploadRoute"));
const upload_test_route_1 = __importDefault(require("./routes/upload-test-route"));
const chat_1 = __importDefault(require("./routes/chat"));
const test_routes_1 = __importDefault(require("./module/test/test-routes"));
const quiz_routes_1 = __importDefault(require("./module/quiz/quiz-routes"));
const badge_routes_1 = __importDefault(require("./module/badge/badge-routes"));
const certification_routes_1 = __importDefault(require("./module/auth/certification/certification-routes"));
const user_performance_routes_1 = __importDefault(require("./module/user-performance/user-performance-routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/users', auth_route_1.default);
app.use('/profile', profile_route_1.default);
app.use('/courses', course_route_1.default);
app.use('/course-history', course_history_routes_1.default);
app.use('/files', uploadRoute_1.default);
app.use("/api/chat", chat_1.default);
app.use('/test', upload_test_route_1.default);
// New routes for tests, quizzes, badges, and certifications
app.use('/tests', test_routes_1.default);
app.use('/quizzes', quiz_routes_1.default);
app.use('/badges', badge_routes_1.default);
app.use('/certifications', certification_routes_1.default);
app.use('/performance', user_performance_routes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map