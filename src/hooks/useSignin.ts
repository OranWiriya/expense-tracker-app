import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

export function useSignin() {
  return useMutation({
    mutationKey: ["signin"],
    mutationFn: async (input: { email: string; password: string }) => {
      const { data, error } = await authClient.signIn.email(input, {
        onError: (ctx) => {
          throw ctx.error;
        },
      });
      if (error) throw new Error(error.message ?? "The login failed.");
      return data;
    },
  });
}
