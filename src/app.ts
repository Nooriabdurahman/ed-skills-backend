import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from "./module/auth/auth-route";
import profileRoutes from './module/profile/profile-route';
import courseRoutes from './module/course/course-route';
import uploadRoute from './routes/uploadRoute';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/users', userRoutes);

app.use('/profile', profileRoutes);

app.use('/courses', courseRoutes);

app.use('/files', uploadRoute);




export default app;
