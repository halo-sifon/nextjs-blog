import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "~/lib/mongodb";
import { Category } from "~/models/Category";
import { validateToken } from "~/middleware/auth";
import { FailResponse, ListResponse, SuccessResponse } from "~/models/Response";
import { HttpStatusCode } from "axios";

/**
 * 获取分类列表
 *
 * @route GET /api/categories
 * @access Public - 已发布文章对所有人可见，草稿需要登录
 *
 * @query {number} [page=1] - 页码
 * @query {number} [limit=10] - 每页数量
 * @query {string} [search] - 搜索关键词（标题和内容）
 * @query {string} [category] - 分类筛选
 * @query {string} [status] - 状态筛选（draft/published，需要登录）
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
    const total = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const hasMore = total > page * limit;

    return NextResponse.json(
      new ListResponse({
        data: {
          list: categories,
          total,
          hasMore,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      new FailResponse({ message: "获取分类列表失败" }),
      {
        status: 500,
      }
    );
  }
}

/**
 * 创建新分类
 *
 * @route POST /api/categories
 * @access Private - 需要登录
 *
 * @body {object} category - 分类信息
 * @body {string} category.title - 标题
 * @body {string} category.slug - 分类Slug
 *
 */
export async function POST(request: NextRequest) {
  const authResult = await validateToken();
  if (authResult.status !== 200) {
    return NextResponse.json(new FailResponse(authResult.data), {
      status: authResult.status,
    });
  }

  try {
    await connectDB();
    const body = await request.json();

    // 创建新分类
    const category = new Category({
      ...body,
    });

    await category.save();

    return NextResponse.json(new SuccessResponse({ data: category }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(new FailResponse({ message: "创建分类失败" }), {
      status: 500,
    });
  }
}

/**
 * 更新分类
 *
 * @route PUT /api/categories
 * @access Private - 需要登录
 *
 * @body {object} category - 分类信息
 * @body {string} category.id - 分类ID
 * @body {string} [category.title] - 标题
 * @body {string} [category.slug] - 分类Slug
 */
export async function PUT(request: NextRequest) {
  const authResult = await validateToken();
  if (authResult.status !== 200) {
    return NextResponse.json(new FailResponse(authResult.data), {
      status: authResult.status,
    });
  }

  try {
    await connectDB();
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        new FailResponse({ message: "分类ID是必需的" }),
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    }

    const category = await Category.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updateDate: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return NextResponse.json(new FailResponse({ message: "分类不存在" }), {
        status: HttpStatusCode.BadRequest,
      });
    }

    return NextResponse.json(new SuccessResponse({ data: category }));
  } catch (error) {
    console.error("更新分类失败:", error);
    return NextResponse.json(new FailResponse({ message: "更新分类失败" }), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}

/**
 * 删除分类
 *
 * @route DELETE /api/categories/{id}
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

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return NextResponse.json(new FailResponse({ message: "分类不存在" }), {
        status: HttpStatusCode.BadRequest,
      });
    }

    return NextResponse.json(new SuccessResponse({ message: "分类删除成功" }));
  } catch (error) {
    console.error("删除分类失败:", error);
    return NextResponse.json(new FailResponse({ message: "删除分类失败" }), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
