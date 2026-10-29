import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignInForm } from "@/components/auth/SignInForm";
import { githubConfigured, googleConfigured } from "@/lib/auth";
import { safeRedirect } from "@/lib/safe-redirect";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "সাইন ইন",
  description:
    "বাজার দর-এ সাইন ইন করে নিত্যপণ্যের বিস্তারিত বাজারদর ও ১২টি বাজারের তুলনা দেখুন।",
};

export default async function SignInPage(props: PageProps<"/signin">) {
  const searchParams = await props.searchParams;
  const session = await getSession();

  if (session) {
    redirect(safeRedirect(searchParams.redirect));
  }

  return (
    <AuthShell
      title="সাইন ইন"
      subtitle="বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।"
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
      <SignInForm
        redirectTo={safeRedirect(searchParams.redirect)}
        reason={
          typeof searchParams.reason === "string"
            ? searchParams.reason
            : undefined
        }
        registered={searchParams.registered === "1"}
        defaultEmail={
          typeof searchParams.email === "string" ? searchParams.email : ""
        }
        socialError={typeof searchParams.error === "string"}
        socialProviders={{ google: googleConfigured, github: githubConfigured }}
      />
    </AuthShell>
  );
}
