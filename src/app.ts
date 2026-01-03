import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from "./module/auth/auth-route";
import profileRoutes from './module/profile/profile-route';
import courseRoutes from './module/course/course-route';
import uploadRoute from './routes/uploadRoute';
import uploadTestRoute from './routes/upload-test-route';
import chatRoute from './routes/chat';
import courseLessonsRoutes from './module/course-lesson/course-lessons-routes';
import lessonResourceRoutes from './module/lesson-resource/lesson-resource-routes';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/users', userRoutes);

app.use('/profile', profileRoutes);

app.use('/courses', courseRoutes);

app.use('/files', uploadRoute);

app.use("/api/chat", chatRoute)

app.use('/test', uploadTestRoute);

app.use('/course-lessons', courseLessonsRoutes);

app.use('/lesson-resources', lessonResourceRoutes);

export default app;
