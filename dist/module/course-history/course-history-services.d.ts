export declare class CourseHistoryService {
    /**
     * Track when a user views a course
     * If the user has already viewed the course, update the viewedAt timestamp
     */
    static trackCourseView(userId: number, courseId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        courseId: number;
        viewedAt: Date;
    }>;
    /**
     * Get all courses that a user has viewed (their course history)
     */
    static getUserCourseHistory(userId: number): Promise<({
        course: {
            lessons: {
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
            }[];
        } & {
            id: number;
            createdAt: Date;
            points: string | null;
            progress: number | null;
            name: string;
            description: string;
            subject: string;
            trainer: string | null;
            trainerImage: string | null;
            dialog: string | null;
            nextStep: string | null;
            icon: string | null;
            picture: string | null;
            materialType: string;
            materialCount: string | null;
            firstRecommendation: string | null;
            secondRecommendation: string | null;
            topic: string | null;
            quizTotalScore: number | null;
            quizPassingScore: number | null;
            status: string;
            materialStatusType: string;
            isCertified: boolean;
            typeImage: string | null;
            duration: string | null;
            content: string | null;
            contentType: string | null;
            passingPoints: string | null;
            type: string | null;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        courseId: number;
        viewedAt: Date;
    })[]>;
    /**
     * Check if a user has viewed a specific course
     */
    static hasUserViewedCourse(userId: number, courseId: number): Promise<boolean>;
    /**
     * Get course history for a specific course (all users who viewed it)
     */
    static getCourseViewers(courseId: number): Promise<({
        user: {
            id: number;
            email: string;
            username: string;
            profilePicture: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        courseId: number;
        viewedAt: Date;
    })[]>;
}
//# sourceMappingURL=course-history-services.d.ts.map