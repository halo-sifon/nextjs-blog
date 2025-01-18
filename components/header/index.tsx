"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitch from "@/components/theme-switch";
import { useState, useRef, useEffect } from "react";

// 下拉菜单项接口定义
interface DropdownItem {
  label: string;
  href: string;
  description?: string;
}

// 导航项属性接口
interface NavItemProps {
  href: string;
  children: React.ReactNode;
  dropdownItems?: DropdownItem[];
}

function NavItem({ href, children, dropdownItems }: NavItemProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isActive =
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  // 点击外部关闭下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 如果没有下拉项，渲染普通导航链接
  if (!dropdownItems) {
    return (
      <Link
        href={href}
        className={`text-muted-foreground hover:text-foreground hover:underline decoration-dotted underline-offset-8 transition-colors font-noto-serif ${
          isActive
            ? "text-foreground underline decoration-dotted underline-offset-8"
            : ""
        }`}
      >
        {children}
      </Link>
    );
  }

  // 渲染带下拉菜单的导航项
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center text-muted-foreground hover:text-foreground transition-colors font-noto-serif ${
          isActive
            ? "text-foreground underline decoration-dotted underline-offset-8"
            : ""
        }`}
      >
        {children}
        <svg
          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* 下拉菜单 */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-card ring-1 ring-border">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {dropdownItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-card-foreground hover:bg-muted"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                <div className="font-medium">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-muted-foreground">
                    {item.description}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  // 工具菜单的下拉项配置
  // const toolsDropdownItems: DropdownItem[] = [
  //   {
  //     label: "抖音解析",
  //     href: "/tools/douyin-download",
  //     description: "无水印视频下载",
  //   },
  //   {
  //     label: "图片压缩",
  //     href: "/tools/image-compress",
  //     description: "在线图片压缩工具",
  //   },
  // ];

  return (
    <header className="bg-transparent sticky top-0 left-0 right-0 sm:top-4 z-50">
      <nav className="mx-auto flex max-w-5xl items-center justify-between border-b bg-background/30 p-4 py-2 text-sm backdrop-blur-md transition-colors dark:border-transparent sm:rounded-lg sm:border lg:px-6">
        <Link
          href="/"
          className="flex-shrink-0 text-2xl font-noto-sans font-semibold tracking-widest text-foreground hover:text-muted-foreground transition-colors"
        >
          SIFON
        </Link>
        <nav className="flex items-center space-x-6">
          <ul className="flex space-x-6 items-center">
            <li>
              <NavItem href="/posts">文章</NavItem>
            </li>
            <li>
              <NavItem href="/tools">工具</NavItem>
            </li>
            <li>
              <NavItem href="/about">关于</NavItem>
            </li>
          </ul>
          <ThemeSwitch />
        </nav>
      </nav>
    </header>
  );
}
