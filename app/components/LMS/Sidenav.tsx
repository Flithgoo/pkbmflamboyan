import Link from "next/link";
import NavLinks from "./(NavLinks)/Navlinks";
import Logo from "../ui/Logo";
import { logoutAction } from "@/lib/actions/logout"; // import server action

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-4 py-6 bg-white rounded-2xl shadow-md">
      {/* Logo Section */}
      <div className="mb-8 flex items-center justify-center">
        <Logo />
      </div>
      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-2">
        <NavLinks />
      </nav>
      {/* Sign Out Button */}
      <form className="mt-8" action={logoutAction}>
        <button
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold py-2 transition hover:bg-emerald-100 hover:text-emerald-900 shadow-sm"
          type="submit"
        >
          Sign Out
        </button>
      </form>
    </div>
  );
}
