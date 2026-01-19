export declare class CourseProgressService {
    static markCompleted(userId: number, lessonId: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        lessonId: string;
        completed: boolean;
    }>;
    static getUserProgress(userId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        lessonId: string;
        completed: boolean;
    }[]>;
}
//# sourceMappingURL=progress-services.d.ts.map