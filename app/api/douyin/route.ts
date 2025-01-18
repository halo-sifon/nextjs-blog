import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Douyin } from "@/models/Douyin";
import { validateToken } from "@/middleware/auth";
import { FailResponse, ListResponse, SuccessResponse } from "@/models/Response";
import { HttpStatusCode } from "axios";

/**
 * 获取抖音视频列表
 *
 * @route GET /api/douyin
 *
 * @query {number} [page=1] - 页码
 * @query {number} [limit=10] - 每页数量
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  try {
    await connectDB();

    const authResult = await validateToken();
    if (authResult.status !== 200) {
      return NextResponse.json(new FailResponse(authResult.data), {
        status: authResult.status,
      });
    }

    // 构建查询条件
    const query: any = {};

    // 计算总数和分页
    const total = await Douyin.countDocuments(query);
    const douyins = await Douyin.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const hasMore = total > page * limit;

    return NextResponse.json(
      new ListResponse({
        data: {
          list: douyins,
          total,
          hasMore,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    console.error("Error fetching douyins:", error);
    return NextResponse.json(
      new FailResponse({ message: "获取抖音视频列表失败" }),
      {
        status: 500,
      }
    );
  }
}

/**
 * 删除抖音视频
 *
 * @route DELETE /api/douyin?id=xxx
 * @access Private - 需要登录
 */
export async function DELETE(request: NextRequest) {
  const authResult = await validateToken();
  if (authResult.status !== 200) {
    return NextResponse.json(new FailResponse(authResult.data), {
      status: authResult.status,
    });
  }

  try {
    await connectDB();
    const id = request.nextUrl.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        new FailResponse({ message: "分类ID是必需的" }),
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    }

    // 1. 获取抖音视频信息
    const douyin = await Douyin.findById(id);
    if (!douyin) {
      return NextResponse.json(
        new FailResponse({ message: "抖音视频不存在" }),
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    }

    // 2. 删除抖音视频
    await Douyin.findByIdAndDelete(id);

    return NextResponse.json(
      new SuccessResponse({ message: "抖音视频删除成功" })
    );
  } catch (error) {
    console.error("删除抖音视频失败:", error);
    return NextResponse.json(
      new FailResponse({ message: "删除抖音视频失败" }),
      {
        status: HttpStatusCode.InternalServerError,
      }
    );
  }
}
