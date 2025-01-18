import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { Category } from "@/models/Category";
import { validateToken } from "@/middleware/auth";
import { FailResponse, ListResponse, SuccessResponse } from "@/models/Response";
import { HttpStatusCode } from "axios";

/**
 * 获取文章列表
 *
 * @route GET /api/posts
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
  const search = searchParams.get("search");
  const category = searchParams.get("category");
  const status = searchParams.get("status");

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
    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }

    // 计算总数和分页
    const total = await Post.countDocuments(query);

    // 获取文章列表，并处理分类信息
    const posts = await Post.find(query)
      .sort({ publishDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-content")
      .populate({
        path: "category",
        model: Category,
        select: "title slug",
      });

    const hasMore = total > page * limit;

    return NextResponse.json(
      new ListResponse({
        data: {
          list: posts,
          total,
          hasMore,
          currentPage: page,
          totalPages: Math.ceil(total / limit),
        },
      })
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      new FailResponse({ message: "获取文章列表失败" }),
      {
        status: 500,
      }
    );
  }
}

/**
 * 创建新文章
 *
 * @route POST /api/posts
 * @access Private - 需要登录
 *
 * @body {object} post - 文章信息
 * @body {string} post.title - 标题
 * @body {string} post.content - 内容（Markdown格式）
 * @body {string} post.category - 分类
 * @body {string} [post.summary] - 摘要
 * @body {string[]} [post.tags] - 标签数组
 * @body {string} post.status - 状态（draft/published）
 * @body {string} post.slug - URL友好的标识符
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

    // 创建新文章
    const post = new Post({
      ...body,
      author: authResult.data.id, // 添加默认值
      publishDate: new Date(),
      updateDate: new Date(),
    });

    await post.save();

    return NextResponse.json(new SuccessResponse({ data: post }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(new FailResponse({ message: "创建文章失败" }), {
      status: 500,
    });
  }
}

/**
 * 更新文章
 *
 * @route PUT /api/posts
 * @access Private - 需要登录
 *
 * @body {object} post - 文章信息
 * @body {string} post.id - 文章ID
 * @body {string} [post.title] - 标题
 * @body {string} [post.content] - 内容（Markdown格式）
 * @body {string} [post.category] - 分类
 * @body {string} [post.summary] - 摘要
 * @body {string[]} [post.tags] - 标签数组
 * @body {string} [post.status] - 状态（draft/published）
 * @body {string} [post.slug] - URL友好的标识符
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
        new FailResponse({ message: "文章ID是必需的" }),
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    }

    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updateDate: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!post) {
      return NextResponse.json(new FailResponse({ message: "文章不存在" }), {
        status: HttpStatusCode.BadRequest,
      });
    }

    return NextResponse.json(new SuccessResponse({ data: post }));
  } catch (error) {
    console.error("更新文章失败:", error);
    return NextResponse.json(new FailResponse({ message: "更新文章失败" }), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}

/**
 * 删除文章
 *
 * @route DELETE /api/posts?id={id}
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
        new FailResponse({ message: "文章ID是必需的" }),
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    }

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return NextResponse.json(new FailResponse({ message: "文章不存在" }), {
        status: HttpStatusCode.BadRequest,
      });
    }

    return NextResponse.json(new SuccessResponse({ message: "文章删除成功" }));
  } catch (error) {
    console.error("删除文章失败:", error);
    return NextResponse.json(new FailResponse({ message: "删除文章失败" }), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
