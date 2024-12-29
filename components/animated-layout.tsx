"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function AnimatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const lastFocused = useRef<HTMLElement | null>(null);

  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      setClickPosition({ x: event.clientX, y: event.clientY });
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    if (document.activeElement === lastFocused.current) return;
    lastFocused.current = document.activeElement as HTMLElement;
    
    if (lastFocused.current && clickPosition && pathname) {
      const rect = lastFocused.current.getBoundingClientRect();
      console.log("点击元素", rect);
      console.log("点击位置:", clickPosition);
    }
  }, [clickPosition, pathname]);

  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        // exit={{ opacity: 0, y: 8 }}
        transition={{
          duration: 0.2,
          ease: [0.43, 0.13, 0.23, 0.96],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
