import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

const useUpdateProfile = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: async (input: { name: string; password: string }) => {
      const verifyRes = await fetch("/api/v1/profile/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: input.password }),
      });

      if (!verifyRes.ok) {
        const data = await verifyRes.json();
        throw new Error(data.error ?? "Invalid password.");
      }

      const { error } = await authClient.updateUser({ name: input.name });
      if (error) throw new Error(error.message ?? "Update profile failed.");
    },
    onSuccess: () => {
      router.push("/overview");
    },
  });
};

export default useUpdateProfile;
