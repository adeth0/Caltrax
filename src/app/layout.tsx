import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Archivo, Work_Sans } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";

// Archivo (display/numbers) + Work Sans (body/UI) — chosen for the
// nutrition-facts-label signature: Archivo's heavy weights read with the
// same confident, condensed-adjacent authority as the bold type on a real
// nutrition label, and pairs with Work Sans's quieter humanist body face
// rather than reaching for the same geometric sans every wellness app uses.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-display-family",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body-family",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://caltrax.kavauralabs.com"),
  title: {
    default: "Caltrax — Nutrition & Health, Refined",
    template: "%s · Caltrax",
  },
  description: "Premium nutrition, calorie, macro and health tracking with a clean, distinctive design.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Caltrax",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
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
  themeColor: "#131310",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${archivo.variable} ${workSans.variable}`}>
      <body>
        <ThemeProvider>
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}
