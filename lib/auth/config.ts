import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  // No adapter - using JWT strategy only
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Use raw SQL to find user by email
          const sql = neon(process.env.DATABASE_URL!);
          const userResult = await sql`
            SELECT id, email, password_hash
            FROM users 
            WHERE email = ${credentials.email}
            LIMIT 1
          `;

          if (!userResult || userResult.length === 0) {
            return null;
          }

          const user = userResult[0];

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );

          if (!isValidPassword) {
            return null;
          }

          // Return user object (without sensitive data)
          return {
            id: user.id,
            email: user.email,
            name: user.email, // You can add a name field later
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
