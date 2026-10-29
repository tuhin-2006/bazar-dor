"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleAlert,
  Loader2,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";
import { AuthField } from "@/components/auth/AuthField";
import { SocialButtons } from "@/components/auth/SocialButtons";

interface SignUpFormProps {
  redirectTo: string;
  socialProviders?: Record<"google" | "github", boolean>;
  socialError?: boolean;
}

export function SignUpForm({
  redirectTo,
  socialProviders,
  socialError,
}: SignUpFormProps) {
  const router = useRouter();
  const notified = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socialError || notified.current) return;

    toast.error(
      "সোশ্যাল লগইন সম্পন্ন হয়নি। আবার চেষ্টা করুন অথবা ইমেইল দিয়ে সাইন আপ করুন।",
    );
    notified.current = true;
  }, [socialError]);

  function validate(): boolean {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (name.trim().length < 2) {
      errors.name = "আপনার নাম অন্তত ২ অক্ষরের হতে হবে।";
    }

    if (!email.trim()) {
      errors.email = "ইমেইল ঠিকানাটি দিন।";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "সঠিক ইমেইল ঠিকানা লিখুন।";
    }

    if (password.length < 8) {
      errors.password = "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে।";
    } else if (password.length > 128) {
      errors.password = "পাসওয়ার্ড ১২৮ অক্ষরের কম হতে হবে।";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "পাসওয়ার্ডটি আবার লিখুন।";
    } else if (confirmPassword !== password) {
      errors.confirmPassword = "দুটি পাসওয়ার্ড মিলছে না।";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!validate()) {
      toast.error("ফর্মের তথ্যগুলো ঠিকভাবে পূরণ করুন।");
      return;
    }

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim(),
      password,
      callbackURL: redirectTo,
    });

    if (error) {
      setLoading(false);
      const message = authErrorMessage(
        error.message,
        "অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।",
      );
      setFormError(message);
      toast.error(message);
      return;
    }

    // The assignment expects new users to sign in explicitly after registering.
    await authClient.signOut();
    setLoading(false);

    toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন।");
    const query = new URLSearchParams({
      registered: "1",
      email: email.trim(),
    });
    if (redirectTo !== "/") query.set("redirect", redirectTo);
    router.push(`/signin?${query.toString()}`);
    router.refresh();
  }

  const signinHref =
    redirectTo === "/"
      ? "/signin"
      : `/signin?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthField
          label="নাম"
          name="name"
          type="text"
          value={name}
          onChange={(value) => {
            setName(value);
            setFieldErrors((current) => ({ ...current, name: undefined }));
          }}
          placeholder="যেমন: রাফি আহমেদ"
          icon={UserRound}
          autoComplete="name"
          error={fieldErrors.name}
          disabled={loading}
        />
        <AuthField
          label="ইমেইল"
          name="email"
          type="email"
          value={email}
          onChange={(value) => {
            setEmail(value);
            setFieldErrors((current) => ({ ...current, email: undefined }));
          }}
          placeholder="you@example.com"
          icon={Mail}
          autoComplete="email"
          error={fieldErrors.email}
          disabled={loading}
        />
        <AuthField
          label="পাসওয়ার্ড"
          name="password"
          type="password"
          value={password}
          onChange={(value) => {
            setPassword(value);
            setFieldErrors((current) => ({
              ...current,
              password: undefined,
              confirmPassword: undefined,
            }));
          }}
          placeholder="কমপক্ষে ৮ অক্ষর"
          icon={LockKeyhole}
          autoComplete="new-password"
          error={fieldErrors.password}
          showPasswordToggle={false}
          disabled={loading}
        />
        <AuthField
          label="পাসওয়ার্ড নিশ্চিত করুন"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(value) => {
            setConfirmPassword(value);
            setFieldErrors((current) => ({
              ...current,
              confirmPassword: undefined,
            }));
          }}
          placeholder="আবার লিখুন"
          icon={LockKeyhole}
          autoComplete="new-password"
          error={fieldErrors.confirmPassword}
          showPasswordToggle={false}
          disabled={loading}
        />

        {formError ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-danger/15 bg-danger-soft px-3 py-2.5 text-[12px] font-medium leading-5 text-danger"
          >
            <CircleAlert
              className="mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            {formError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-forest text-[12.5px] font-bold text-white shadow-sm transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              অ্যাকাউন্ট তৈরি হচ্ছে…
            </>
          ) : (
            "অ্যাকাউন্ট তৈরি করুন"
          )}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[10px] font-medium text-muted">অথবা</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <SocialButtons
        callbackURL={redirectTo}
        providers={socialProviders}
        page="signup"
      />

      <p className="mt-4 text-center text-[11.5px] text-muted">
        অ্যাকাউন্ট আছে?{" "}
        <Link
          href={signinHref}
          className="font-bold text-forest underline decoration-forest decoration-2 underline-offset-4 transition hover:text-forest-light"
        >
          সাইন ইন করুন
        </Link>
      </p>
    </div>
  );
}
