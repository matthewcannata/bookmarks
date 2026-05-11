import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmark Studio",
  description: "Design printable bookmarks with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
