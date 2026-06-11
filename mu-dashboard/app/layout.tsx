import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MU Admissions Intelligence | Founder's Office",
  description: "Admissions funnel intelligence dashboard for Masters Union",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
