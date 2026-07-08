import { Sparkles } from "lucide-react";
import type { WelcomeInfo } from "@/lib/types/dashboard";

interface WelcomeCardProps {
  welcome: WelcomeInfo;
}

const ROLE_LABEL: Record<WelcomeInfo["role"], string> = {
  pelajar: "Siswa",
  tutor: "Tutor",
  admin: "Administrator",
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 18) return "Selamat sore";
  return "Selamat malam";
}

export function WelcomeCard({ welcome }: WelcomeCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white shadow-sm sm:p-8">
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 right-16 h-24 w-24 rounded-full bg-amber-500/20" />

      <div className="relative flex flex-col gap-2">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
          <Sparkles className="h-3.5 w-3.5 text-amber-300" />
          {ROLE_LABEL[welcome.role]}
        </span>
        <h1 className="text-xl font-semibold sm:text-2xl">
          {getGreeting()}, {welcome.name}
        </h1>
        {welcome.subtitle && (
          <p className="text-sm text-emerald-50/90">{welcome.subtitle}</p>
        )}
      </div>
    </div>
  );
}
