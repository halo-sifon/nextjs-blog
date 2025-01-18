"use client";

import { useState, useRef, useCallback } from "react";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import JSZip from "jszip";
import ImagePreview from "~/components/image-preview";
import { showToast } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

interface CompressedImage {
  file: File;
  preview: string;
  size: string;
  name: string;
}

interface NavigatorWithSaveBlob extends Navigator {
  msSaveOrOpenBlob?: (blob: Blob, filename: string) => void;
}

export default function ImageCompressPage() {
  const [originalImages, setOriginalImages] = useState<CompressedImage[]>([]);
  const [compressedImages, setCompressedImages] = useState<CompressedImage[]>(
    []
  );
  const [quality, setQuality] = useState(80);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const compressImage = useCallback(
    async (file: File) => {
      try {
        const safeQuality = Math.max(10, Math.min(100, quality));
        const safeMaxWidth = Math.max(100, Math.min(4096, maxWidth));

        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: safeMaxWidth,
          useWebWorker: true,
          maxIteration: 10,
          quality: safeQuality / 100,
          initialQuality: Math.max(0.5, safeQuality / 100),
        };

        const img = document.createElement("img");
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("图片加载失败"));
          img.src = URL.createObjectURL(file);
        });
        URL.revokeObjectURL(img.src);

        if (img.width <= safeMaxWidth && img.height <= safeMaxWidth) {
          options.maxWidthOrHeight = Math.max(img.width, img.height);
        }

        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        return new Promise<CompressedImage>(resolve => {
          reader.onloadend = () => {
            resolve({
              file: compressedFile,
              preview: reader.result as string,
              size: formatFileSize(compressedFile.size),
              name: file.name,
            });
          };
          reader.readAsDataURL(compressedFile);
        });
      } catch (error) {
        console.error("压缩失败:", error);
        setError("图片压缩失败，请调整压缩参数或尝试其他图片");
        throw error;
      }
    },
    [maxWidth, quality]
  );

  const handleImagesSelect = useCallback(
    async (files: FileList) => {
      setIsCompressing(true);
      const newOriginalImages: CompressedImage[] = [];
      const newCompressedImages: CompressedImage[] = [];

      try {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (!file.type.startsWith("image/")) continue;

          const reader = new FileReader();
          const originalImage = await new Promise<CompressedImage>(resolve => {
            reader.onloadend = () => {
              resolve({
                file,
                preview: reader.result as string,
                size: formatFileSize(file.size),
                name: file.name,
              });
            };
            reader.readAsDataURL(file);
          });

          newOriginalImages.push(originalImage);
          const compressedImage = await compressImage(file);
          newCompressedImages.push(compressedImage);
        }

        setOriginalImages(prev => [...prev, ...newOriginalImages]);
        setCompressedImages(prev => [...prev, ...newCompressedImages]);
      } catch (error) {
        console.error("处理图片失败:", error);
      } finally {
        setIsCompressing(false);
      }
    },
    [compressImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      handleImagesSelect(e.dataTransfer.files);
    },
    [handleImagesSelect]
  );

  const handleMaxWidthChange = (value: number) => {
    setMaxWidth(value);
    setError("");
  };

  const handleMaxWidthBlur = () => {
    if (maxWidth < 100) {
      setMaxWidth(100);
    } else if (maxWidth > 4096) {
      setMaxWidth(4096);
    }
  };

  const handleCompress = async () => {
    if (originalImages.length === 0) return;
    setIsCompressing(true);
    try {
      const newCompressedImages = await Promise.all(
        originalImages.map(img => compressImage(img.file))
      );
      setCompressedImages(newCompressedImages);
    } catch (error) {
      console.error("批量压缩失败:", error);
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    // 尝试使用 navigator.msSaveBlob
    const nav = window.navigator as NavigatorWithSaveBlob;
    if (nav.msSaveOrOpenBlob) {
      nav.msSaveOrOpenBlob(blob, filename);
      return;
    }

    // 回退到创建 a 标签的方式
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;

    // 使用 click() 事件
    const event = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(event);

    window.URL.revokeObjectURL(url);
  };

  const downloadCompressedImages = async () => {
    if (compressedImages.length === 0) return;

    try {
      if (compressedImages.length === 1) {
        // 从 base64 创建 Blob
        const base64Data = compressedImages[0].preview.split(",")[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "image/jpeg" });

        downloadFile(blob, `compressed_${compressedImages[0].name}`);
      } else {
        const zip = new JSZip();
        compressedImages.forEach(img => {
          const base64Data = img.preview.split(",")[1];
          zip.file(`compressed_${img.name}`, base64Data, { base64: true });
        });

        const blob = await zip.generateAsync({ type: "blob" });
        downloadFile(blob, "compressed_images.zip");
      }

      showToast.success("下载成功！");
    } catch (error) {
      console.error("下载失败:", error);
      showToast.error("下载失败，请重试");
    }
  };

  const handlePreview = (src: string) => {
    setPreviewImage(src);
  };

  const handleDelete = (index: number) => {
    setOriginalImages(prev => prev.filter((_, i) => i !== index));
    setCompressedImages(prev => prev.filter((_, i) => i !== index));
    showToast.success("删除成功");
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-6 font-noto-serif">图片压缩</h1>
      <div className="space-y-6">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <div className="text-gray-500">
            <p className="mb-2">拖拽图片到这里，或者</p>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={e =>
                e.target.files && handleImagesSelect(e.target.files)
              }
            />
            <Button onClick={() => fileInputRef.current?.click()}>
              选择图片
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {originalImages.length > 0 && (
          <div className="bg-card rounded-lg p-4">
            <h2 className="text-lg font-bold mb-4 font-noto-serif">压缩选项</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  质量 ({quality}%) - 最小值: 10%
                </label>
                <Input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={e => setQuality(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  最大宽度 (100-4096)
                </label>
                <Input
                  type="number"
                  min="100"
                  max="4096"
                  value={maxWidth}
                  onChange={e => handleMaxWidthChange(Number(e.target.value))}
                  onBlur={handleMaxWidthBlur}
                />
              </div>
              <div className="text-center">
                <Button onClick={handleCompress} disabled={isCompressing}>
                  开始压缩
                </Button>
              </div>
            </div>
          </div>
        )}

        {(originalImages.length > 0 || compressedImages.length > 0) && (
          <div className="space-y-6">
            {originalImages.map((img, index) => (
              <div
                key={index}
                className="relative bg-card rounded-lg p-4 shadow-sm"
              >
                <button
                  onClick={() => handleDelete(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors z-10 text-sm shadow-md"
                  title="删除"
                >
                  ×
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm">原始图片 - {img.name}</h3>
                    <div
                      className="h-40 bg-muted rounded-lg overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handlePreview(img.preview)}
                    >
                      <Image
                        src={img.preview}
                        alt={`原始图片 ${index + 1}`}
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <p className="text-xs text-gray-500">大小: {img.size}</p>
                  </div>
                  {compressedImages[index] && (
                    <div className="space-y-2">
                      <h3 className="font-bold text-sm">
                        压缩后 - {compressedImages[index].name}
                      </h3>
                      <div
                        className="h-40 bg-muted rounded-lg overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() =>
                          handlePreview(compressedImages[index].preview)
                        }
                      >
                        <Image
                          src={compressedImages[index].preview}
                          alt={`压缩后 ${index + 1}`}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>大小: {compressedImages[index].size}</span>
                        <span className="text-green-600">
                          压缩率:{" "}
                          {Math.round(
                            (1 -
                              compressedImages[index].file.size /
                                img.file.size) *
                              100
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {compressedImages.length > 0 && !isCompressing && (
          <div className="text-center">
            <Button onClick={downloadCompressedImages}>
              {compressedImages.length > 1 ? "下载压缩包" : "下载压缩图片"}
            </Button>
          </div>
        )}

        {isCompressing && (
          <div className="text-center py-4">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-500">压缩中...</p>
          </div>
        )}

        {previewImage && (
          <ImagePreview
            src={previewImage}
            onClose={() => setPreviewImage(null)}
          />
        )}
      </div>
    </div>
  );
}
