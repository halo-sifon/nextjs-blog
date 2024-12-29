import type { Metadata } from "next";
import { Noto_Serif_SC, ZCOOL_KuaiLe } from "next/font/google";
import "./globals.css";
import Header from "~/components/header";
import Footer from "~/components/footer";
import AnimatedLayout from "~/components/animated-layout";

const notoSerifSC = Noto_Serif_SC({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif",
});

const zcoolKuaiLe = ZCOOL_KuaiLe({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zcool-kuaile",
});

export const metadata: Metadata = {
  title: "Sifon的博客",
  description: "个人博客网站",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSerifSC.variable} ${zcoolKuaiLe.variable} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          <AnimatedLayout>{children}</AnimatedLayout>
        </main>
        <Footer />
      </body>
    </html>
  );
}
