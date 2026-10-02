import * as z from "zod";

export const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

export type SigninFormValues = z.infer<typeof signinSchema>;

export const forgotPasswordSchema = signinSchema.omit({ password: true });

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const signupObjectSchema = signinSchema.extend({
  name: z.string().min(1, "Name is required"),
  confirmPassword: z.string().min(4, "Password must be at least 4 characters"),
});

export const signupSchema = signupObjectSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  },
);

export type SignupFormValues = z.infer<typeof signupSchema>;

export const resetPasswordSchema = signupObjectSchema
  .omit({
    name: true,
    email: true,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = signupObjectSchema
  .omit({
    email: true,
  })
  .extend({
    image: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => !file || file.size <= 2 * 1024 * 1024,
        "Image size must be less than 2MB",
      )
      .refine(
        (file) =>
          !file ||
          ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        "Image type must be JPEG, PNG, WebP",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
