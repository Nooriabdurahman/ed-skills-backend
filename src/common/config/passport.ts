import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import fetch from 'node-fetch';
import prisma from './database/prisma';

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: '/users/auth/google/callback',
            proxy: true,
        },
        async (accessToken, refreshToken, profile, done) => {
            const id = profile.id;
            const displayName = profile.displayName;
            const email = profile.emails?.[0]?.value;
            const profilePicture = profile.photos?.[0]?.value;

            if (!email) {
                return done(new Error('No email found in Google profile'));
            }

            const userEmail = email as string;
            let age: number | null = null;

            // Optional: Fetch birthday from People API to calculate age
            try {
                const response = await fetch(
                    `https://people.googleapis.com/v1/people/me?personFields=birthdays`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
                const data: any = await response.json();
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
            } catch (error) {
                console.error('Error fetching birthday from Google:', error);
            }

            try {
                let user = await prisma.user.findUnique({
                    where: { email: userEmail },
                });

                const updatedData: any = {
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
                    user = await prisma.user.update({
                        where: { email: userEmail },
                        data: updatedData,
                    });
                    console.log(`✅ Existing user ${userEmail} synced with Google`);
                } else {
                    // Create new user
                    user = await prisma.user.create({
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
            } catch (error) {
                console.error('❌ Error in Google Strategy:', error);
                return done(error as Error);
            }
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;
