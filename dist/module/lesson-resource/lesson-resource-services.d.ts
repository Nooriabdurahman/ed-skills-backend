import { CreateLessonResourceDto } from "./validator/create-lesson-resource";
export declare class LessonResourceService {
    static create(data: CreateLessonResourceDto & {
        fileUrl: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        updatedAt: Date;
        fileUrl: string;
        fileType: string | null;
        fileSize: number | null;
        lessonId: string;
    }>;
    static getByLesson(lessonId: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        updatedAt: Date;
        fileUrl: string;
        fileType: string | null;
        fileSize: number | null;
        lessonId: string;
    }[]>;
    static getById(id: string): Promise<({
        lesson: {
            id: string;
            createdAt: Date;
            name: string;
            content: string | null;
            text: string | null;
            url: string | null;
            video: string | null;
            courseId: number;
        };
    } & {
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        updatedAt: Date;
        fileUrl: string;
        fileType: string | null;
        fileSize: number | null;
        lessonId: string;
    }) | null>;
    static delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        description: string | null;
        updatedAt: Date;
        fileUrl: string;
        fileType: string | null;
        fileSize: number | null;
        lessonId: string;
    }>;
}
//# sourceMappingURL=lesson-resource-services.d.ts.map