"use client";
import React, { useState } from "react";
import {
  BingIcon,
  GithubIcon,
  GoogleIcon,
  ImageCompressIcon,
  PDFIcon,
  XIcon,
} from "~/components/icon";
import { Input } from "~/components/ui";
import { Search, Code, Package, MessageCircle } from "lucide-react";

type ColorType = "blue" | "gray" | "pink" | "red" | "orange" | "purple";

const getColorClasses = (color: ColorType) => {
  const colorMap: {
    [key: string]: { bg: string; text: string; hover: string };
  } = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      hover: "group-hover:bg-blue-600",
    },
    gray: {
      bg: "bg-gray-50",
      text: "text-gray-600",
      hover: "group-hover:bg-gray-600",
    },
    pink: {
      bg: "bg-pink-50",
      text: "text-pink-600",
      hover: "group-hover:bg-pink-600",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      hover: "group-hover:bg-red-600",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      hover: "group-hover:bg-orange-600",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      hover: "group-hover:bg-purple-600",
    },
  };
  return colorMap[color] || colorMap.blue;
};

const navLinks: {
  title: string;
  links: {
    name: string;
    url: string;
    icon: React.ElementType;
    color: ColorType;
  }[];
}[] = [
  {
    title: "搜索导航",
    links: [
      {
        name: "Bing",
        url: "https://www.bing.com",
        icon: BingIcon,
        color: "orange",
      },
      {
        name: "Google",
        url: "https://www.google.com",
        icon: GoogleIcon,
        color: "blue",
      },
      {
        name: "GitHub",
        url: "https://github.com",
        icon: GithubIcon,
        color: "gray",
      },
      {
        name: "Npm",
        url: "https://www.npmjs.com",
        icon: Package,
        color: "pink",
      },
      {
        name: "ChatGPT",
        url: "https://chatgpt.com",
        icon: MessageCircle,
        color: "red",
      },
    ],
  },
  {
    title: "实用工具",
    links: [
      {
        name: "PDF Guru Anki",
        url: "https://guru.kevin2li.top",
        icon: PDFIcon,
        color: "pink",
      },
      {
        name: "图片压缩",
        url: "https://tinify.cn/",
        icon: ImageCompressIcon,
        color: "purple",
      },
    ],
  },
  {
    title: "项目相关",
    links: [
      {
        name: "Next.js",
        url: "https://nextjs.org",
        icon: Code,
        color: "blue",
      },
      {
        name: "Tailwind CSS",
        url: "https://tailwindcss.com",
        icon: Code,
        color: "gray",
      },
      {
        name: "React",
        url: "https://reactjs.org",
        icon: Code,
        color: "orange",
      },
      {
        name: "TypeScript",
        url: "https://www.typescriptlang.org",
        icon: Code,
        color: "purple",
      },
      {
        name: "Vercel",
        url: "https://vercel.com",
        icon: Code,
        color: "red",
      },
      {
        name: "Cloudflare",
        url: "https://cloudflare.com",
        icon: Code,
        color: "pink",
      },
      {
        name: "Shadcn",
        url: "https://www.shadcn-ui.cn",
        icon: Code,
        color: "orange",
      },
      {
        name: "Mongoose",
        url: "https://mongoosejs.com",
        icon: Code,
        color: "pink",
      },
      {
        name: "Axios",
        url: "https://axios-http.com",
        icon: Code,
        color: "red",
      },
      {
        name: "Sonner",
        url: "https://sonner.emilkowal.ski",
        icon: Code,
        color: "orange",
      },
      {
        name: "JWT",
        url: "https://jwt.io",
        icon: Code,
        color: "purple",
      },
      {
        name: "NProgress",
        url: "https://github.com/rstacruz/nprogress",
        icon: Code,
        color: "gray",
      },
    ],
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  // 过滤导航链接
  const filteredNavLinks = navLinks
    .map(category => ({
      ...category,
      links: category.links.filter(link =>
        link.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(category => category.links.length > 0);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* 搜索框 */}
      <div className="w-full max-w-5xl p-4 my-8">
        <div className="relative flex justify-center w-full mb-6">
          <div className="relative w-full max-w-2xl">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={20} />
            </div>
            <Input
              type="text"
              placeholder="搜索..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="rounded-full pl-12 pr-10 h-12 text-lg"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <XIcon size={20} />
              </button>
            )}
          </div>
        </div>
        {filteredNavLinks.map(category => (
          <div key={category.title}>
            <h2 className="text-lg font-bold mb-2">{category.title}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
              {category.links.map((link, index) => {
                const colorClasses = getColorClasses(link.color as ColorType);
                return (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 hover:border-blue-500 transition-all duration-300 hover:shadow-md">
                      <div
                        className={`p-2 rounded-full ${colorClasses.bg} ${colorClasses.text} ${colorClasses.hover} group-hover:text-white transition-colors mb-2`}
                      >
                        <link.icon size={20} />
                      </div>
                      <span className="text-sm font-medium">{link.name}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
