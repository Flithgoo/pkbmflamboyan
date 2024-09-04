import React from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="#" className="text-sm items-center flex gap-2 font-bold">
      <Image
        src="/logo/Logo_PKBM_no-bg.png"
        width={"45"}
        height={"45"}
        alt="logo-pkbm"
      />
      <div>
        <p className="text-amber-500">PKBM</p>
        <p className="text-emerald-600">Flamboyan</p>
      </div>
    </Link>
  );
};

export default Logo;
