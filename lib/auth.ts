import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // 1. Try real DB first
        try {
          const staff = await db.staffUser.findUnique({ where: { email } });
          if (staff && staff.isActive) {
            const valid = await bcrypt.compare(password, staff.passwordHash);
            if (valid) {
              return {
                id: staff.id,
                email: staff.email,
                name: `${staff.firstName} ${staff.lastName}`,
                role: staff.role,
              };
            }
          }
          // If DB lookup ran but credentials didn't match, reject
          if (staff) return null;
        } catch {
          // DB unreachable — fall through to dev credentials
        }

        // 2. Dev fallback — only active when no DB record exists
        const DEV_USERS = [
          { id: "dev-super-admin", email: "admin@ksqbrampton.ca", password: "Admin1234!", name: "Admin User", role: "SUPER_ADMIN" },
          { id: "dev-officer", email: "officer@ksqbrampton.ca", password: "Officer1234!", name: "Enrollment Officer", role: "OFFICER" },
        ];
        const devUser = DEV_USERS.find(u => u.email === email && u.password === password);
        if (devUser) return { id: devUser.id, email: devUser.email, name: devUser.name, role: devUser.role };

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "OFFICER";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { role?: string; id?: string }).role = token.role as string;
        (session.user as { role?: string; id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
});
