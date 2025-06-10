import Link from "next/link";
import NavLinks from "./(NavLinks)/Navlinks";
import Logo from "../ui/Logo";

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
      {/* Sign Out Button */}
      <form className="mt-8">
        <button
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold py-2 transition hover:bg-emerald-100 hover:text-emerald-900 shadow-sm"
          type="submit"
        >
          {/* <PowerIcon className="w-5 h-5" /> */}
          Sign Out
        </button>
      </form>
    </div>
  );
}
