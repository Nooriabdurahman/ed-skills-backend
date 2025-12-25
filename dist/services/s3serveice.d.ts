export declare function uploadProfilePicture(buffer: Buffer, originalName: string, userId: number): Promise<{
    directUrl: string;
    presignedUrl: string;
    objectName: string;
    updatedUser: {
        id: number;
        email: string;
        username: string;
        password: string;
        age: number | null;
        profilePicture: string | null;
        bio: string | null;
        interests: string[];
        createdAt: Date;
    };
}>;
//# sourceMappingURL=s3serveice.d.ts.map