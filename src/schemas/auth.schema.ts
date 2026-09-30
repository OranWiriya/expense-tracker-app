import * as z from "zod";

export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type SigninFormValues = z.infer<typeof signinSchema>;

export const signupSchema = signinSchema
  .extend({
    name: z.string().min(1, "Name is required"),
    confirmPassword: z
      .string()
      .min(4, "Password must be at least 4 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
