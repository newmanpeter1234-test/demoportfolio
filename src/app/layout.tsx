import type { Metadata, Viewport } from "next";
import { Syne, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-grotesk",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Arjun Mehta® — Creative Developer & Digital Designer",
  description:
    "Award-winning creative developer crafting immersive 3D experiences, scroll choreography and interfaces people remember. From Bengaluru to the browser.",
  keywords: [
    "creative developer",
    "portfolio",
    "WebGL",
    "Three.js",
    "motion design",
    "Next.js",
  ],
  authors: [{ name: "Arjun Mehta" }],
  openGraph: {
    title: "Arjun Mehta® — Creative Developer",
    description:
      "Immersive 3D experiences, scroll choreography and interfaces people remember.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${syne.variable} ${grotesk.variable} ${mono.variable} font-sans antialiased bg-[#0A0A0B] text-[#F2F1EA] overflow-x-clip`}
      >
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#141416",
              border: "1px solid rgba(242,241,234,0.12)",
              color: "#F2F1EA",
              borderRadius: "10px",
              fontFamily: "var(--font-grotesk), sans-serif",
            },
          }}
        />
      </body>
    </html>
  );
}
