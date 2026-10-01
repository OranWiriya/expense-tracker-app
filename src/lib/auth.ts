import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma"; // your prisma client instance
import { resend } from "./resend";

export const auth = betterAuth({
  // if you want to change the base path pls do on your .env and change matcher in proxy.ts
  basePath: process.env.AUTH_BASE_PATH || "/api/v1/auth",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 4,
    sendResetPassword: async ({ user, token }) => {
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
      await resend.emails.send({
        from: "onboarding@resend.dev", // change this to your own verify email
        to: user.email,
        subject: "Reset Password for Expense Tracker",
        html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      });
    },
  },

  plugins: [nextCookies()],
});
