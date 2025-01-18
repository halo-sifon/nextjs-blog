import { Post } from "@/models/Post";
import { connectDB } from "@/lib/mongodb";
import { PostItem } from "./post-item";

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
      .select("title tags publishDate category slug");
    return posts;
  } catch (error) {
    console.error("获取文章列表失败:", error);
    throw error;
  }
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostItem key={post._id.toString()} post={{
          id: post._id.toString(),
          title: post.title,
          category: post.category,
          publishDate: post.publishDate.toISOString(),
          tags: post.tags
        }} />
      ))}
    </div>
  );
}
