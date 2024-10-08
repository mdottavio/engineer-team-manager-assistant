import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Toaster from "./toaster";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Remotely - Manager assistant",
  description: "Remotely - Manager assistant",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
