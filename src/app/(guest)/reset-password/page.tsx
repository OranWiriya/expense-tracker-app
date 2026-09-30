"use client";

import { AuthCard } from "@/features/auth/components";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ResetPasswordPage = () => {
  const params = useSearchParams();
  const token = params.get("token");

  if (!token) {
    return <p>Token not found or invalid</p>;
  }

  return (
    <Suspense fallback={<p>loading...</p>}>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <AuthCard token={token} />
        </div>
      </div>
    </Suspense>
  );
};

export default ResetPasswordPage;
