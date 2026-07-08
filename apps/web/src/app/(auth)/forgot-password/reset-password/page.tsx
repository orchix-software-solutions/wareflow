import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { ResetPasswordForm } from "@/components/auth/forgot-password";

export const metadata: Metadata = {
  title: "Reset Password | WareFlow",
  description: "Set a new password for your WareFlow account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
