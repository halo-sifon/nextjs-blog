import type { Metadata, Viewport } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import { Toaster } from "sonner";
import ProgressBar from "@/components/progress-bar";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

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

// SEO 相关配置
export const metadata: Metadata = {
  // 基础元数据
  title: {
    default: "Sifon的博客 - 前端开发工程师的技术分享",
    template: "%s | Sifon的博客",
  },
  description:
    "专注于前端开发技术分享，包括 React、Next.js、TypeScript、Tailwind CSS 等技术栈的实践经验和教程。分享 Web 开发、性能优化、工程化等领域的深度思考。",
  keywords: [
    "前端开发",
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "技术博客",
    "Web开发",
    "前端工程师",
    "性能优化",
    "工程化",
  ],
  authors: [{ name: "Sifon", url: "https://github.com/halo-sifon" }],
  creator: "Sifon",
  publisher: "Sifon",

  // 其他元数据
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// 视口配置
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 2,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${notoSerifSC.variable} ${notoSansSC.variable}`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          <ProgressBar />
          <Toaster position="top-right" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
