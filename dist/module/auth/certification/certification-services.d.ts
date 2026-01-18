export declare class CertificationService {
    /**
     * Award certification to user when they complete a course
     * This should be called when a user finishes all lessons, tests, and quizzes
     */
    static awardCertification(userId: number, courseId: number, certificateUrl?: string): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        courseId: number;
        certificateUrl: string | null;
        issuedAt: Date;
    }>;
    /**
     * Get user's certifications
     */
    static getUserCertifications(userId: number): Promise<({
        course: {
            id: number;
            name: string;
            description: string;
            subject: string;
            picture: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        courseId: number;
        certificateUrl: string | null;
        issuedAt: Date;
    })[]>;
    /**
     * Get certification by ID
     */
    static getCertificationById(certificationId: number): Promise<({
        user: {
            id: number;
            email: string;
            username: string;
            profilePicture: string | null;
        };
        course: {
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
        certificateUrl: string | null;
        issuedAt: Date;
    }) | null>;
    /**
     * Check if user has completed course and award certification
     * This checks if user has:
     * - Completed all lessons
     * - Passed all tests
     * - Passed all quizzes
     */
    static checkAndAwardCertification(userId: number, courseId: number): Promise<{
        id: number;
        createdAt: Date;
        userId: number;
        updatedAt: Date;
        courseId: number;
        certificateUrl: string | null;
        issuedAt: Date;
    } | null>;
    /**
     * Get certifications for a specific course
     */
    static getCourseCertifications(courseId: number): Promise<({
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
        certificateUrl: string | null;
        issuedAt: Date;
    })[]>;
}
//# sourceMappingURL=certification-services.d.ts.map