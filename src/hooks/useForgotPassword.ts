import { authClient } from "@/lib/auth-client";
import { ForgotPasswordFormValues } from "@/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (input: ForgotPasswordFormValues) => {
      const { data, error } = await authClient.requestPasswordReset(
        {
          email: input.email,
          redirectTo: "/reset-password",
        },
        {
          onError: (ctx) => {
            throw ctx.error;
          },
        },
      );
      if (error) throw new Error(error.message ?? "The password reset failed.");
      return data;
    },
  });
}
