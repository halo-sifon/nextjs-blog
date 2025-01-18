import "highlight.js/styles/github.css";
import MarkdownIt from "markdown-it";
import highlightjs from "markdown-it-highlightjs";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollToTop from "~/components/scroll-to-top";
import PostContent from "./post-content";
import { Post } from "~/models/Post";
import { connectDB } from "~/lib/mongodb";
import { Tag, Tags } from "lucide-react";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(highlightjs);

export default async function PostPage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;

  const [category, title] = params.slug.map(slug => decodeURIComponent(slug));

  // 连接数据库并获取文章
  await connectDB();
  const post = await Post.findOne({ category, title });

  if (!post) {
    return notFound();
  }

  const content = md.render(post.content);

  return (
    <>
      <div className="max-w-5xl mx-auto p-4">
        <div className="mb-4">
          <Link
            href="/posts"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            返回
          </Link>
        </div>

        <article className="bg-card overflow-hidden">
          <div className="px-6 py-4">
            <header className="text-center mb-6">
              <h1 className="text-2xl font-noto-serif font-bold text-foreground mb-3">
                {post.title}
              </h1>

              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {new Date(post.publishDate).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
                <span className="mx-2">·</span>
                <span className="flex items-center">
                  <Tag className="w-4 h-4 mr-1" />
                  {post.category}
                </span>
                {post.tags && post.tags.length > 0 && (
                  <>
                    <span className="mx-2">·</span>
                    <span className="flex items-center">
                      <Tags className="w-4 h-4 mr-1" />
                      {post.tags.join(", ")}
                    </span>
                  </>
                )}
              </div>
            </header>

            <PostContent content={content} />
          </div>
        </article>
      </div>
      <ScrollToTop />
    </>
  );
}
