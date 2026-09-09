import type { Metadata } from "next";

import {
  Geist,
  Geist_Mono,
  Noto_Sans,
  EB_Garamond,
} from "next/font/google";

import "./globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "sonner";

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

import { getMe } from "@/service/getme";

const ebGaramondHeading = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GearUp",
  description: "Gear rental platform",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const user = await getMe();

  console.log("USER FROM LAYOUT:", user);

  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        notoSans.variable,
        ebGaramondHeading.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <Navbar user={user} />

        <Toaster position="top-right" richColors />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}