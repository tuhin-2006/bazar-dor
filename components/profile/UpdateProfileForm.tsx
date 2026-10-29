"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Loader2, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";
import { AuthField } from "@/components/auth/AuthField";

interface UpdateProfileFormProps {
  initialName: string;
}

export function UpdateProfileForm({ initialName }: UpdateProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      const message = "আপনার নাম অন্তত ২ অক্ষরের হতে হবে।";
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    const { error: updateError } = await authClient.updateUser({
      name: name.trim(),
    });
    setLoading(false);

    if (updateError) {
      const message = authErrorMessage(
        updateError.message,
        "তথ্য হালনাগাদ করা যায়নি। আবার চেষ্টা করুন।",
      );
      setError(message);
      toast.error(message);
      return;
    }

    toast.success("আপনার তথ্য সফলভাবে হালনাগাদ হয়েছে।");
    router.push("/profile");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <AuthField
        label="নাম"
        name="name"
        type="text"
        value={name}
        onChange={(value) => {
          setName(value);
          setError(null);
        }}
        icon={UserRound}
        autoComplete="name"
        disabled={loading}
      />

      {error ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-danger/15 bg-danger-soft px-3 py-2.5 text-[11.5px] font-medium leading-5 text-danger"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-forest text-[12.5px] font-bold text-white transition hover:bg-forest-light disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            সংরক্ষণ হচ্ছে…
          </>
        ) : (
          "সংরক্ষণ"
        )}
      </button>
    </form>
  );
}
