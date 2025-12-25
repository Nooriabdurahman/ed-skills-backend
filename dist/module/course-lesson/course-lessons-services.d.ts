import { CreateCourseLessonDto } from "./validator/create-course-lesson";
export declare class CourseLessonService {
    static create(data: CreateCourseLessonDto): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        url: string | null;
        content: string | null;
        text: string | null;
        courseId: number;
    }>;
    static getByCourse(courseId: number): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        url: string | null;
        content: string | null;
        text: string | null;
        courseId: number;
    }[]>;
}
//# sourceMappingURL=course-lessons-services.d.ts.map