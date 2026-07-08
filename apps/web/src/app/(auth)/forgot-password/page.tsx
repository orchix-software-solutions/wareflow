import type { Metadata } from "next";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password";

export const metadata: Metadata = {
  title: "Forgot Password | WareFlow",
  description: "Reset your WareFlow account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
