import "highlight.js/styles/github.css";
import MarkdownIt from "markdown-it";
import highlightjs from "markdown-it-highlightjs";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ScrollToTop from "@/components/scroll-to-top";
import PostContent from "./post-content";
import { Post } from "@/models/Post";
import { connectDB } from "@/lib/mongodb";
import { Tag, Tags } from "lucide-react";
import { Category, ICategory } from "@/models/Category";
import BackButton from "./back-button";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(highlightjs);

async function getPost(params: { slug: string[] }) {
  const [category, title] = params.slug.map(slug => decodeURIComponent(slug));

  // 连接数据库并获取文章
  await connectDB();
  
  // 使用 findOneAndUpdate 来原子性地更新浏览次数并返回更新后的文档
  const post = await Post.findOneAndUpdate(
    { category, title },
    { $inc: { viewCount: 1 } }, // 增加浏览次数
    { 
      new: true, // 返回更新后的文档
      populate: {
        path: "category",
        model: Category,
        select: "title slug",
      }
    }
  );

  return post;
}

// 生成动态 metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const [category, title] = (await params).slug.map(slug =>
    decodeURIComponent(slug)
  );

  // 连接数据库并获取文章
  await connectDB();
  const post = await Post.findOne({ category, title }).populate({
    path: "category",
    model: Category,
    select: "title slug",
  });

  if (!post) {
    return {
      title: "文章不存在",
      description: "抱歉，您访问的文章不存在。",
    };
  }

  // 提取文章的前 150 个字符作为描述
  const plainText = post.content.replace(/[#*`]/g, "").replace(/\n/g, " ");
  const description =
    plainText.length > 150 ? plainText.slice(0, 150) + "..." : plainText;

  return {
    title: post.title,
    description: post.summary || description,
    keywords: post.tags,
    authors: [{ name: "Sifon", url: "https://github.com/halo-sifon" }],
  };
}

export async function generateStaticParams() {
  await connectDB();
  const posts = await Post.find({}).populate({
    path: "category",
    model: Category,
    select: "title slug",
  });
  return posts.map(post => ({
    slug: [(post.category as ICategory).slug, post.title],
  }));
}

export default async function PostPage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const post = await getPost(params);

  if (!post) {
    return notFound();
  }

  const content = md.render(post.content);

  return (
    <>
      <div className="max-w-5xl mx-auto p-4">
        <div className="mb-4">
          <BackButton />
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
                  {(post.category as ICategory).title}
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
                <span className="mx-2">·</span>
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  {post.viewCount || 0} 次浏览
                </span>
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
