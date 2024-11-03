import { FC, ReactNode } from "react";

import "./globals.css";
import ToastProvider from "./ToastProvider";
import Header from "@/components/Header";

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => (
  <html>
    <body>
      <Header />
      <ToastProvider>
        <main className="container mx-auto p-10">{children}</main>
      </ToastProvider>
      <footer className="text-gray-400 text-center text-xs py-5">
        <p>Copyright &copy; {new Date().getFullYear()} All rights reserved!</p>
      </footer>
    </body>
  </html>
);

export default RootLayout;
