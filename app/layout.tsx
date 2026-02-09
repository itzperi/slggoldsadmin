import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SLG Thangangal | Secure Gold & Silver Investment Schemes",
  description: "Join SLG Thangangal for secure and flexible gold and silver investment schemes. Track your wealth with our integrated mobile app and professional management.",
  keywords: ["Gold Scheme", "Silver Scheme", "Investment", "Wealth Building", "SLG Golds", "Secure Investment"],
  authors: [{ name: "SLG Thangangal Team" }],
  openGraph: {
    title: "SLG Thangangal | Secure Gold & Silver Investment Schemes",
    description: "Start your investment journey today with trusted gold and silver schemes.",
    type: "website",
    url: "https://slggolds.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
