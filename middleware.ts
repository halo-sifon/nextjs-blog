import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// 这些路径需要登录才能访问
const protectedPaths = ["/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否是受保护的路径
  const isProtectedPath = protectedPaths.some(path =>
    pathname.startsWith(path)
  );

  if (isProtectedPath) {
    // 获取 token
    const token = request.cookies.get("admin-token")?.value;

    if (!token) {
      // 如果没有 token，重定向到登录页
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      // 验证 token

      jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || ""));
      return NextResponse.next();
    } catch (error) {
      console.log(error);

      // token 无效，重定向到登录页
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

// 配置需要进行中间件处理的路径
export const config = {
  matcher: ["/admin/:path*"],
};
