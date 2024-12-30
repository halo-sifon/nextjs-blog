"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function NotFoundContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">404</h1>
        <p className="text-gray-600">
          {from ? `页面 "${from}" 不存在` : "页面不存在"}
        </p>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-800">404</h1>
          <p className="text-gray-600">页面不存在</p>
        </div>
      </div>
    }>
      <NotFoundContent />
    </Suspense>
  );
} 