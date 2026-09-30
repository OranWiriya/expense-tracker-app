import { authClient } from "@/lib/auth-client";
import { SignupFormValues } from "@/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";

export function useSignup() {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: async (input: SignupFormValues) => {
      const { data, error } = await authClient.signUp.email(
        {
          name: input.name,
          email: input.email,
          password: input.password,
        },
        {
          onError: (ctx) => {
            throw ctx.error;
          },
        },
      );
      if (error) throw new Error(error.message ?? "The registration failed.");
      return data;
    },
  });
}
