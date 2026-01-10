"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeService = void 0;
const prisma_1 = __importDefault(require("../../common/config/database/prisma"));
class BadgeService {
    /**
     * Create a new badge
     */
    static async createBadge(name, description, icon) {
        return prisma_1.default.badge.create({
            data: {
                name,
                // Prisma expects `string | null`, not `string | undefined`
                description: description ?? null,
                icon: icon ?? null,
            },
        });
    }
    /**
     * Get all badges
     */
    static async getAllBadges() {
        return prisma_1.default.badge.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    /**
     * Get badge by ID
     */
    static async getBadgeById(badgeId) {
        return prisma_1.default.badge.findUnique({
            where: { id: badgeId },
            include: {
                userBadges: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                username: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
    }
    /**
     * Update badge
     */
    static async updateBadge(badgeId, data) {
        return prisma_1.default.badge.update({
            where: { id: badgeId },
            data,
        });
    }
    /**
     * Delete badge
     */
    static async deleteBadge(badgeId) {
        return prisma_1.default.badge.delete({
            where: { id: badgeId },
        });
    }
}
exports.BadgeService = BadgeService;
//# sourceMappingURL=badge-services.js.map