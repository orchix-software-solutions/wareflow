import type { Metadata } from "next";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign In | WareFlow",
  description:
    "Sign in to WareFlow to manage inventory, purchases, sales, and reports across your warehouses.",
};

export default function RootPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
