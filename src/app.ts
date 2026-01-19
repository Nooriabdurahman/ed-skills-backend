import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import passport from './common/config/passport';
import userRoutes from "./module/auth/auth-route";
import profileRoutes from './module/profile/profile-route';
import courseRoutes from './module/course/course-route';
import courseHistoryRoutes from './module/course-history/course-history-routes';
import uploadRoute from './routes/uploadRoute';
import uploadTestRoute from './routes/upload-test-route';
import chatRoute from './routes/chat';
import testRoutes from './module/test/test-routes';
import quizRoutes from './module/quiz/quiz-routes';
import badgeRoutes from './module/badge/badge-routes';
import certificationRoutes from './module/auth/certification/certification-routes';
import userPerformanceRoutes from './module/user-performance/user-performance-routes';

const app = express();
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'ed-skills-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use('/users', userRoutes);

app.use('/profile', profileRoutes);

app.use('/courses', courseRoutes);

app.use('/course-history', courseHistoryRoutes);

app.use('/files', uploadRoute);

app.use("/api/chat", chatRoute)

app.use('/test', uploadTestRoute);

// New routes for tests, quizzes, badges, and certifications
app.use('/tests', testRoutes);
app.use('/quizzes', quizRoutes);
app.use('/badges', badgeRoutes);
app.use('/certifications', certificationRoutes);
app.use('/performance', userPerformanceRoutes);

export default app;
