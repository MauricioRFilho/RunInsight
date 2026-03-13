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
      if (account?.provider === 'strava') {
        const stravaId = account.providerAccountId;
        console.log(`[NextAuth] STRAVA DATA RECEIVED:`, {
          id: stravaId,
          name: user.name,
          email: user.email,
          profile: user.image,
          access_token: account.access_token ? 'EXISTS' : 'MISSING',
        });
        console.log(`[NextAuth] Strava sign-in attempt for StravaID: ${stravaId} (Email: ${user.email || 'not provided'})`);
        
        try {
          // 1. Tentar encontrar por Strava ID
          let dbUser = await prisma.user.findUnique({
            where: { stravaId: stravaId }
          });

          if (dbUser) {
            // Atualizar tokens
            dbUser = await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                expiresAt: account.expires_at,
                name: user.name || dbUser.name,
              }
            });
            console.log(`[NextAuth] Updated existing Strava user: ${dbUser.id}`);
          } else if (user.email) {
            // 2. Se não encontrou por Strava ID, tentar por E-mail
            dbUser = await prisma.user.findUnique({
              where: { email: user.email }
            });

            if (dbUser) {
              // Vincular Strava ID ao usuário existente por e-mail
              dbUser = await prisma.user.update({
                where: { id: dbUser.id },
                data: {
                  stravaId: stravaId,
                  accessToken: account.access_token,
                  refreshToken: account.refresh_token,
                  expiresAt: account.expires_at,
                  name: dbUser.name || user.name,
                }
              });
              console.log(`[NextAuth] Linked StravaID ${stravaId} to existing email user: ${dbUser.id}`);
            }
          }

          // 3. Se ainda não tem usuário, criar novo
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                stravaId: stravaId,
                email: user.email || null,
                accessToken: account.access_token,
                refreshToken: account.refresh_token,
                expiresAt: account.expires_at,
                name: user.name || 'Strava User',
              }
            });
            console.log(`[NextAuth] Created NEW Strava user: ${dbUser.id}`);
          }
          
          user.id = dbUser.id;
          user.stravaId = dbUser.stravaId;
          console.log(`[NextAuth] Success! StravaID ${stravaId} mapped to DB ID: ${dbUser.id}`);
        } catch (error: any) {
          console.error(`[NextAuth Error] Database operation failed during Strava sign-in:`, error.message);
          // Permitimos o login mesmo se der erro no log de banco (fallback para o ID do provider)
          // mas o ideal é que esse bloco seja robusto o suficiente
        }
      }
      return true;
    },
    async jwt({ token, user, account }: any) {
      if (user) {
        token.id = user.id;
        token.stravaId = user.stravaId;
        console.log('[NextAuth] JWT set token.id:', token.id);
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
    console.error('[NextAuth Critical] Unhandled exception in handler:', error.message);
    if (error.stack) console.error(error.stack);
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