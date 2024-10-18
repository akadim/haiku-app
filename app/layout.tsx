import { FC } from "react";

import "./globals.css";

const RootLayout: FC<{ children: React.ReactNode }> = ({ children }) => (
  <html>
    <body>{children}</body>
  </html>
);

export default RootLayout;
