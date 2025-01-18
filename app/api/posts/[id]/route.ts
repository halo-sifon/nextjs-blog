import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "~/lib/mongodb";
import { Post } from "~/models/Post";
import { validateToken } from "~/middleware/auth";
import { FailResponse, SuccessResponse } from "~/models/Response";
import { HttpStatusCode } from "axios";

/**
 * 获取单篇文章详情
 *
 * @route GET /api/posts/{id}
 * @access Public - 已发布文章对所有人可见，草稿需要登录
 *
 * - 包含完整的文章内容和元数据
 * - 访问时会自动增加浏览次数
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const post = await Post.findById(params.id);

    if (!post) {
      return NextResponse.json(new FailResponse({ message: "文章不存在" }), {
        status: HttpStatusCode.NotFound,
      });
    }

    // 如果文章是草稿状态，需要验证用户权限
    if (post.status === "draft") {
      const authResult = await validateToken();
      if (authResult.status !== 200) {
        return NextResponse.json(new FailResponse(authResult.data), {
          status: authResult.status,
        });
      }
    }

    // 更新浏览次数
    post.viewCount += 1;
    await post.save();

    return NextResponse.json(new SuccessResponse({ data: post }));
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      new FailResponse({ message: "获取文章详情失败" }),
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
