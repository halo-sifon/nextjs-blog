import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "~/lib/mongodb";
import { validateToken } from "~/middleware/auth";
import { Category } from "~/models/Category";
import { FailResponse, SuccessResponse } from "~/models/Response";

/**
 * 获取单个分类详情
 *
 * @route GET /api/categories/{id}
 * @access Public - 已发布分类对所有人可见
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const authResult = await validateToken();
    if (authResult.status !== 200) {
      return NextResponse.json(new FailResponse(authResult.data), {
        status: authResult.status,
      });
    }

    const category = await Category.findById((await params).id);

    if (!category) {
      return NextResponse.json(new FailResponse({ message: "分类不存在" }), {
        status: HttpStatusCode.BadRequest,
      });
    }

    return NextResponse.json(new SuccessResponse({ data: category }));
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      new FailResponse({ message: "获取分类详情失败" }),
      { status: HttpStatusCode.InternalServerError }
    );
  }
}
