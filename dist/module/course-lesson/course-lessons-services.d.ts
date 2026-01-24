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
        courseId: number;
        video: string | null;
        fileSize: number | null;
        fileType: string | null;
    }>;
    static getByCourse(courseId: number): Promise<({
        quiz: ({
            questions: ({
                answers: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    answer: string;
                    isCorrect: boolean;
                    questionId: number;
                    order: number | null;
                }[];
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                type: string;
                question: string;
                quizId: number;
                score: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            name: string;
            description: string | null;
            updatedAt: Date;
            courseId: number;
            lessonId: string | null;
            badgeId: number | null;
        }) | null;
        test: ({
            questions: ({
                answers: {
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    answer: string;
                    isCorrect: boolean;
                    questionId: number;
                }[];
            } & {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                type: string;
                question: string;
                testId: number;
            })[];
        } & {
            id: number;
            createdAt: Date;
            points: number | null;
            name: string;
            description: string | null;
            icon: string | null;
            picture: string | null;
            materialType: string | null;
            status: string | null;
            updatedAt: Date;
            topic: string | null;
            trainer: string | null;
            trainerImage: string | null;
            passingPoints: number | null;
            type: string | null;
            url: string | null;
            courseId: number;
            lessonId: string | null;
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        name: string;
        content: string | null;
        text: string | null;
        url: string | null;
        courseId: number;
        video: string | null;
        fileSize: number | null;
        fileType: string | null;
    })[]>;
}
//# sourceMappingURL=course-lessons-services.d.ts.map