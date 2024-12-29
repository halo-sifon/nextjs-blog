import { getAllPosts } from "~/libs/posts";
import PostsClient from "./posts-client";

export default async function PostsList() {
  const posts = await getAllPosts();
  return <PostsClient initialPosts={posts} />;
}
