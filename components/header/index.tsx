"use client";

import Link from "next/link";
import ThemeSwitch from "~/components/theme-switch";
export default function Header() {
  return (
    <header className="shadow-sm bg-white dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-noto-sans font-semibold tracking-wider text-gray-800 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            Sifon&apos;s博客
          </Link>
          <nav className="flex items-center space-x-6">
            <ul className="flex space-x-6 items-center">
              <li>
                <Link
                  href="/posts"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-noto-serif"
                >
                  文章
                </Link>
              </li>
              <li>
                <Link
                  href="/tools"
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-noto-serif"
                >
                  工具
                </Link>
              </li>
            </ul>
            <ThemeSwitch />
          </nav>
        </div>
      </div>
    </header>
  );
}
