import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { FailResponse, SuccessResponse } from "@/models/Response";
import { Douyin } from "@/models/Douyin";
import { connectDB } from "@/lib/mongodb";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Linux; Android 8.0.0; SM-G955U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36",
  Referer: "https://www.douyin.com/?is_from_mobile_home=1&recommend=1",
};

export async function POST(request: NextRequest) {
  const { url } = await request.json();
  const realUrl = await getRealUrl(url);

  if (!realUrl) {
    return NextResponse.json(new FailResponse({ message: "非抖音分享链接" }), {
      status: axios.HttpStatusCode.BadRequest,
    });
  }
  // 判断是否是用户分享链接
  const isUserShare = realUrl.includes("www.iesdouyin.com/share/user");
  if (isUserShare) {
    return NextResponse.json(
      new FailResponse({ message: "不支持解析用户主页分享" }),
      { status: axios.HttpStatusCode.BadRequest }
    );
  }

  let videoId = "";
  if (realUrl) {
    const videoIdMatch = realUrl.match(/(\d+)/);
    if (videoIdMatch) {
      videoId = videoIdMatch[1];
    }
  }
  const requestUrl = `https://www.iesdouyin.com/share/video/${videoId}/`;

  try {
    // Get video page HTML
    const response = await axios.get(requestUrl, { headers });
    const match = /_ROUTER_DATA\s*=\s*(\{.*?\});/s.exec(response.data);
    if (!match) {
      return NextResponse.json(new FailResponse({ message: "解析失败" }), {
        status: axios.HttpStatusCode.BadRequest,
      });
    }

    const data = JSON.parse(match[1]);
    const itemList =
      data.loaderData["video_(id)/page"]["videoInfoRes"]["item_list"][0];

    const nickname = itemList.author.nickname;
    const title = itemList.desc;
    const awemeId = itemList.aweme_id;
    const video = itemList.video.play_addr.uri;
    const cover = itemList.video.cover.url_list[0];
    const images = itemList.images || null;

    const videoUrl = video
      ? video.includes("mp3")
        ? video
        : `https://aweme.snssdk.com/aweme/v1/play/?video_id=${video}&ratio=1080p&line=0`
      : null;

    const output = {
      name: nickname,
      title: title,
      video: videoUrl,
      cover: cover,
      awemeId,
      images: Array.isArray(images)
        ? images.map(image => image.url_list[0])
        : [],
      type: images ? "images" : "video",
    };

    await connectDB();
    // 检查是否已存在相同的 awemeId
    const existingDouyin = await Douyin.findOne({ awemeId });
    if (existingDouyin) {
      // 如果存在，增加下载次数
      await Douyin.findByIdAndUpdate(existingDouyin._id, {
        $inc: { downloads: 1 },
      });
      return NextResponse.json(
        new SuccessResponse({
          data: {
            ...output,
            downloads: (existingDouyin.downloads || 0) + 1,
            _id: existingDouyin._id,
          },
        })
      );
    }

    // 如果不存在，创建新记录
    const newDouyin = await Douyin.create({
      ...output,
      downloads: 1, // 初始下载次数为1
    });

    return NextResponse.json(
      new SuccessResponse({
        data: {
          ...output,
          downloads: 1,
          _id: newDouyin._id,
        },
      })
    );
  } catch (error) {
    console.error("Error fetching video data:", error);
    const _error = error as Error;
    return NextResponse.json(
      new FailResponse({ message: _error.message || "解析失败" }),
      {
        status: axios.HttpStatusCode.InternalServerError,
      }
    );
  }
}

/**
 * 异步获取重定向的抖音视频真实地址
 * @param url 抖音分享的短链接地址
 * @returns 返回重定向后的实际视频地址，如果获取失败则返回null
 */
async function getRealUrl(url: string) {
  // 定义匹配抖音分享链接的正则表达式
  const res = /https:\/\/v.douyin.com\/(\w+)\//g;

  // 使用正则表达式匹配输入的抖音链接
  const match = url.match(res);

  // 如果匹配成功，则发送GET请求获取重定向的地址
  if (match) {
    const response = await axios.get(match[0], {
      // 设置最大重定向次数为0，表示不自动处理重定向
      maxRedirects: 0,
      // 自定义HTTP状态码的验证函数，允许200到302之间的状态码
      validateStatus: function (status) {
        return status >= 200 && status < 303;
      },
    });

    // 返回重定向后的实际地址
    return response.headers.location;
  }

  // 如果匹配失败，则返回null
  return null;
}
