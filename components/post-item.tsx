import Link from "next/link";
import { Post } from "~/libs/posts";

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  const normalizedSlug = post.slug.split("\\").join("/");

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link
        href={`/posts/${encodeURIComponent(normalizedSlug)}`}
        className="block p-6"
      >
        <h2 className="text-xl font-noto-serif font-bold text-gray-900 dark:text-gray-200 mb-2">
          {post.title}
        </h2>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
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
      </Link>
    </article>
  );
}
