import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

function Header() {
  return (
    <div className="mx-auto flex justify-between px-28 shadow-md">
      <Link href={"/"}>
        <img
          className="h-24 w-56"
          src="https://www.titancapital.vc/wp-content/uploads/2021/12/intervue-company-1.png"
          alt="logo"
        />
      </Link>
      <UserButton />
    </div>
  );
}

export default Header;
