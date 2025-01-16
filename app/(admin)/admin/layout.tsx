"use client"

import { ThemeProvider } from "@/providers/theme-provider"
import { Toaster } from "sonner"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/libs/utils"
import { LayoutDashboard, FileText, BarChart2, Settings, LogOut } from "lucide-react"

const sidebarItems = [
  {
    title: "仪表盘",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "文章管理",
    href: "/admin/posts",
    icon: FileText
  },
  {
    title: "数据统计",
    href: "/admin/analytics",
    icon: BarChart2
  },
  {
    title: "系统设置",
    href: "/admin/settings",
    icon: Settings
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex h-screen">
          {/* 侧边栏 */}
          <aside className="w-64 border-r bg-card">
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="flex h-14 items-center border-b px-4">
                <span className="text-lg font-semibold">管理后台</span>
              </div>
              
              {/* 导航菜单 */}
              <nav className="flex-1 space-y-1 px-2 py-4">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  )
                })}
              </nav>

              {/* 底部操作区 */}
              <div className="border-t p-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 dark:hover:bg-red-900/20">
                  <LogOut className="h-4 w-4" />
                  退出登录
                </button>
              </div>
            </div>
          </aside>

          {/* 主内容区 */}
          <main className="flex-1 overflow-y-auto">
            <div className="container py-6">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </ThemeProvider>
    </div>
  )
} 