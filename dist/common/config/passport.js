"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const node_fetch_1 = __importDefault(require("node-fetch"));
const prisma_1 = __importDefault(require("./database/prisma"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: '/users/auth/google/callback',
    proxy: true,
}, async (accessToken, refreshToken, profile, done) => {
    const id = profile.id;
    const displayName = profile.displayName;
    const email = profile.emails?.[0]?.value;
    const profilePicture = profile.photos?.[0]?.value;
    if (!email) {
        return done(new Error('No email found in Google profile'));
    }
    const userEmail = email;
    let age = null;
    // Optional: Fetch birthday from People API to calculate age
    try {
        const response = await (0, node_fetch_1.default)(`https://people.googleapis.com/v1/people/me?personFields=birthdays`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        const birthday = data.birthdays?.[0]?.date;
        if (birthday && birthday.year && birthday.month && birthday.day) {
            const birthDate = new Date(birthday.year, birthday.month - 1, birthday.day);
            const today = new Date();
            age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }
    }
    catch (error) {
        console.error('Error fetching birthday from Google:', error);
    }
    try {
        let user = await prisma_1.default.user.findUnique({
            where: { email: userEmail },
        });
        const updatedData = {
            googleId: id,
            profilePicture: (user?.profilePicture || profilePicture) ?? null,
            age: user?.age || age,
        };
        // Sync username if it's not set or looks like a placeholder
        if (!user?.username || user.username.includes('@')) {
            updatedData.username = displayName || userEmail.split('@')[0] || 'User';
        }
        if (user) {
            // Update existing user
            user = await prisma_1.default.user.update({
                where: { email: userEmail },
                data: updatedData,
            });
            console.log(`✅ Existing user ${userEmail} synced with Google`);
        }
        else {
            // Create new user
            user = await prisma_1.default.user.create({
                data: {
                    email: userEmail,
                    username: displayName || userEmail.split('@')[0] || 'User',
                    googleId: id,
                    profilePicture: profilePicture ?? null,
                    age: age,
                },
            });
            console.log(`✅ New user ${userEmail} created via Google`);
        }
        return done(null, user);
    }
    catch (error) {
        console.error('❌ Error in Google Strategy:', error);
        return done(error);
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await prisma_1.default.user.findUnique({ where: { id } });
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map