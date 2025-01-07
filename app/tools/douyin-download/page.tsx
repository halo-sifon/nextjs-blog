"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface VideoInfo {
  pageTitle: string;
  src: string;
}

export default function DouyinDownload() {
  const [shareUrl, setShareUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  // 解析视频链接
  const handleParse = async () => {
    if (!shareUrl.trim()) {
      toast.error("请输入分享链接");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/douyin/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: shareUrl }),
      });

      if (!response.ok) {
        throw new Error("解析失败");
      }

      const data = await response.json();
      console.log(data);

      setVideoInfo(data);
    } catch {
      toast.error("视频解析失败，请检查链接是否正确");
    } finally {
      setIsLoading(false);
    }
  };

  // 下载视频
  const handleDownload = async () => {
    if (!videoInfo) return;

    try {
      const response = await fetch("/api/douyin/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: videoInfo.src }),
      });

      if (!response.ok) {
        throw new Error("下载失败");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${videoInfo.pageTitle || "抖音视频"}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // 添加到下载历史
      toast.success("下载成功");
    } catch {
      toast.error("下载失败，请重试");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">抖音视频下载工具</h1>
        <p className="text-muted-foreground">
          支持无水印下载抖音视频，粘贴分享链接即可使用
        </p>
      </div>

      {/* 输入区域 */}
      <Card className="p-4 space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="请粘贴抖音分享链接"
            value={shareUrl}
            onChange={e => setShareUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleParse} disabled={isLoading}>
            {isLoading ? "解析中..." : "解析视频"}
          </Button>
        </div>
      </Card>

      {/* 视频信息展示 */}
      {videoInfo && (
        <Card className="p-4 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-semibold">{videoInfo.pageTitle}</h2>
              <Button variant={"secondary"} onClick={handleDownload}>
                下载视频
              </Button>
              <video
                src={videoInfo.src}
                controls
                className="w-full h-auto"
              ></video>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
