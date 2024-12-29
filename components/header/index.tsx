import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-zcool-kuaile text-gray-900 hover:text-gray-700 transition-colors">
            Sifon&apos;s博客
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link
                  href="/posts"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  文章
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
