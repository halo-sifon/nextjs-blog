"use client";

import { useEffect } from "react";

interface PostContentProps {
  content: string;
}

const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>`;
const copiedIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>`;

export default function PostContent({ content }: PostContentProps) {
  useEffect(() => {
    const addCopyButtons = () => {
      const codeBlocks = document.querySelectorAll("pre");

      codeBlocks.forEach(codeBlock => {
        if (codeBlock.querySelector(".copy-button")) return;

        const copyButton = document.createElement("button");
        copyButton.className =
          "copy-button absolute right-1.5 top-1.5 p-1.5 rounded bg-gray-600/70 hover:bg-gray-600 text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs";
        copyButton.innerHTML = copyIcon;

        copyButton.addEventListener("click", async () => {
          const code = codeBlock.querySelector("code")?.textContent || "";
          await navigator.clipboard.writeText(code);

          copyButton.innerHTML = copiedIcon;

          setTimeout(() => {
            copyButton.innerHTML = copyIcon;
          }, 2000);
        });

        // 添加相对定位到 pre 元素
        codeBlock.style.position = "relative";
        codeBlock.classList.add("group");
        codeBlock.appendChild(copyButton);
      });
    };

    addCopyButtons();
  }, []);

  return (
    <div
      className="prose prose-lg mx-auto font-noto-serif
        prose-headings:font-noto-serif prose-headings:font-bold prose-headings:text-gray-900 
        prose-p:text-gray-600 prose-a:text-blue-600 hover:prose-a:text-blue-700
        prose-strong:text-gray-900 prose-code:text-gray-800 prose-code:bg-gray-50 prose-code:px-1 prose-code:rounded
        prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200
        prose-blockquote:border-l-4 prose-blockquote:border-gray-200 prose-blockquote:pl-4 prose-blockquote:italic
        prose-ul:list-disc prose-ol:list-decimal"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
