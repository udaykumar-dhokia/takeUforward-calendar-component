import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Calendar Component - takeUforward",
  description:
    "Calendar Component - takeUforward",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", playfair.variable, dmSans.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Toaster className="font-sans" />
      </body>
    </html>
  );
}
