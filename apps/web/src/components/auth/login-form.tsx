"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// ── Schemas ────────────────────────────────────────────────
const emailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const userIdSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
});

type EmailValues = z.infer<typeof emailSchema>;
type UserIdValues = z.infer<typeof userIdSchema>;

type Tab = "email" | "userId";

const TABS: { id: Tab; label: string }[] = [
  { id: "userId", label: "USER ID" },
  { id: "email", label: "EMAIL" },
];

// ── Sub-forms ──────────────────────────────────────────────
function EmailForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: EmailValues) => {
    console.log("email login", values);
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

function UserIdForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserIdValues>({
    resolver: zodResolver(userIdSchema),
    defaultValues: { userId: "", password: "" },
  });

  const onSubmit = (values: UserIdValues) => {
    console.log("userId login", values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="User ID"
        type="text"
        placeholder="Enter your user ID"
        autoComplete="username"
        leftIcon={<User className="h-4 w-4" />}
        error={errors.userId?.message}
        required
        {...register("userId")}
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
  const [activeTab, setActiveTab] = useState<Tab>("userId");

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
      <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 rounded-lg py-2 text-[13px] font-medium transition-all duration-200",
              activeTab === tab.id
                ? "bg-white text-brand-900 shadow-sm"
                : "text-slate-400 hover:text-slate-600",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div key={activeTab}>{activeTab === "email" ? <EmailForm /> : <UserIdForm />}</div>
    </div>
  );
}
