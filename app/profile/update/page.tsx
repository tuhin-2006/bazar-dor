import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, House } from "lucide-react";
import { getSession } from "@/lib/session";
import { UpdateProfileForm } from "@/components/profile/UpdateProfileForm";

export const metadata: Metadata = {
  title: "তথ্য হালনাগাদ",
  robots: { index: false, follow: false },
};

export default async function UpdateProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?redirect=%2Fprofile%2Fupdate&reason=protected");
  }

  return (
    <div className="shell py-8 sm:py-10">
      <div className="mx-auto max-w-2xl">
        <nav
          aria-label="ব্রেডক্রাম্ব"
          className="flex items-center gap-1.5 text-[11.5px] font-medium text-muted"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1 transition hover:text-forest"
          >
            <House className="size-3.5" aria-hidden="true" />
            হোম
          </Link>
          <ChevronRight className="size-3.5 opacity-50" aria-hidden="true" />
          <Link href="/profile" className="transition hover:text-forest">
            আমার প্রোফাইল
          </Link>
          <ChevronRight className="size-3.5 opacity-50" aria-hidden="true" />
          <span className="font-semibold text-forest">তথ্য হালনাগাদ</span>
        </nav>

        <div className="mt-4">
          <h1 className="font-display text-xl font-bold text-ink sm:text-2xl">
            তথ্য হালনাগাদ করুন
          </h1>
          <p className="mt-1 text-[11.5px] leading-5 text-muted">
            আপনার নাম পরিবর্তন করে সংরক্ষণ করুন।
          </p>
        </div>

        <section className="mt-4 rounded-xl border border-line bg-white p-4 shadow-card sm:p-5">
          <UpdateProfileForm initialName={session.user.name} />
        </section>
      </div>
    </div>
  );
}
