import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Disclaimer from "@/components/Disclaimer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Can My Landlord...? | Know Your Tenant Rights",
  description:
    "Upload your lease and ask AI-powered questions about your tenant rights. Understand what your landlord can and cannot do.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Disclaimer />
        {children}
      </body>
    </html>
  );
}
