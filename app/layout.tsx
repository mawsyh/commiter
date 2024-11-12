import type { Metadata } from "next";
// import localFont from "next/font/local";
import { DynaPuff } from 'next/font/google'
import "./globals.css";

const dyna = DynaPuff({
  subsets: ['latin'],
  weight: "400"
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
      </body>
    </html>
  );
}
