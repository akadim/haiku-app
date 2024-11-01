import { FC, ReactNode } from "react";

import "./globals.css";
import Link from "next/link";
import ToastProvider from "./ToastProvider";

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <html>
    <body>
      <div className="navbar bg-base-300 shadow-xl mb-5">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            Haiku App
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
      <ToastProvider>{children}</ToastProvider>
      <footer className="text-gray-400 text-center text-xs py-5">
        <p>Copyright &copy; {new Date().getFullYear()} All rights reserved!</p>
      </footer>
    </body>
  </html>
);

export default RootLayout;
