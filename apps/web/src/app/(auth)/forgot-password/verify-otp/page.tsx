import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { VerifyOtpForm } from "@/components/auth/forgot-password";

export const metadata: Metadata = {
  title: "Verify Code | WareFlow",
  description: "Enter the verification code sent to your account.",
};

export default function VerifyOtpPage() {
  return (
    <AuthLayout>
      <Suspense>
        <VerifyOtpForm />
      </Suspense>
    </AuthLayout>
  );
}
