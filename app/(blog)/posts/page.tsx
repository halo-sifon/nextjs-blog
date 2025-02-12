import { Post } from "@/models/Post";
import { Category, ICategory } from "@/models/Category";
import { connectDB } from "@/lib/mongodb";
import { PostItem } from "./post-item";
import Link from "next/link";
import { Button } from "@/components/ui";
import { CategorySelect } from "./category-select";

// 配置 ISR
export const revalidate = 3600; // 每小时重新验证一次

// 生成静态路径参数
export async function generateStaticParams() {
  await connectDB();
  const categories = await Category.find().select("_id");

  return [
    { searchParams: { category: undefined } }, // 默认路径
    ...categories.map(cat => ({
      searchParams: { category: cat._id.toString() },
    })),
  ];
}

// 获取所有分类及其文章数量
async function getCategories() {
  try {
    await connectDB();
    const categories = await Category.find().sort({ title: 1 });

    // 获取每个分类的文章数量
    const categoriesWithCount = await Promise.all(
      categories.map(async category => {
        const count = await Post.countDocuments({
          category: category._id,
          status: "published",
        });
        // 将 Mongoose 文档转换为普通对象，并只选择需要的字段
        const plainCategory = {
          _id: category._id.toString(),
          title: category.title,
          count,
        };
        return plainCategory;
      })
    );

    return categoriesWithCount;
  } catch (error) {
    console.error("获取分类列表失败:", error);
    throw error;
  }
}

// 服务端数据获取函数
async function getPosts(category?: string) {
  try {
    await connectDB();
    const query = {
      status: "published",
      ...(category ? { category } : {}),
    };

    const posts = await Post.find(query)
      .sort({ publishDate: -1 })
      .skip(0)
      .limit(20)
      .select("title tags publishDate category")
      .populate({
        path: "category",
        model: Category,
        select: "title slug",
      });

    return posts;
  } catch (error) {
    console.error("获取文章列表失败:", error);
    throw error;
  }
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  // 等待 searchParams
  const params = await searchParams;
  const category = params.category;

  const [posts, categories] = await Promise.all([
    getPosts(category),
    getCategories(),
  ]);

  return (
    <div className="space-y-6">
      {/* 分类选择器 - 在手机端显示为下拉菜单 */}
      <CategorySelect categories={categories} currentCategory={category} />

      <div className="flex flex-col md:flex-row md:gap-8">
        {/* 文章列表 */}
        <div className="flex-1 space-y-4">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostItem
                key={post._id.toString()}
                post={{
                  id: post._id.toString(),
                  title: post.title,
                  category: (post.category as ICategory).title,
                  slug: (post.category as ICategory)._id?.toString() as string,
                  publishDate: post.publishDate.toISOString(),
                  tags: post.tags,
                }}
              />
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>这个分类下还没有文章</p>
              <Link
                href="/posts"
                className="text-primary hover:underline mt-2 inline-block"
              >
                <Button>查看近期文章</Button>
              </Link>
            </div>
          )}
        </div>

        {/* 分类列表 - 在桌面端显示为侧边栏 */}
        <div className="hidden md:block w-48 space-y-2">
          <h2 className="text-lg font-semibold mb-4">分类</h2>
          <Link
            href="/posts"
            className={`block px-3 py-2 rounded-lg hover:bg-accent ${
              !category ? "bg-accent" : ""
            }`}
          >
            近期文章
          </Link>
          {categories.map(item => (
            <Link
              key={item._id.toString()}
              href={`/posts?category=${item._id}`}
              className={`block px-3 py-2 rounded-lg hover:bg-accent ${
                category === item._id?.toString() ? "bg-accent" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{item.title}</span>
                <span className="text-sm text-muted-foreground">
                  ({item.count})
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
