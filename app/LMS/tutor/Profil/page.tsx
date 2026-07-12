"use client";

import { ProfileCard } from "@components/Profil/ProfileCard";
import { ChangePasswordForm } from "@components/Profil/ChangePasswordForm";
import { useUserStore } from "@/src/store/useUserStore";
import Loading from "@/app/components/Loading";

export default function UbahPasswordTutorPage() {
  const { user } = useUserStore();
  if (!user) {
    return <Loading text="Loading Profil Tutor" />;
  }

  return (
    <div className="w-full flex flex-col items-center gap-6 p-4 md:p-8">
      <div className="w-full">
        <h1 className="text-xl font-semibold text-emerald-700">
          Pengaturan Akun
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola profil dan keamanan akun tutor Anda
        </p>
      </div>
      <div className="w-full flex flex-col lg:flex-row justify-stretch gap-5">
        <ProfileCard user={user} />

        <ChangePasswordForm />
      </div>
    </div>
  );
}
