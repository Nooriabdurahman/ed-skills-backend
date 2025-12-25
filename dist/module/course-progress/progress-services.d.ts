export declare class CourseProgressService {
    static markCompleted(userId: number, lessonId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        lessonId: number;
        completed: boolean;
    }>;
    static getUserProgress(userId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        lessonId: number;
        completed: boolean;
    }[]>;
}
//# sourceMappingURL=progress-services.d.ts.map