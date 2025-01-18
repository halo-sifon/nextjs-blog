import { Post } from "@/models/Post";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Tag } from "@/components/ui/tag";
import { connectDB } from "@/lib/mongodb";

// 服务端数据获取函数
async function getPosts() {
  try {
    await connectDB();
    const posts = await Post.find({
      status: "published",
    })
      .sort({ publishDate: -1 })
      .skip(0)
      .limit(20)
      .select("title tags publishDate category slug"); // 只选择需要的字段
    return posts;
  } catch (error) {
    console.error("获取文章列表失败:", error);
    throw error;
  }
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="space-y-4">
        {posts.map(post => (
          <article
            key={post.id}
            className="group flex items-center justify-between border-b p-4 transition-all hover:bg-muted/50"
          >
            <Link
              href={`/posts/${post.category}/${post.title}`}
              className="flex-1"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-medium tracking-tight hover:underline text-ellipsis min-w-0 line-clamp-2">
                  {post.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground shrink-0">
                  <span>{post.category}</span>
                  <time dateTime={new Date(post.publishDate).toISOString()}>
                    {formatDate(post.publishDate)}
                  </time>
                </div>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <Tag key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Tag>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
