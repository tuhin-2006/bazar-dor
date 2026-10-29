"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, LogOut, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { UserAvatar } from "@/components/ui/UserAvatar";

export function NavbarAuth() {
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  async function handleSignOut() {
    setSigningOut(true);
    const { error } = await authClient.signOut();
    setSigningOut(false);
    setOpen(false);

    if (error) {
      toast.error("সাইন আউট করা যায়নি। আবার চেষ্টা করুন।");
      return;
    }

    toast.success("সাইন আউট হয়েছে। আবার দেখা হবে!");
    router.push("/");
    router.refresh();
  }

  if (isPending) {
    return (
      <div className="flex items-center gap-2" aria-label="অ্যাকাউন্ট লোড হচ্ছে">
        <span className="h-9 w-20 animate-pulse rounded-full bg-paper-deep sm:w-24" />
        <span className="h-9 w-20 animate-pulse rounded-full bg-paper-deep sm:w-24" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Link
          href="/signin"
          className="inline-flex h-8 items-center rounded-md border border-forest/25 px-3 text-[12px] font-semibold text-forest transition hover:border-forest/40 hover:bg-cream"
        >
          সাইন ইন
        </Link>
        <Link
          href="/signup"
          className="inline-flex h-8 items-center rounded-md bg-forest px-3.5 text-[12px] font-semibold text-paper shadow-sm transition hover:bg-forest-light"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-1.5 rounded-full py-1 pl-0 pr-0.5 text-left transition hover:bg-paper sm:gap-2"
      >
        <UserAvatar
          name={user.name}
          src={user.image}
          className="size-8 rounded-lg"
        />
        <span className="hidden max-w-24 truncate text-[12px] font-semibold text-ink sm:block">
          {user.name.trim().split(/\s+/)[0]}
        </span>
        <ChevronDown
          className={`size-3 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-line bg-white shadow-lift"
        >
          <div className="border-b border-line/80 bg-cream/50 px-4 py-3">
            <p className="truncate text-sm font-semibold text-forest">
              {user.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted">{user.email}</p>
          </div>
          <div className="p-1.5">
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-paper"
            >
              <UserRound className="size-4 text-forest" aria-hidden="true" />
              আমার প্রোফাইল
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              disabled={signingOut}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-danger transition hover:bg-danger-soft disabled:opacity-60"
            >
              {signingOut ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <LogOut className="size-4" aria-hidden="true" />
              )}
              সাইন আউট
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
