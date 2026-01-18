import { CreateCourseLessonDto } from "./validator/create-course-lesson";
export declare class CourseLessonService {
    static create(data: CreateCourseLessonDto & {
        video?: string | null;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        content: string | null;
        text: string | null;
        url: string | null;
        video: string | null;
        fileType: string | null;
        fileSize: number | null;
        courseId: number;
    }>;
    static getByCourse(courseId: number): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        content: string | null;
        text: string | null;
        url: string | null;
        video: string | null;
        fileType: string | null;
        fileSize: number | null;
        courseId: number;
    }[]>;
}
//# sourceMappingURL=course-lessons-services.d.ts.map