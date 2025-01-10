import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import axios from "axios";

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const realUrl = await getRealUrl(url);
  if (!realUrl) {
    return NextResponse.json(
      { error: "非抖音分享链接" },
      { status: axios.HttpStatusCode.BadRequest }
    );
  }
  // 判断是否是用户分享链接
  const isUserShare = realUrl.includes("www.iesdouyin.com/share/user");
  if (isUserShare) {
    return NextResponse.json(
      { msg: "不支持解析用户主页分享" },
      { status: axios.HttpStatusCode.BadRequest }
    );
  }
  console.log("realUrl", realUrl);

  try {
    // 获取视频信息
    await page.goto(realUrl, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("video source");
    const pageTitle = await page.title();

    const src = await page.evaluate(() => {
      const sources = Array.from(document.querySelectorAll("video source"));
      if (sources.length === 0) return null;

      // 获取所有视频源
      const videoUrls = sources.map(source => (source as HTMLSourceElement).src).filter(Boolean);
      return videoUrls;
    });

    if (!src || src.length === 0) {
      return NextResponse.json(
        { error: "未找到视频源" },
        { status: axios.HttpStatusCode.NotFound }
      );
    }

    return NextResponse.json({ src, pageTitle });
  } finally {
    await browser.close();
  }
}

async function getRealUrl(url: string) {
  const res = /https:\/\/v.douyin.com\/(\w+)\//g;
  const match = url.match(res);
  if (match) {
    const response = await axios.get(match[0], {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 303;
      },
    });
    return response.headers.location;
  }
  return null;
}
