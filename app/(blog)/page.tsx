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

type ColorType = "blue" | "gray" | "pink" | "red" | "orange" | "purple";

const getColorClasses = (color: string) => {
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

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const navLinks: {
    name: string;
    url: string;
    icon: React.ElementType;
    color: ColorType;
    category: string;
  }[] = [
    {
      name: "Bing",
      url: "https://www.bing.com",
      icon: BingIcon,
      color: "orange",
      category: "搜索导航",
    },
    {
      name: "Google",
      url: "https://www.google.com",
      icon: GoogleIcon,
      color: "blue",
      category: "搜索导航",
    },
    {
      name: "GitHub",
      url: "https://github.com",
      icon: GithubIcon,
      color: "gray",
      category: "搜索导航",
    },
    {
      name: "PDF Guru Anki",
      url: "https://guru.kevin2li.top",
      icon: PDFIcon,
      color: "pink",
      category: "实用工具",
    },
    {
      name: "图片压缩",
      url: "https://tinify.cn/",
      icon: ImageCompressIcon,
      color: "purple",
      category: "实用工具",
    },
  ];

  // 根据 category 对 navLinks 进行分组
  const groupedNavLinks = navLinks.reduce((acc, link) => {
    if (!acc[link.category]) {
      acc[link.category] = [];
    }
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, typeof navLinks>);

  // 过滤导航链接
  const filteredNavLinks = Object.entries(groupedNavLinks).reduce(
    (acc, [category, links]) => {
      const filteredLinks = links.filter(link =>
        link.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredLinks.length > 0) {
        acc[category] = filteredLinks;
      }
      return acc;
    },
    {} as Record<string, typeof navLinks>
  );

  return (
    <div className="flex flex-col items-center justify-center bg-background">
      {/* 搜索框 */}
      <div className="w-full max-w-5xl p-4">
        <div className="relative w-full mb-6">
          <Input
            type="text"
            placeholder="搜索导航..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>
        {Object.entries(filteredNavLinks).map(([category, links]) => (
          <div key={category}>
            <h2 className="text-lg font-bold mb-2">{category}</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
              {links.map((link, index) => {
                const colorClasses = getColorClasses(link.color);
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
