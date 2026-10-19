import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { http } from "@/lib/http";
import { UpdateProfileFormValues } from "@/schemas/auth.schema";
import { useMutation } from "@tanstack/react-query";

import { useRouter } from "next/navigation";

const useUpdateProfile = () => {
  const router = useRouter();
  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: async (input: UpdateProfileFormValues) => {
      await http.post<UpdateProfileFormValues>(
        "/api/v1/profile/verify-password",
        {
          password: input.password,
        },
      );
      const { error } = await authClient.updateUser({ name: input.name });

      if (input.image) {
        const formdata = new FormData();
        formdata.append("avatar", input.image);
        await http.post("/api/v1/profile/avatar", formdata);
      }

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
