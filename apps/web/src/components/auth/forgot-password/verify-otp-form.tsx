"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { OtpInput } from "@/components/ui/otp-input";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { useForgotPassword, useVerifyOtp } from "@/hooks/auth";
import { useForgotPasswordStore } from "@/store/use-forgot-password-store";
import { ApiError } from "@/services/api-client";

const RESEND_SECONDS = 60;

export function VerifyOtpForm() {
  const router = useRouter();
  const params = useSearchParams();
  const method = params.get("method") ?? "email";
  const target = params.get("target") ?? "";

  const identifier = useForgotPasswordStore((s) => s.identifier);
  const setOtpInStore = useForgotPasswordStore((s) => s.setOtp);
  const { mutateAsync: verifyOtp, isPending } = useVerifyOtp();
  const { mutateAsync: resendOtp } = useForgotPassword();

  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!identifier) {
      router.replace("/forgot-password");
    }
  }, [identifier, router]);

  const startCountdown = useCallback(() => {
    setCountdown(RESEND_SECONDS);
    setCanResend(false);
  }, []);

  useEffect(() => {
    if (canResend) return;
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, canResend]);

  const handleResend = async () => {
    setOtp("");
    try {
      await resendOtp({ identifier });
      toast.info({
        title: "Verification Code Sent",
        description: "We've sent a new verification code to your registered email address.",
      });
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Something went wrong";
      toast.error({ title: "Unable to resend code", description: message });
    }
    startCountdown();
  };

  const handleVerify = async () => {
    try {
      await verifyOtp({ identifier, otp });
      setOtpInStore(otp);
      toast.success({
        title: "Verification Successful",
        description: "Your identity has been verified successfully.",
      });
      const query = new URLSearchParams({ method, target });
      router.push(`/forgot-password/reset-password?${query}`);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Something went wrong";
      toast.error({ title: "Verification failed", description: message });
    }
  };

  const methodLabel = method === "email" ? "email" : "username";
  const channelLabel = method === "email" ? "email address" : "registered email";

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-brand-900">Verify your identity</h1>
        <p className="mt-1 text-sm text-slate-500">
          We sent a 6-digit code to the {channelLabel} linked to{" "}
          <span className="font-medium text-slate-700">{target || `your ${methodLabel}`}</span>.
          Enter it below.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <OtpInput length={6} value={otp} onChange={setOtp} label="Verification code" />

        <div className="flex items-center justify-between">
          <span className="text-[13px] text-slate-500">Didn&apos;t receive a code?</span>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="flex items-center gap-1.5 text-[13px] font-medium text-brand-600 hover:text-brand-700"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Resend code
            </button>
          ) : (
            <span className="text-[13px] text-slate-400">
              Resend in{" "}
              <span className="tabular-nums font-medium text-slate-600">
                {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                {String(countdown % 60).padStart(2, "0")}
              </span>
            </span>
          )}
        </div>

        <Button
          size="lg"
          className="w-full"
          disabled={otp.replace(/\D/g, "").length < 6}
          isLoading={isPending}
          onClick={handleVerify}
        >
          Verify
        </Button>
      </div>

      <button
        type="button"
        onClick={() => router.push("/forgot-password")}
        className="mt-6 flex w-full items-center justify-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>
    </div>
  );
}
