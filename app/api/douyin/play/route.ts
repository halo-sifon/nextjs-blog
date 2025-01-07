import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoUrl = searchParams.get("url") || undefined;
  if (!videoUrl) {
    return new NextResponse("Missing video URL", { status: 400 });
  }
  // 设置请求头
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    Referer: "https://www.douyin.com/",
    Accept: "*/*",
  };
  try {
    const response = await fetch(videoUrl, {
      headers: headers,
    });

    // 将原始响应的headers转发
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  } catch (error) {
    console.error("代理视频失败:", error);
    return new NextResponse("视频获取失败", { status: 500 });
  }
}
