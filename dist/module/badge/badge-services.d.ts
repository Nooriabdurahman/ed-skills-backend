export declare class BadgeService {
    /**
     * Create a new badge
     */
    static createBadge(name: string, description?: string, icon?: string): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        icon: string | null;
        updatedAt: Date;
    }>;
    /**
     * Get all badges
     */
    static getAllBadges(): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        icon: string | null;
        updatedAt: Date;
    }[]>;
    /**
     * Get badge by ID
     */
    static getBadgeById(badgeId: number): Promise<({
        userBadges: ({
            user: {
                id: number;
                email: string;
                username: string;
            };
        } & {
            id: number;
            createdAt: Date;
            userId: number;
            updatedAt: Date;
            badgeId: number;
            earnedAt: Date;
        })[];
    } & {
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        icon: string | null;
        updatedAt: Date;
    }) | null>;
    /**
     * Update badge
     */
    static updateBadge(badgeId: number, data: {
        name?: string;
        description?: string;
        icon?: string;
    }): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        icon: string | null;
        updatedAt: Date;
    }>;
    /**
     * Delete badge
     */
    static deleteBadge(badgeId: number): Promise<{
        id: number;
        createdAt: Date;
        name: string;
        description: string | null;
        icon: string | null;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=badge-services.d.ts.map