"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SegmentedTabs } from "@/components/ui/segmented-tabs";
import { toast } from "@/lib/toast";
import { useLogin } from "@/hooks/auth";
import { ApiError } from "@/services/api-client";

// ── Schemas ────────────────────────────────────────────────
const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const userIdSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type EmailValues = z.infer<typeof emailSchema>;
type UserIdValues = z.infer<typeof userIdSchema>;

type Tab = "email" | "username";

const TABS: { id: Tab; label: string }[] = [
  { id: "username", label: "USERNAME" },
  { id: "email", label: "EMAIL" },
];

// ── Sub-forms ──────────────────────────────────────────────
function EmailForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { mutateAsync: login } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: EmailValues) => {
    try {
      await login({ identifier: values.email, password: values.password });
      toast.success({
        title: "Welcome Back",
        description: "You have successfully signed in to WareFlow.",
      });
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Something went wrong";
      toast.error({ title: "Sign in failed", description: message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="Email"
        type="email"
        placeholder="you@company.com"
        autoComplete="email"
        leftIcon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
        required
        {...register("email")}
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        autoComplete="current-password"
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
        error={errors.password?.message}
        required
        {...register("password")}
      />

      <div className="flex items-center justify-between">
        <Checkbox checked={rememberMe} onChange={setRememberMe} label="Remember me" />
        <button
          type="button"
          className="text-[13px] font-medium text-brand-600 hover:text-brand-700"
          onClick={() => router.push("/forgot-password")}
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
        Sign In
      </Button>
    </form>
  );
}

function UsernameForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { mutateAsync: login } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserIdValues>({
    resolver: zodResolver(userIdSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: UserIdValues) => {
    try {
      await login({ identifier: values.username, password: values.password });
      toast.success({
        title: "Welcome Back",
        description: "You have successfully signed in to WareFlow.",
      });
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof ApiError ? error.message : "Something went wrong";
      toast.error({ title: "Sign in failed", description: message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="Username"
        type="text"
        placeholder="Enter your username"
        autoComplete="username"
        leftIcon={<User className="h-4 w-4" />}
        error={errors.username?.message}
        required
        {...register("username")}
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        autoComplete="current-password"
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
        error={errors.password?.message}
        required
        {...register("password")}
      />

      <div className="flex items-center justify-between">
        <Checkbox checked={rememberMe} onChange={setRememberMe} label="Remember me" />
        <button
          type="button"
          className="text-[13px] font-medium text-brand-600 hover:text-brand-700"
          onClick={() => router.push("/forgot-password")}
        >
          Forgot password?
        </button>
      </div>

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full">
        Sign In
      </Button>
    </form>
  );
}

// ── Form ───────────────────────────────────────────────────
export function LoginForm() {
  const [activeTab, setActiveTab] = useState<Tab>("username");

  return (
    <div className="w-full">
      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-brand-900">Sign in</h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter your credentials to access your workspace.
        </p>
      </div>

      {/* Tabs */}
      <SegmentedTabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} className="mb-6" />

      {/* Form */}
      <div key={activeTab}>{activeTab === "email" ? <EmailForm /> : <UsernameForm />}</div>
    </div>
  );
}
