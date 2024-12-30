'use client';

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="text-2xl font-noto-sans font-semibold tracking-wider text-gray-800 hover:text-gray-600 transition-colors"
          >
            Sifon&apos;s博客
          </Link>
          <nav>
            <ul className="flex space-x-6 items-center">
              <li>
                <Link
                  href="/posts"
                  className="text-gray-600 hover:text-gray-900 transition-colors font-noto-serif"
                >
                  文章
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-gray-600 hover:text-gray-900 transition-colors font-noto-serif"
                >
                  工具
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
