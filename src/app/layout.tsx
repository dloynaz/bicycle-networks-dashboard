import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CycleMap — Bicycle Networks Dashboard",
    template: "%s | CycleMap",
  },
  description:
    "Explore bicycle networks around the world with maps, filters, and station details.",
  metadataBase: new URL("https://bicycle-networks-dashboard-2.vercel.app"),
  applicationName: "CycleMap",
  referrer: "origin-when-cross-origin",
  keywords: [
    "bicycle networks",
    "bike sharing",
    "city bikes",
    "maps",
    "Next.js",
    "TypeScript",
  ],
  openGraph: {
    type: "website",
    url: "https://bicycle-networks-dashboard-2.vercel.app",
    siteName: "CycleMap",
    title: "CycleMap — Bicycle Networks Dashboard",
    description:
      "Explore bicycle networks around the world with maps, filters, and station details.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CycleMap — Bicycle Networks Dashboard",
    description:
      "Explore bicycle networks around the world with maps, filters, and station details.",
  },
};

// RootLayout defines the global document shell and shared styles.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Global app shell */}
      <body className={`antialiased`}> 
        {children}
      </body>
    </html>
  );
}
