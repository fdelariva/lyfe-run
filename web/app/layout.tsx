import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lyfe Run — The Coaching Platform for Running Coaches",
  description:
    "Manage athletes, deliver AI-powered training plans, integrate Garmin and Apple Watch, and grow your running coaching business. Try free for 14 days.",
  keywords: [
    "running coach platform",
    "treinamento corrida",
    "plataforma treinador corrida",
    "Garmin coaching",
  ],
  openGraph: {
    title: "Lyfe Run — Build Your Running Coaching Business",
    description:
      "The all-in-one platform for running coaches. Plans, wearables, payments, and AI — everything in one place.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
