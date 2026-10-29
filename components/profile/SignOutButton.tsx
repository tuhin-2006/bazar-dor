"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    const { error } = await authClient.signOut();
    setLoading(false);

    if (error) {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
      return;
    }

    toast.success("সাইন আউট হয়েছে। আবার দেখা হবে!");
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-danger/30 bg-white px-3.5 text-[11.5px] font-semibold text-danger transition hover:bg-danger-soft disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <LogOut className="size-4" aria-hidden="true" />
      )}
      সাইন আউট
    </button>
  );
}
