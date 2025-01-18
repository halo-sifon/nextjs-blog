"use client";

import { cn, showToast } from "~/lib/utils";
import {
  BarChart2,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Tag,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "~/components/ui";
import axiosInstance from "~/lib/request";

const sidebarItems = [
  {
    title: "仪表盘",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "文章管理",
    href: "/admin/posts",
    icon: FileText,
  },
  {
    title: "文章分类",
    href: "/admin/categories",
    icon: Tag,
  },
  {
    title: "数据统计",
    href: "/admin/analytics",
    icon: BarChart2,
  },
  {
    title: "抖音下载",
    href: "/admin/douyin",
    icon: Video,
  },
  {
    title: "系统设置",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const onLogout = () => {
    console.log("退出登录");

    axiosInstance.post("/user/logout").then(() => {
      showToast.success("退出成功");
      router.replace("/login");
    });
  };

  return (
    <div className="h-screen bg-background">
      {/* 侧边栏 */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-card grid grid-rows-[56px_1fr_auto]">
        {/* Logo */}
        <div className="border-b px-4 grid place-items-center">
          <span className="text-lg font-semibold">管理后台</span>
        </div>

        {/* 导航菜单 */}
        <nav className="space-y-1 px-2 py-4 overflow-y-auto">
          {sidebarItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "grid grid-cols-[20px_1fr] gap-3 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* 底部操作区 */}
        <div className="border-t p-4">
          <Button
            onClick={onLogout}
            variant="outline"
            className="hover:bg-red-500 hover:text-white grid grid-cols-[20px_1fr] gap-2 items-center"
          >
            <LogOut className="h-4 w-4" />
            退出登录
          </Button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="ml-64 min-h-screen">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}
