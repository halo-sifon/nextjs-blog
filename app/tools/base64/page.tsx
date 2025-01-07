"use client";

import { useState, useRef } from "react";
import { showToast } from "@/libs/utils";

export default function Base64Page() {
  const [textInput, setTextInput] = useState("");
  const [base64Input, setBase64Input] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const encodeText = () => {
    if (!textInput.trim()) {
      showToast.error("请输入要编码的文本");
      return;
    }
    try {
      const encoded = btoa(unescape(encodeURIComponent(textInput)));
      setBase64Input(encoded);
      showToast.success("编码成功");
    } catch (err: unknown) {
      console.error("编码失败:", err);
      showToast.error("编码失败，请检查输入");
    }
  };

  const decodeBase64 = () => {
    if (!base64Input.trim()) {
      showToast.error("请输入要解码的 Base64 字符串");
      return;
    }
    try {
      const decoded = decodeURIComponent(escape(atob(base64Input)));
      setTextInput(decoded);
      showToast.success("解码成功");
    } catch (err: unknown) {
      console.error("解码失败:", err);
      showToast.error("解码失败，请检查输入是否为有效的 Base64 字符串");
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          // 移除 Data URL 的前缀（例如：data:image/png;base64,）
          const base64Data = result.split(",")[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setBase64Input(base64);
      showToast.success("文件转换成功");
    } catch (err: unknown) {
      console.error("文件处理失败:", err);
      showToast.error("文件处理失败");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const downloadBase64File = () => {
    if (!base64Input.trim()) {
      showToast.error("没有可下载的内容");
      return;
    }

    try {
      const byteCharacters = atob(base64Input);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray]);

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "decoded_file";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showToast.success("文件下载成功");
    } catch (err: unknown) {
      console.error("文件下载失败:", err);
      showToast.error("文件下载失败");
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast.success("已复制到剪贴板");
    } catch (err: unknown) {
      console.error("复制失败:", err);
      showToast.error("复制失败");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 font-noto-serif">Base64 转换</h1>
      
      <div className="space-y-6">
        {/* 文本转 Base64 */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">文本转 Base64</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                输入文本
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="w-full h-32 p-2 border rounded-lg resize-none"
                placeholder="在此输入要转换的文本..."
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={encodeText}
                className="px-4 py-2 bg-blue-500 text-white dark:text-gray-800 dark:bg-gray-200 rounded-lg hover:bg-blue-600 transition-colors"
              >
                转换为 Base64
              </button>
              {textInput && (
                <button
                  onClick={() => copyToClipboard(textInput)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  复制文本
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Base64 转文本 */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Base64 转文本/文件</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                输入 Base64
              </label>
              <textarea
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                className="w-full h-32 p-2 border rounded-lg resize-none"
                placeholder="在此输入 Base64 字符串..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={decodeBase64}
                className="px-4 py-2 bg-blue-500 text-white dark:text-gray-800 dark:bg-gray-200 rounded-lg hover:bg-blue-600 transition-colors"
              >
                转换为文本
              </button>
              <button
                onClick={downloadBase64File}
                className="px-4 py-2 bg-blue-500 text-white dark:text-gray-800 dark:bg-gray-200 rounded-lg hover:bg-blue-600 transition-colors"
              >
                下载为文件
              </button>
              {base64Input && (
                <button
                  onClick={() => copyToClipboard(base64Input)}
                  className="px-4 py-2 bg-gray-500 dark:text-gray-800 dark:bg-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  复制 Base64
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 文件转 Base64 */}
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">文件转 Base64</h2>
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {isProcessing && (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  处理中...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 