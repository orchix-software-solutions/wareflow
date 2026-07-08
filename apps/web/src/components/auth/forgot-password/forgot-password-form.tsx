"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, User, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import type { SegmentedTab } from "@/components/ui/segmented-tabs";
import { toast } from "@/lib/toast";
import { useForgotPassword } from "@/hooks/auth";
import { useForgotPasswordStore } from "@/store/use-forgot-password-store";
import { ApiError } from "@/services/api-client";

type RecoveryMethod = "username" | "email";

const TABS: SegmentedTab<RecoveryMethod>[] = [
  { id: "username", label: "USERNAME" },
  { id: "email", label: "EMAIL" },
];

export function ForgotPasswordForm() {
  const router = useRouter();
  const [method, setMethod] = useState<RecoveryMethod>("username");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const setIdentifier = useForgotPasswordStore((s) => s.setIdentifier);
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const handleContinue = async () => {
    const target = method === "email" ? email : username;
    const masked =
      method === "email" ? target.replace(/(.{2}).+(@.+)/, "$1***$2") : target.slice(0, 2) + "***";

    try {
      await forgotPassword({ identifier: target });
      setIdentifier(target);
      toast.info({
        title: "Verification Code Sent",
        description: "We've sent a verification code to your registered email address.",
      });
      router.push(
        `/forgot-password/verify-otp?method=${method}&target=${encodeURIComponent(masked)}`,
      );
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Something went wrong";
      toast.error({ title: "Unable to send code", description: message });
    }
  };

  const canContinue = method === "email" ? email.trim().length > 0 : username.trim().length > 0;

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-brand-900">Forgot password?</h1>
        <p className="mt-1 text-sm text-slate-500">
          Tell us how you signed up and we&apos;ll send you a verification code.
        </p>
      </div>

      <SegmentedTabs tabs={TABS} activeTab={method} onChange={setMethod} className="mb-6" />

      <div key={method} className="flex flex-col gap-5">
        {method === "username" ? (
          <Input
            label="Username"
            type="text"
            placeholder="Enter your username"
            autoComplete="username"
            leftIcon={<User className="h-4 w-4" />}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        ) : (
          <Input
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            leftIcon={<Mail className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}

        <Button
          size="lg"
          className="w-full"
          disabled={!canContinue}
          isLoading={isPending}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>

      <button
        type="button"
        onClick={() => router.push("/")}
        className="mt-6 flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </button>
    </div>
  );
}
