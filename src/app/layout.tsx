import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Personal Finance App",
  description:
    "Manage your personal finances with ease using our app. Track expenses, set budgets, and achieve your financial goals.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
