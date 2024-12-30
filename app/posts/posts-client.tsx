"use client";

import { Post } from "~/libs/posts";
import { useState, useEffect } from "react";
import PostItem from "~/components/post-item";

interface PostsClientProps {
  initialPosts: Post[];
  initialTotal: number;
  initialHasMore: boolean;
}

export default function PostsClient({ 
  initialPosts,
  initialTotal,
  initialHasMore 
}: PostsClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);

  // 搜索或加载更多时获取文章
  const fetchPosts = async (searchQuery: string, pageNum: number) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: "10",
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/posts?${params}`);
      const data = await response.json();

      if (pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      
      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理搜索
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchPosts(searchTerm, 1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 加载更多
  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(searchTerm, nextPage);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <input
          type="text"
          placeholder="搜索文章..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <PostItem key={post.slug} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "加载中..." : "加载更多"}
          </button>
        </div>
      )}

      {total > 0 && (
        <div className="mt-4 text-center text-gray-500">
          共 {total} 篇文章
        </div>
      )}
    </div>
  );
}
