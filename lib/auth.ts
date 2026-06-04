import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Dev credentials — active when no Supabase DB is connected.
// TODO Phase 3 DB: replace DEV_USERS with a bcrypt check against the StaffUser table.
const DEV_USERS = [
  {
    id: "dev-super-admin",
    email: "admin@ksqbrampton.ca",
    password: "Admin1234!",
    name: "Admin User",
    role: "SUPER_ADMIN",
  },
  {
    id: "dev-officer",
    email: "officer@ksqbrampton.ca",
    password: "Officer1234!",
    name: "Enrollment Officer",
    role: "OFFICER",
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // TODO Phase 3 DB: swap dev check for:
        // const staff = await db.staffUser.findUnique({ where: { email: credentials.email } });
        // if (!staff || !staff.isActive) return null;
        // const valid = await bcrypt.compare(credentials.password as string, staff.passwordHash);
        // if (!valid) return null;
        // return { id: staff.id, email: staff.email, name: `${staff.firstName} ${staff.lastName}`, role: staff.role };

        const user = DEV_USERS.find(
          (u) =>
            u.email === credentials.email &&
            u.password === credentials.password
        );
        if (!user) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
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
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
});
