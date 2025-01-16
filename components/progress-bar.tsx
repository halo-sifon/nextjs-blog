"use client";

import { useEffect, Suspense } from "react";
import NProgress from "nprogress";
import { usePathname, useSearchParams } from "next/navigation";
import "nprogress/nprogress.css";

// 配置进度条
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3,
});

function ProgressBarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 在组件挂载时添加点击事件监听
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor?.href.startsWith("http") || anchor?.href.startsWith("https")) {
        return;
      }
      if (
        anchor?.href &&
        !anchor.href.startsWith("#") &&
        anchor.href !== window.location.href
      ) {
        NProgress.start();
      }
    };

    document.addEventListener("click", handleClick);
    window.addEventListener("beforeunload", NProgress.start);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("beforeunload", NProgress.start);
    };
  }, []);

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}

export default function ProgressBar() {
  return (
    <Suspense fallback={null}>
      <ProgressBarContent />
    </Suspense>
  );
}
