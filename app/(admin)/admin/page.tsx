"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">仪表盘</h1>
        <p className="text-muted-foreground mt-2">欢迎使用管理后台</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">文章管理</h2>
          <p className="text-muted-foreground mb-4">管理你的博客文章</p>
          <Button
            onClick={() => router.push("/admin/posts")}
            className="w-full"
          >
            进入管理
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">数据统计</h2>
          <p className="text-muted-foreground mb-4">查看网站统计数据</p>
          <Button
            onClick={() => router.push("/admin/analytics")}
            className="w-full"
          >
            查看数据
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">抖音下载</h2>
          <p className="text-muted-foreground mb-4">查看下载的抖音视频</p>
          <Button
            onClick={() => router.push("/admin/douyin")}
            className="w-full"
          >
            抖音视频
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">系统设置</h2>
          <p className="text-muted-foreground mb-4">管理网站配置</p>
          <Button
            onClick={() => router.push("/admin/settings")}
            className="w-full"
          >
            修改设置
          </Button>
        </Card>
      </div>
    </div>
  );
}
