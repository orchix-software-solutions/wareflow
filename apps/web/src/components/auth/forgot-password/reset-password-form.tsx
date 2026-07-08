"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Lock, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/lib/toast";
import { useResetPassword } from "@/hooks/auth";
import { useForgotPasswordStore } from "@/store/use-forgot-password-store";
import { ApiError } from "@/services/api-client";

function getStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const STRENGTH_CONFIG = [
  { label: "", barColor: "", textColor: "" },
  { label: "Weak", barColor: "bg-red-500", textColor: "text-red-500" },
  { label: "Fair", barColor: "bg-orange-400", textColor: "text-orange-400" },
  { label: "Good", barColor: "bg-yellow-400", textColor: "text-yellow-500" },
  { label: "Strong", barColor: "bg-emerald-500", textColor: "text-emerald-600" },
  { label: "Very strong", barColor: "bg-emerald-500", textColor: "text-emerald-600" },
] as const;

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const method = params.get("method") ?? "email";
  const target = params.get("target") ?? "";

  const identifier = useForgotPasswordStore((s) => s.identifier);
  const otp = useForgotPasswordStore((s) => s.otp);
  const resetForgotPasswordFlow = useForgotPasswordStore((s) => s.reset);
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [justSucceeded, setJustSucceeded] = useState(false);

  useEffect(() => {
    if (!justSucceeded && (!identifier || !otp)) {
      router.replace("/forgot-password");
    }
  }, [identifier, otp, justSucceeded, router]);

  const strength = getStrength(password);
  const strengthConfig = STRENGTH_CONFIG[Math.min(strength, STRENGTH_CONFIG.length - 1)]!;
  const filled = Math.round((strength / 5) * 4);

  const confirmError = confirm && confirm !== password ? "Passwords do not match" : undefined;
  const canSubmit = password.length > 0 && password === confirm && confirm.length > 0;

  const handleBack = () => {
    const query = new URLSearchParams({ method, target });
    router.push(`/forgot-password/verify-otp?${query}`);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-brand-900">Reset password</h1>
        <p className="mt-1 text-sm text-slate-500">
          Choose a strong password. You&apos;ll use it to sign in going forward.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {/* New password */}
        <div className="flex flex-col gap-2">
          <Input
            label="New Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            leftIcon={<Lock className="h-4 w-4" />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-slate-400 transition-colors hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Strength bar */}
          {password.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex flex-1 gap-1">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-all duration-300",
                      i < filled ? strengthConfig.barColor : "bg-slate-200",
                    )}
                  />
                ))}
              </div>
              {strengthConfig.label && (
                <span className={cn("shrink-0 text-[12px] font-medium", strengthConfig.textColor)}>
                  {strengthConfig.label}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Confirm password */}
        <Input
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              className="text-slate-400 transition-colors hover:text-slate-600"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          error={confirmError}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        <Button
          size="lg"
          className="w-full"
          disabled={!canSubmit}
          isLoading={isPending}
          onClick={async () => {
            try {
              await resetPassword({ identifier, otp, newPassword: password });
              setJustSucceeded(true);
              resetForgotPasswordFlow();
              toast.success({
                title: "Password Updated",
                description:
                  "Your password has been updated successfully. Please sign in using your new password.",
              });
              router.push("/");
            } catch (error) {
              const message = error instanceof ApiError ? error.message : "Something went wrong";
              toast.error({ title: "Unable to reset password", description: message });
            }
          }}
        >
          Reset Password
        </Button>
      </div>

      <button
        type="button"
        onClick={handleBack}
        className="mt-6 flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>
    </div>
  );
}
