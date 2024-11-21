import type { Metadata } from "next";
// import localFont from "next/font/local";
import { DynaPuff } from 'next/font/google'
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const dyna = DynaPuff({
  subsets: ['latin'],
  weight: "400"
})

export const metadata: Metadata = {
  title: "Commiter",
  description: "Commit to github by Ryan Misaghi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dyna.className} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
