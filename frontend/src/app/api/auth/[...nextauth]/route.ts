import NextAuth from 'next-auth';
import StravaProvider from 'next-auth/providers/strava';
import prisma from '@/lib/prisma';

const handler = NextAuth({
  providers: [
    StravaProvider({
      clientId: process.env.STRAVA_CLIENT_ID || '',
      clientSecret: process.env.STRAVA_CLIENT_SECRET || '',
      authorization: {
        params: {
          scope: 'read,activity:read_all',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account?.provider === 'strava' && user.email) {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            stravaId: account.providerAccountId,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
            name: user.name,
          },
          create: {
            email: user.email,
            stravaId: account.providerAccountId,
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            expiresAt: account.expires_at,
            name: user.name,
          },
        });
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.stravaId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.stravaId = token.stravaId;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
