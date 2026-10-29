import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { githubConfigured, googleConfigured } from "@/lib/auth";
import { safeRedirect } from "@/lib/safe-redirect";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "সাইন আপ",
  description:
    "বাজার দর-এ নতুন অ্যাকাউন্ট খুলুন এবং নিত্যপণ্যের আজকের দাম, বাজারভিত্তিক তুলনা ও দামের প্রবণতা দেখুন।",
};

export default async function SignUpPage(props: PageProps<"/signup">) {
  const searchParams = await props.searchParams;
  const session = await getSession();
  const redirectTo = safeRedirect(searchParams.redirect);

  if (session) {
    redirect(redirectTo);
  }

  return (
    <AuthShell
      title="অ্যাকাউন্ট তৈরি করুন"
      subtitle="বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।"
      footer={
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted transition hover:text-forest"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          হোম পেজে ফিরে যান
        </Link>
      }
    >
      <SignUpForm
        redirectTo={redirectTo}
        socialProviders={{ google: googleConfigured, github: githubConfigured }}
        socialError={typeof searchParams.error === "string"}
      />
    </AuthShell>
  );
}
