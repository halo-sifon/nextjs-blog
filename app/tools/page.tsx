import Link from "next/link";

// 判断是否在 Vercel 环境
const isVercel = process.env.VERCEL === "1";

const tools = [
  {
    title: "图片压缩",
    description: "压缩图片文件大小，支持多种格式",
    href: "/tools/image-compress",
    hiddenInVercel: false, // 在 Vercel 环境下显示
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "Base64 转换",
    description: "文本和文件的 Base64 编码转换工具",
    href: "/tools/base64",
    hiddenInVercel: false, // 在 Vercel 环境下显示
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "抖音解析",
    description: "解析抖音视频链接，获取视频地址",
    href: "/tools/douyin-download",
    hiddenInVercel: true, // 在 Vercel 环境下隐藏
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
];

export default function ToolsPage() {
  // 根据环境过滤工具列表
  const filteredTools = isVercel ? tools.filter(tool => !tool.hiddenInVercel) : tools;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 font-noto-serif text-gray-900 dark:text-gray-200">
        在线工具
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTools.map(tool => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group block p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500 group-hover:text-blue-600 transition-colors">
                {tool.icon}
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-200 group-hover:text-blue-500 transition-colors">
                  {tool.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {tool.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
