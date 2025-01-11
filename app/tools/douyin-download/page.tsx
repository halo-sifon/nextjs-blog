"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { showToast } from "@/libs/utils";
import axios from "axios";
import Image from "next/image";
import { saveAs } from "file-saver";

interface VideoInfo {
  awemeId: string;
  cover: string;
  images: string[];
  name: string;
  title: string;
  type: "images" | "video";
  video: string;
}

export default function DouyinDownload() {
  const [shareUrl, setShareUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<Partial<VideoInfo> | null>(null);
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);

  // 处理输入文本，提取链接
  const processInputText = (text: string) => {
    // 移除多余的空格和换行符
    text = text.trim();
    
    // 尝试匹配链接
    const urlMatch = text.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      return urlMatch[0];
    }

    // 如果没有找到链接，尝试匹配抖音短链接格式
    const shortUrlMatch = text.match(/v\.douyin\.com\/[a-zA-Z0-9]+/);
    if (shortUrlMatch) {
      return `https://${shortUrlMatch[0]}`;
    }

    // 返回处理后的文本
    return text;
  };

  // 处理粘贴事件
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    const processedText = processInputText(text);
    setShareUrl(processedText);
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const processedText = processInputText(e.target.value);
    setShareUrl(processedText);
  };

  // 解析视频链接
  const handleParse = async () => {
    if (!shareUrl.trim()) {
      showToast.error("请输入分享链接");
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/douyin/parse", {
        url: shareUrl,
      });

      setVideoInfo(data.data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "视频解析失败，请检查链接是否正确";
      showToast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 下载文件
  const downloadFile = async (
    url: string,
    filename: string,
    index?: number
  ) => {
    if (index !== undefined) {
      setDownloadingIndex(index);
    }
    try {
      const response = await fetch(
        `/api/douyin/play?url=${encodeURIComponent(url)}`
      );
      const blob = await response.blob();
      saveAs(blob, filename);
    } catch {
      showToast.error("下载失败，请重试");
    } finally {
      if (index !== undefined) {
        setDownloadingIndex(null);
      }
    }
  };

  // 批量下载图片
  const downloadAllImages = async () => {
    if (!videoInfo?.images) return;

    for (let i = 0; i < videoInfo.images.length; i++) {
      const image = videoInfo.images[i];
      await downloadFile(image, `${videoInfo.name || "图片"}_${i + 1}.jpg`, i);
      // 添加小延迟避免请求过于频繁
      await new Promise(resolve => setTimeout(resolve, 300));
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
            onChange={handleInputChange}
            onPaste={handlePaste}
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
                {videoInfo.title}
              </h2>
            </div>

            {/* 预览区域 */}
            {videoInfo.type === "video" ? (
              <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                <video
                  src={`/api/douyin/play?url=${encodeURIComponent(
                    videoInfo.video || ""
                  )}`}
                  controls
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">
                {videoInfo.images?.map((image, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden bg-gray-100 group"
                  >
                    <div className="aspect-[3/4]">
                      <Image
                        src={`/api/douyin/play?url=${encodeURIComponent(
                          image
                        )}`}
                        alt={`图片 ${index + 1}`}
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        unoptimized
                      />
                    </div>
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          downloadFile(
                            image,
                            `${videoInfo.name || "图片"}_${index + 1}.jpg`,
                            index
                          )
                        }
                        disabled={downloadingIndex === index}
                      >
                        {downloadingIndex === index ? "下载中..." : "下载"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 下载按钮区域 */}
            <div className="flex flex-col gap-2">
              {videoInfo.type === "video" ? (
                <>
                  <Button
                    onClick={() =>
                      downloadFile(
                        videoInfo.video!,
                        `${videoInfo.name || "抖音视频"}.mp4`
                      )
                    }
                    className="flex items-center gap-2"
                  >
                    下载视频
                  </Button>
                </>
              ) : (
                <Button
                  onClick={downloadAllImages}
                  disabled={downloadingIndex !== null}
                  className="flex items-center gap-2"
                >
                  {downloadingIndex !== null
                    ? `正在下载第 ${downloadingIndex + 1} 张`
                    : "下载全部图片"}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
