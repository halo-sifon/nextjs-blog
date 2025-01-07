import { getPaginatedPosts } from "~/libs/posts";
import PostsClient from "./posts-client";

export const revalidate = 3600; // 1小时重新验证一次

export default async function PostsList() {
  const { posts, total, hasMore } = await getPaginatedPosts(1, 10);
  return (
    <PostsClient 
      initialPosts={posts} 
      initialTotal={total} 
      initialHasMore={hasMore} 
    />
  );
}
