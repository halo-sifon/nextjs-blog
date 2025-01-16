import {
  Book,
  Coffee,
  Gamepad2,
  Github,
  Music,
  Search,
  ShoppingCart,
  Video,
} from "lucide-react";

export default function Home() {
  const navLinks = [
    { name: "百度", url: "https://www.baidu.com", icon: Search, color: "blue" },
    { name: "GitHub", url: "https://github.com", icon: Github, color: "gray" },
    { name: "掘金", url: "https://juejin.cn", icon: Coffee, color: "blue" },
    {
      name: "B站",
      url: "https://www.bilibili.com",
      icon: Video,
      color: "pink",
    },
    { name: "网易云", url: "https://music.163.com", icon: Music, color: "red" },
    {
      name: "淘宝",
      url: "https://www.taobao.com",
      icon: ShoppingCart,
      color: "orange",
    },
    { name: "知乎", url: "https://www.zhihu.com", icon: Book, color: "blue" },
    {
      name: "Steam",
      url: "https://store.steampowered.com",
      icon: Gamepad2,
      color: "purple",
    },
    // 可以继续添加更多导航链接
  ];

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

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      {/* 导航网格 */}
      <div className="w-full max-w-5xl px-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {navLinks.map((link, index) => {
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
    </div>
  );
}
