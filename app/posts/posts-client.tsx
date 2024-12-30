"use client";

import { Post } from "~/libs/posts";
import { useState } from "react";
import PostItem from "~/components/post-item";

interface PostsClientProps {
  initialPosts: Post[];
}

export default function PostsClient({ initialPosts }: PostsClientProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = initialPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {filteredPosts.map((post) => (
          <PostItem key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
