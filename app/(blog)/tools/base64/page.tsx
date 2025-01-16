"use client";

import { showToast } from "@/libs/utils";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function Base64Page() {
  const [textInput, setTextInput] = useState("");
  const [base64Input, setBase64Input] = useState("");

  const encodeText = () => {
    if (!textInput.trim()) {
      showToast.error("请输入要编码的文本");
      return;
    }
    try {
      const encoded = btoa(encodeURIComponent(textInput));
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
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-6 font-noto-serif">Base64 转换</h1>
      <div className="space-y-6">
        {/* 文本转 Base64 */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">文本转 Base64</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                输入文本
              </label>
              <textarea
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                className="w-full h-32 p-2 border rounded-lg resize-none"
                placeholder="在此输入要转换的文本..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={encodeText}>转换为 Base64</Button>
              {textInput && (
                <>
                  <Button onClick={() => copyToClipboard(textInput)}>
                    复制文本
                  </Button>
                  <Button
                    onClick={() => {
                      const blob = new Blob([textInput], {
                        type: "text/plain;charset=utf-8",
                      });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.style.display = "none";
                      a.href = url;
                      a.download = "text_file.txt";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                      showToast.success("文件下载成功");
                    }}
                  >
                    下载文本
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Base64 转文本 */}
        <div className="bg-card rounded-lg p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Base64 转文本</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                输入 Base64
              </label>
              <textarea
                value={base64Input}
                onChange={e => setBase64Input(e.target.value)}
                className="w-full h-32 p-2 border rounded-lg resize-none"
                placeholder="在此输入 Base64 字符串..."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={decodeBase64}>转换为文本</Button>
              {base64Input && (
                <>
                  <Button onClick={() => copyToClipboard(base64Input)}>
                    复制 Base64
                  </Button>
                  <Button
                    onClick={() => {
                      const blob = new Blob([base64Input], {
                        type: "text/plain;charset=utf-8",
                      });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.style.display = "none";
                      a.href = url;
                      a.download = "base64_file.txt";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                      showToast.success("文件下载成功");
                    }}
                  >
                    下载 Base64
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
