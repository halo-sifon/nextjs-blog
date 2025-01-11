import type { Metadata, Viewport } from "next";
import { Noto_Serif_SC, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import Header from "~/components/header";
import Footer from "~/components/footer";
import ProgressBar from "~/components/progress-bar";
import AnimatedLayout from "~/components/animated-layout";
import { ThemeProvider } from "~/providers/theme-provider";
import { Toaster } from "sonner";

const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif",
});

const notoSansSC = Noto_Sans_SC({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Sifon的博客",
  description: "Sifon的博客",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${notoSerifSC.variable} ${notoSansSC.variable} flex flex-col min-h-screen relative`}
      >
        <ThemeProvider>
          <ProgressBar />
          <Header />
          <main className="flex-grow">
            <AnimatedLayout>{children}</AnimatedLayout>
          </main>
          <Footer />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
