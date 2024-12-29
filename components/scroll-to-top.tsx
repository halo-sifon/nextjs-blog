"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollThreshold = 300;

  useEffect(() => {
    const toggleVisibility = () => {
      const shouldBeVisible = window.scrollY > scrollThreshold;
      if (shouldBeVisible !== isVisible) {
        setIsVisible(shouldBeVisible);
      }
    };

    // Use passive event listener for better scroll performance
    window.addEventListener("scroll", toggleVisibility, { passive: true });

    // Initial check
    toggleVisibility();

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg 
        hover:bg-blue-700 transition-all duration-300 hover:shadow-xl 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}
      `}
      aria-label="返回顶部"
      title="返回顶部"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}
