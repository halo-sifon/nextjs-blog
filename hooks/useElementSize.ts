import { useCallback, useEffect, useState } from "react";

interface Size {
  width: number;
  height: number;
}

/**
 * 监听元素尺寸变化的 Hook
 * @param elementRef - 要监听的元素引用
 * @returns 元素的尺寸信息 {width, height}
 * @example
 * ```tsx
 * const elementRef = useRef<HTMLDivElement>(null)
 * const { width, height } = useElementSize(elementRef)
 * ```
 */
export function useElementSize<T extends HTMLElement>(
  elementRef: React.RefObject<T>
): Size {
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  // 获取元素尺寸的函数
  const updateSize = useCallback(() => {
    const element = elementRef.current;
    if (!element) return;

    const { width, height } = element.getBoundingClientRect();
    setSize({
      width,
      height,
    });
  }, [elementRef]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 初始化尺寸
    updateSize();

    // 创建 ResizeObserver 实例
    const resizeObserver = new ResizeObserver(updateSize);

    // 开始观察元素
    resizeObserver.observe(element);

    // 清理函数
    return () => {
      resizeObserver.disconnect();
    };
  }, [elementRef, updateSize]);

  return size;
}
