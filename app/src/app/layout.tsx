import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Humor Lab",
  description: "Understanding the mechanics of funny — a collaborative creativity amplifier",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
