import { getAllPosts } from "~/libs/posts";
import PostsClient from "./posts-client";

export default function PostsList() {
  const posts = getAllPosts();
  return <PostsClient initialPosts={posts} />;
}
