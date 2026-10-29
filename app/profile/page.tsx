import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { SignOutButton } from "@/components/profile/SignOutButton";
import { UpdateProfileForm } from "@/components/profile/UpdateProfileForm";
import { UserAvatar } from "@/components/ui/UserAvatar";

export const metadata: Metadata = {
  title: "আমার প্রোফাইল",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?redirect=%2Fprofile&reason=protected");
  }

  const user = session.user;

  return (
    <div className="flex flex-1 flex-col bg-[#f5f8f4]">
      <div className="shell flex flex-1 flex-col py-8 sm:py-10">
        <div className="mx-auto w-full max-w-[600px]">
          <div className="mb-5">
            <h1 className="font-display text-xl font-bold text-ink sm:text-2xl">
              আমার প্রোফাইল
            </h1>
            <p className="mt-1.5 text-[12px] leading-5 text-muted sm:text-[13px]">
              আপনার অ্যাকাউন্টের তথ্য দেখুন ও হালনাগাদ করুন।
            </p>
          </div>

          <section className="flex flex-col gap-3 rounded-xl border border-line bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3.5">
              <UserAvatar
                name={user.name}
                src={user.image}
                className="size-14 rounded-xl"
                textClassName="text-lg"
              />
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-ink">
                  {user.name}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-muted">
                  {user.email}
                </p>
              </div>
            </div>

            <SignOutButton />
          </section>

          <section className="mt-4 rounded-xl border border-line bg-white p-4 shadow-card sm:p-5">
            <h2 className="mb-4 text-[15px] font-bold text-ink">তথ্য</h2>
            <UpdateProfileForm initialName={user.name} />
          </section>
        </div>
      </div>
    </div>
  );
}
