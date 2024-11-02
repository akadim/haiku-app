import Link from "next/link";
import React from "react";
import getUserFromCookie from "../lib/getUser";
import { logout } from "@/actions/userController";

const Header = async () => {
  const user = await getUserFromCookie();

  return (
    <div className="navbar bg-base-300 shadow-xl mb-5">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          Haiku App
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          {user && (
            <>
              <li className="mr-2">
                <Link href="/create-haiku" className="btn btn-primary">
                  Create Haiku
                </Link>
              </li>
              <li>
                <form action={logout} className="btn btn-neutral">
                  <button type="submit">Logout</button>
                </form>
              </li>
            </>
          )}
          {!user && (
            <li>
              <Link href="/login">Log In</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
