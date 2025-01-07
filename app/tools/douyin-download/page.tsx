"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { showToast } from "@/libs/utils";

interface VideoInfo {
  pageTitle: string;
  src: string[];
}

export default function DouyinDownload() {
  const [shareUrl, setShareUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  // 处理视频播放，确保只有一个视频在播放
  const handleVideoPlay = (event: React.SyntheticEvent<HTMLVideoElement>) => {
    const currentVideo = event.currentTarget;
    const videos = document.querySelectorAll("video");

    videos.forEach(video => {
      if (video !== currentVideo && !video.paused) {
        video.pause();
      }
    });
  };

  // 解析视频链接
  const handleParse = async () => {
    if (!shareUrl.trim()) {
      showToast.error("请输入分享链接");
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

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || "解析失败");
      }

      setVideoInfo(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "视频解析失败，请检查链接是否正确";
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">抖音视频下载工具</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          支持无水印下载抖音视频，粘贴分享链接即可使用
        </p>
      </div>

      {/* 输入区域 */}
      <Card className="p-3 md:p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="请粘贴抖音分享链接"
            value={shareUrl}
            onChange={e => setShareUrl(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleParse}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "解析中..." : "解析视频"}
          </Button>
        </div>
      </Card>

      {/* 视频信息展示 */}
      {videoInfo && (
        <Card className="p-3 md:p-4 space-y-3 md:space-y-4">
          <div className="space-y-3 md:space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg md:text-xl font-semibold break-all">
                {videoInfo.pageTitle}
              </h2>
              {videoInfo.src.map((src, index) => (
                <div key={src} className="mt-3 md:mt-4">
                  <p className="text-xs md:text-sm text-muted-foreground mb-2">
                    视频源 {index + 1}
                  </p>
                  <div className="aspect-[9/16] max-w-md mx-auto">
                    <video
                      controls
                      className="w-full h-full object-contain bg-black/5 rounded-lg"
                      playsInline
                      onPlay={handleVideoPlay}
                    >
                      <source
                        src={`/api/douyin/play?url=${encodeURIComponent(src)}`}
                        type="video/mp4"
                      />
                      您的浏览器不支持视频播放
                    </video>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
