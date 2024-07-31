import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authConfig } from "@/auth/auth.config";
import prisma from "@/lib/db";
import type { NextApiRequest } from "next";
import getServerSession, { Session } from "next-auth";
// import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";

// export default async function checkSession(): Promise<Session> {
//   const session = await getServerSession(authOptions);
//   if (!session?.user.user_id) {
//     throw new Error("{ statusCode: 401, message: Unauthorized }");
//   }
//   return session;
// }

async function getUser(email: string) {
  try {
    const user = prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
export default async function getSession(): Promise<Session> {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }
  return session;
}
