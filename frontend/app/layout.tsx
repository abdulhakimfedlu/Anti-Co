import type { Metadata } from "next";
import { Inter, Noto_Sans_Ethiopic } from "next/font/google";
import { ThemeProvider } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  variable: "--font-ethiopic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Woreda 05 Yeka Subcity — Anti-Corruption Committee",
  description:
    "Report corruption safely and confidentially. The Woreda 05 Yeka Subcity Anti-Corruption Committee is here to listen, protect your identity, and take action on every complaint.",
  keywords: [
    "anti-corruption",
    "Woreda 05",
    "Yeka Subcity",
    "complaint submission",
    "Ethiopia",
    "report corruption",
  ],
  openGraph: {
    title: "Woreda 05 Yeka Subcity — Anti-Corruption Committee",
    description:
      "Your voice matters. Report corruption safely and confidentially.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${notoSansEthiopic.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
