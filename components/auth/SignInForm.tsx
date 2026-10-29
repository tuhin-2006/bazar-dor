"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CircleAlert,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";
import { AuthField } from "@/components/auth/AuthField";
import { SocialButtons } from "@/components/auth/SocialButtons";

interface SignInFormProps {
  redirectTo: string;
  reason?: string;
  registered?: boolean;
  defaultEmail?: string;
  socialError?: boolean;
  socialProviders?: Record<"google" | "github", boolean>;
}

export function SignInForm({
  redirectTo,
  reason,
  registered,
  defaultEmail = "",
  socialError,
  socialProviders,
}: SignInFormProps) {
  const router = useRouter();
  const notified = useRef(false);
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (notified.current) return;

    if (registered) {
      toast.success("নিবন্ধন সফল হয়েছে! এখন সাইন ইন করুন।");
      notified.current = true;
    } else if (reason === "protected") {
      toast("এই পেজটি দেখতে আগে সাইন ইন করুন।", { icon: "🔒" });
      notified.current = true;
    } else if (socialError) {
      toast.error(
        "সোশ্যাল লগইন সম্পন্ন হয়নি। ইমেইল ও পাসওয়ার্ড দিয়ে চেষ্টা করুন।",
      );
      notified.current = true;
    }
  }, [registered, reason, socialError]);

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "ইমেইল ঠিকানাটি দিন।";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = "সঠিক ইমেইল ঠিকানা লিখুন।";
    }

    if (!password) {
      errors.password = "পাসওয়ার্ডটি দিন।";
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
    const { error } = await authClient.signIn.email({
      email: email.trim(),
      password,
      rememberMe: true,
    });
    setLoading(false);

    if (error) {
      const message = authErrorMessage(
        error.message,
        "সাইন ইন করা যায়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।",
      );
      setFormError(message);
      toast.error(message);
      return;
    }

    toast.success("সাইন ইন সফল হয়েছে! স্বাগতম।");
    router.push(redirectTo);
    router.refresh();
  }

  const signupHref =
    redirectTo === "/"
      ? "/signup"
      : `/signup?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            setFieldErrors((current) => ({ ...current, password: undefined }));
          }}
          placeholder="কমপক্ষে ৮ অক্ষর"
          icon={LockKeyhole}
          autoComplete="current-password"
          error={fieldErrors.password}
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
              সাইন ইন হচ্ছে…
            </>
          ) : (
            "সাইন ইন"
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
        page="signin"
      />

      <p className="mt-5 text-center text-[11.5px] text-muted">
        অ্যাকাউন্ট নেই?{" "}
        <Link
          href={signupHref}
          className="font-bold text-forest underline decoration-forest decoration-2 underline-offset-4 transition hover:text-forest-light"
        >
          সাইন আপ করুন
        </Link>
      </p>
    </div>
  );
}
