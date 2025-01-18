import { FailResponse } from "@/models/Response";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const videoUrl = searchParams.get("url") || undefined;
  if (!videoUrl) {
    return NextResponse.json(
      new FailResponse({
        message: "Missing video URL",
      }),
      {
        status: HttpStatusCode.BadRequest,
      }
    );
  }
  // 设置请求头
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Accept-Encoding": "gzip, deflate",
    Connection: "keep-alive",
    Referer: "https://www.douyin.com/",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  };
  try {
    const response = await fetch(videoUrl, {
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 将原始响应的headers转发
    const newHeaders = new Headers();
    // 复制所有需要的响应头
    const headersToForward = [
      "content-length",
      "content-type",
      "content-disposition",
      "accept-ranges",
      "cache-control",
    ];

    headersToForward.forEach(header => {
      const value = response.headers.get(header);
      if (value) {
        newHeaders.set(header, value);
      }
    });

    // 设置CORS头
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
