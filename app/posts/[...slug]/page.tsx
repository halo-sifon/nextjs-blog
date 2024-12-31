import "highlight.js/styles/github.css";
import MarkdownIt from "markdown-it";
import highlightjs from "markdown-it-highlightjs";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScrollToTop from "~/components/scroll-to-top";
import { getPostBySlug } from "~/libs/posts";
import PostContent from "./post-content";

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(highlightjs);

export default async function PostPage(props: {
  params: Promise<{ slug: string[] }>;
}) {
  const params = await props.params;
  const slug = params.slug.join("/");
  const post = await getPostBySlug(slug);

  if (!post) {
    return notFound();
  }

  const content = md.render(post.content);

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/posts"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700"
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
            返回文章列表
          </Link>
        </div>

        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-8 py-6">
            <header className="text-center mb-8">
              <h1 className="text-3xl font-noto-serif font-bold text-gray-900 dark:text-gray-200 mb-4">
                {post.title}
              </h1>

              <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {post.date}
                </span>
                <span className="mx-2">·</span>
                <span className="flex items-center">
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
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  {post.category}
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
