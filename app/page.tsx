import Link from "next/link";
import { getPaginatedPosts } from "~/libs/posts";
import PostItem from "~/components/post-item";

export default async function Home() {
  const { posts } = await getPaginatedPosts(1, 5);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* 欢迎区域 */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 font-noto-serif">欢迎来到我的博客</h1>
        <p className="text-xl text-gray-600 font-noto-serif">分享技术、生活和思考</p>
      </section>

      {/* 最新文章 */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">最新文章</h2>
          <Link href="/posts" className="text-blue-600 hover:text-blue-800">
            查看全部
          </Link>
        </div>
        <div className="space-y-6">
          {posts.map(post => (
            <PostItem key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
