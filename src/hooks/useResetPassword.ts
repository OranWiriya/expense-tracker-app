import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

export function useResetPassword() {
  return useMutation({
    mutationFn: async (input: { newPassword: string; token: string }) => {
      const { data, error } = await authClient.resetPassword(input, {
        onError: (ctx) => {
          throw ctx.error;
        },
      });
      if (error) throw new Error(error.message ?? "เปลี่ยนรหัสผ่านไม่สำเร็จ");
      return data;
    },
  });
}
