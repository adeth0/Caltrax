import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://caltrax.kavauralabs.com"),
  title: {
    default: "Caltrax — Nutrition & Health, Refined",
    template: "%s · Caltrax",
  },
  description:
    "Premium nutrition, calorie, macro and health tracking with a clean, Apple-inspired design.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Caltrax",
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Caltrax — Nutrition & Health, Refined",
    description: "Premium nutrition, calorie, macro and health tracking.",
    url: "https://caltrax.kavauralabs.com",
    siteName: "Caltrax",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#090909",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
