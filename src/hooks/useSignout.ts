import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const useSignout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["signout"],
    mutationFn: async () => {
      const { error } = await authClient.signOut();
      if (error) throw new Error(error.message ?? "The logout failed.");
    },
    onSuccess: () => {
      queryClient.clear();
      router.push("/signin");
    },
    onError: (error) => {
      toast.add({
        title: "Error",
        description: error.message || "The logout failed.",
        type: "error",
      });
    },
  });
};

export default useSignout;
