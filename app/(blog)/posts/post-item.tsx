'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import { Loading } from "@/components/ui/loading";
import { formatDate } from "@/lib/utils";

interface PostItemProps {
  post: {
    id: string;
    title: string;
    category: string;
    publishDate: string;
    tags?: string[];
  };
}

export function PostItem({ post }: PostItemProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoading(true);
    router.push(`/posts/${post.category}/${post.title}`);
  };

  return (
    <article className="group relative flex items-center justify-between border-b p-4 transition-all hover:bg-muted/50">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <Loading text="加载文章..." />
        </div>
      )}
      <Link
        href={`/posts/${post.category}/${post.title}`}
        className="flex-1"
        onClick={handleClick}
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
  );
} 