"use client";

import { useEffect } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";

interface ImagePreviewProps {
  src: string;
  onClose: () => void;
}

export default function ImagePreview({ src, onClose }: ImagePreviewProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const content = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] cursor-pointer m-0"
      onClick={onClose}
    >
      <div
        className="relative w-[90vw] h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        <Image
          src={src}
          alt="预览图片"
          fill
          unoptimized
          className="object-contain rounded-lg"
        />
        <button
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-opacity-70"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );

  return typeof document === 'object' ? createPortal(content, document.body) : null;
}
