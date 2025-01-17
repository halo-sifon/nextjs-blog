"use client";

import { useEffect } from "react";
import axiosInstance from "~/libs/request";

async function getPosts() {
  const response = await axiosInstance.get("/posts");
  console.log(response);

  return response.data;
}

export default function PostsPage() {
  useEffect(() => {
    getPosts();
  }, []);
  // 获取查询参数

  return <div>halo</div>;
}
