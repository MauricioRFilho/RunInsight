export const dynamic = 'force-dynamic';

import NextAuth from 'next-auth';
import StravaProvider from 'next-auth/providers/strava';
import prisma from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

const authHandler = NextAuth({
  debug: true,
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
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email/Usuário e senha são obrigatórios');
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.email },
              { username: credentials.email }
            ]
          }
        });

        if (!user || !user.password) {
          throw new Error('Usuário não encontrado ou senha não definida');
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Senha incorreta');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          stravaId: user.stravaId
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === 'strava' && user.email) {
        try {
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
        } catch (error) {
          console.error('NextAuth: Error in signIn callback:', error);
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        token.stravaId = user.stravaId;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.stravaId = account.providerAccountId;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id;
        session.accessToken = token.accessToken;
        session.stravaId = token.stravaId;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata);
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      console.log('NextAuth Debug:', code, metadata);
    }
  }
});

const handler = async (req: any, res: any) => {
  try {
    return await authHandler(req, res);
  } catch (error: any) {
    console.error('CRITICAL NEXTAUTH ERROR:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error', 
      message: error.message,
      stack: error.stack 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export { handler as GET, handler as POST };