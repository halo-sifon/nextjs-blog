"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface VideoInfo {
  pageTitle: string;
  src: string[];
}

export default function DouyinDownload() {
  const [shareUrl, setShareUrl] = useState(
    "0.05 11/11 E@U.LJ lcN:/ 蔡康永说，当你看到两个人在路边和颜悦色、谈笑风生的聊天，你不会去关注他们，当他们吵架、打架大家就会蜂拥而来看热闹，这是人性可“斗嘴生事”得来的流量关注，负面影响更大 # 提升自己 # 郑州 # 亮亮丽君  https://v.douyin.com/iyu2SjEj/ 复制此链接，打开Dou音搜索，直接观看视频！"
  );
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
              {videoInfo.src.map((src, index) => (
                <div key={src} className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    视频源 {index + 1}
                  </p>
                  <video
                    controls
                    className="w-full h-auto"
                    crossOrigin="anonymous"
                  >
                    <source
                      src={`/api/douyin/play?url=${encodeURIComponent(src)}`}
                      type="video/mp4"
                    />
                    您的浏览器不支持视频播放
                  </video>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
