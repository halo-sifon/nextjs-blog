import Footer from "~/components/footer";
import Header from "~/components/header";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-col min-h-screen relative">
      <Header />
      <main className="flex-grow sm:mt-4">{children}</main>
      <Footer />
    </main>
  );
}
