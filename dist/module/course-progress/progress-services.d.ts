export declare class CourseProgressService {
    static markCompleted(userId: number, lessonId: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        completed: boolean;
        lessonId: string;
    }>;
    static getUserProgress(userId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        completed: boolean;
        lessonId: string;
    }[]>;
}
//# sourceMappingURL=progress-services.d.ts.map