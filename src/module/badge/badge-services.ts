import prisma from "../../common/config/database/prisma";

export class BadgeService {
  /**
   * Create a new badge
   */
  static async createBadge(name: string, description?: string, icon?: string) {
    return prisma.badge.create({
      data: {
        name,
        description,
        icon,
      },
    });
  }

  /**
   * Get all badges
   */
  static async getAllBadges() {
    return prisma.badge.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * Get badge by ID
   */
  static async getBadgeById(badgeId: number) {
    return prisma.badge.findUnique({
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
  static async updateBadge(
    badgeId: number,
    data: { name?: string; description?: string; icon?: string }
  ) {
    return prisma.badge.update({
      where: { id: badgeId },
      data,
    });
  }

  /**
   * Delete badge
   */
  static async deleteBadge(badgeId: number) {
    return prisma.badge.delete({
      where: { id: badgeId },
    });
  }
}

