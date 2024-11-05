import Link from "next/link";
import NavLinks from "./(NavLinks)/Navlinks";
import Image from "next/image";
import Logo from "../ui/Logo";
// import { PowerIcon } from "@heroicons/react/24/outline";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <div className="mb-2 flex md:flex-col justify-around h-20 bg-gray-100 p-4 md:h-32 rounded-md">
        <Link className="flex items-start justify-start" href="/">
          <div className="w-32 text-white md:w-40">
            <Logo />
          </div>
        </Link>
        <p className="text-slate-900 mt-4 text-base font-medium">
          Halo, Prassetiyo Utomo
        </p>
      </div>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2 text-slate-900">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-amber-500 md:flex-none md:justify-start md:p-2 md:px-3">
            {/* <PowerIcon className="w-6" /> */}
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
