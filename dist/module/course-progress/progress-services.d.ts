export declare class CourseProgressService {
    static markCompleted(userId: number, lessonId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        completed: boolean;
        lessonId: number;
    }>;
    static getUserProgress(userId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        completed: boolean;
        lessonId: number;
    }[]>;
}
//# sourceMappingURL=progress-services.d.ts.map