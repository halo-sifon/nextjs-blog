"use client";

import { Post } from "~/libs/posts";
import { useState, useCallback } from "react";
import PostItem from "~/components/post-item";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

interface PostsClientProps {
  initialPosts: Post[];
  initialTotal: number;
  initialHasMore: boolean;
}

export default function PostsClient({
  initialPosts,
  initialTotal,
  initialHasMore,
}: PostsClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);
  const [hasSearched, setHasSearched] = useState(false);

  // 搜索或加载更多时获取文章
  const fetchPosts = useCallback(
    async (searchQuery: string, pageNum: number) => {
      setIsLoading(true);
      if (pageNum === 1) {
        setIsSearching(true);
      }
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
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
        setHasSearched(true);
      }
    },
    []
  );

  // 处理搜索
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchValue);
    setPage(1);
    fetchPosts(searchValue, 1);
  };

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
      <article className="bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="px-8 py-6">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-noto-serif font-bold text-foreground mb-6">
              博客文章
            </h1>
            <form
              onSubmit={handleSearch}
              className="relative max-w-2xl mx-auto"
            >
              <Input
                type="text"
                placeholder="搜索文章，按回车确认..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </form>
          </header>

          {posts.length === 0 && !isLoading && hasSearched && (
            <div className="text-center py-12">
              <div className="text-muted-foreground/90">
                {searchTerm
                  ? `没有找到与 "${searchTerm}" 相关的文章`
                  : "暂无文章"}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {posts.map(post => (
              <PostItem key={post.slug} post={post} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <Button onClick={loadMore} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span>加载中...</span>
                  </>
                ) : (
                  <span>加载更多</span>
                )}
              </Button>
            </div>
          )}

          {total > 0 && (
            <div className="mt-6 text-center text-muted-foreground/90">
              共 {total} 篇文章
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
