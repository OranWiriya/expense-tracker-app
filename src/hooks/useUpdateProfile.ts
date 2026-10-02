import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { UpdateProfileFormValues } from "@/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

const useUpdateProfile = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: async (input: UpdateProfileFormValues) => {
      const verifyRes = await fetch("/api/v1/profile/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: input.password }),
      });

      if (!verifyRes.ok) {
        const data = await verifyRes.json();
        throw new Error(data.error ?? "Invalid password.");
      }

      if (input.image) {
        const formdata = new FormData();
        formdata.append("avatar", input.image);

        const imageUpdateRes = await fetch("/api/v1/profile/avatar", {
          method: "POST",
          body: formdata,
        });

        if (!imageUpdateRes.ok) {
          const data = await imageUpdateRes.json();
          throw new Error(data.error ?? "Update profile failed.");
        }
      }

      const { error } = await authClient.updateUser({ name: input.name });
      if (error) throw new Error(error.message ?? "Update profile failed.");
    },

    onSuccess: () => {
      router.push("/overview");
      router.refresh();
    },
    onError: (error) => {
      toast.add({
        title: "Error",
        description: error.message || "Update profile failed.",
        type: "error",
      });
    },
  });
};

export default useUpdateProfile;
