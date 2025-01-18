import { HttpStatusCode } from "axios";
import { NextResponse } from "next/server";
import { connectDB } from "~/lib/mongodb";
import { validateToken } from "~/middleware/auth";
import { Category } from "~/models/Category";
import { FailResponse, SuccessResponse } from "~/models/Response";

/**
 * 获取全部分类列表
 *
 * @route GET /api/categories/list
 */
export async function GET() {
  try {
    await connectDB();

    const authResult = await validateToken();
    if (authResult.status !== 200) {
      return NextResponse.json(new FailResponse(authResult.data), {
        status: authResult.status,
      });
    }

    const categories = await Category.find().sort({ createdAt: -1 });

    return NextResponse.json(
      new SuccessResponse({
        data: categories,
      })
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      new FailResponse({ message: "获取分类列表失败" }),
      {
        status: HttpStatusCode.InternalServerError,
      }
    );
  }
}
